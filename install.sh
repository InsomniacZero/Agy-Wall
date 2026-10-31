#!/bin/sh
set -e

# Auto-spawn a visible terminal emulator if launched from a GUI file manager
if [ -z "$AGY_TERMINAL_SPAWNED" ] && [ ! -t 0 ] && [ ! -t 1 ]; then
  export AGY_TERMINAL_SPAWNED=1
  for term in x-terminal-emulator gnome-terminal ptyxis konsole xfce4-terminal kitty alacritty foot urxvt xterm; do
    if command -v "$term" >/dev/null 2>&1; then
      case "$term" in
        gnome-terminal) exec gnome-terminal -- "$0" "$@" ;;
        ptyxis) exec ptyxis -- "$0" "$@" ;;
        konsole) exec konsole -e "$0" "$@" ;;
        xfce4-terminal) exec xfce4-terminal -x "$0" "$@" ;;
        *) exec "$term" -e "$0" "$@" ;;
      esac
    fi
  done
fi

pause_on_exit() {
  exit_status=$?
  trap - EXIT INT TERM
  if [ -t 0 ] || [ -n "$AGY_TERMINAL_SPAWNED" ]; then
    printf "\nPress Enter to exit..."
    read -r _ </dev/tty 2>/dev/null || read -r _ 2>/dev/null || true
  fi
  exit "$exit_status"
}
trap pause_on_exit EXIT INT TERM

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

printf "===================================================\n"
printf "         Insom Agy Wall Project Installer          \n"
printf "===================================================\n\n"

# Check for running Antigravity process
RUNNING_PID=""
RUNNING_EXE=""
if command -v pgrep >/dev/null 2>&1; then
  RUNNING_PID="$(pgrep -o -x 'antigravity' 2>/dev/null || true)"
elif command -v pidof >/dev/null 2>&1; then
  RUNNING_PID="$(pidof antigravity 2>/dev/null | awk '{print $1}')"
fi

if [ -n "$RUNNING_PID" ] && [ -d "/proc/$RUNNING_PID" ]; then
  RUNNING_EXE="$(readlink -f "/proc/$RUNNING_PID/exe" 2>/dev/null || true)"
fi

if [ -n "$RUNNING_PID" ]; then
  printf "[Insom Agy Wall] Antigravity is currently running (PID %s).\n" "$RUNNING_PID"
  if [ -t 0 ]; then
    printf "Would you like to close Antigravity automatically? [Y/n]: "
    read -r REPLY || REPLY="y"
  else
    # Non-interactive / piped input
    read -r REPLY 2>/dev/null || REPLY="n"
  fi
  case "$REPLY" in
    [nN]*)
      printf "[Insom Agy Wall] Continuing without terminating Antigravity...\n"
      ;;
    *)
      printf "[Insom Agy Wall] Closing Antigravity...\n"
      kill "$RUNNING_PID" 2>/dev/null || true
      sleep 1
      if kill -0 "$RUNNING_PID" 2>/dev/null; then
        kill -9 "$RUNNING_PID" 2>/dev/null || true
        sleep 1
      fi
      ;;
  esac
fi

# Locate Node.js runtime (or bundled Antigravity Electron runtime fallback)
NODE_BIN=""
USE_BUNDLED_ELECTRON=0

if command -v node >/dev/null 2>&1; then
  NODE_BIN="node"
else
  printf "[Insom Agy Wall] System Node.js not found. Checking bundled Antigravity runtime...\n"
  CANDIDATES="
  $RUNNING_EXE
  $HOME/Apps/Antigravity-x64/antigravity
  $HOME/Apps/Antigravity/antigravity
  /opt/Antigravity/antigravity
  /opt/antigravity/antigravity
  /usr/lib/antigravity/antigravity
  /usr/share/antigravity/antigravity
  "
  for cand in $CANDIDATES; do
    if [ -n "$cand" ] && [ -x "$cand" ]; then
      NODE_BIN="$cand"
      USE_BUNDLED_ELECTRON=1
      printf "[Insom Agy Wall] Using bundled Antigravity runtime: %s\n" "$NODE_BIN"
      break
    fi
  done
fi

if [ -z "$NODE_BIN" ]; then
  printf "[Insom Agy Wall] Error: Neither Node.js nor Antigravity executable was found.\n" >&2
  printf "Please install Node.js (https://nodejs.org) or install Antigravity.\n" >&2
  exit 1
fi

# Determine target ASAR directory and check permissions
if [ "$USE_BUNDLED_ELECTRON" = "1" ]; then
  TARGET_ASAR="$(ELECTRON_RUN_AS_NODE=1 ELECTRON_NO_ASAR=1 "$NODE_BIN" "$SCRIPT_DIR/manage-wallpapers.cjs" --print-path "$@" 2>/dev/null || true)"
else
  TARGET_ASAR="$("$NODE_BIN" "$SCRIPT_DIR/manage-wallpapers.cjs" --print-path "$@" 2>/dev/null || true)"
fi

if [ -n "$TARGET_ASAR" ]; then
  TARGET_DIR="$(dirname "$TARGET_ASAR")"
  if [ -d "$TARGET_DIR" ] && [ ! -w "$TARGET_DIR" ] && [ "$(id -u)" -ne 0 ]; then
    printf "[Insom Agy Wall] Target directory (%s) requires administrative privileges.\n" "$TARGET_DIR"
    printf "[Insom Agy Wall] Auto-escalating with sudo...\n"
    if command -v sudo >/dev/null 2>&1; then
      trap - EXIT INT TERM
      exec sudo "$0" "$@"
    else
      printf "[Insom Agy Wall] Error: sudo is required to write to %s\n" "$TARGET_DIR" >&2
      exit 1
    fi
  fi
fi

if [ "$USE_BUNDLED_ELECTRON" = "1" ]; then
  export ELECTRON_RUN_AS_NODE=1
  export ELECTRON_NO_ASAR=1
fi

"$NODE_BIN" "$SCRIPT_DIR/manage-wallpapers.cjs" install "$@"
printf "\n[Insom Agy Wall] Completed successfully. Launch Antigravity and enjoy your live wallpapers!\n"
