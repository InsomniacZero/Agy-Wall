# Insom Agy Wall Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-blue.svg)](https://github.com/InsomniacZero/Agy-Wall)
[![Antigravity](https://img.shields.io/badge/Antigravity-v2.28.2%20%7C%20v2.24.0-success.svg)](https://antigravity.google)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)](https://github.com/InsomniacZero/Agy-Wall)
[![Repository](https://img.shields.io/badge/GitHub-InsomniacZero%2FAgy--Wall-181717?logo=github)](https://github.com/InsomniacZero/Agy-Wall)

> **Live, animated ASCII backgrounds for Google Antigravity.**  
> 23 dynamic scenes, unified whole-app recoloring, interactive picker, zero external dependencies, and 100% local execution.

**[Explore the Repository & Releases on GitHub →](https://github.com/InsomniacZero/Agy-Wall)** · **[Watch Quick Demo Video →](assets/demo.mp4)**

![Jellyfish theme with the picker open](assets/picker.jpg)

> **Disclaimer:** Unofficial community modification. Not affiliated with or endorsed by Google. Patches your local Antigravity installation with automated cryptographic backup and verified restore safeguards.

---

## Visual Preview

| Aurora | Ember Dunes | Koi Pond |
| :---: | :---: | :---: |
| ![Aurora](assets/aurora.jpg) | ![Ember Dunes](assets/dunes.jpg) | ![Koi Pond](assets/koi.jpg) |
| **Sakura** | **Night Rain** | **Retro Sunset** |
| ![Sakura](assets/sakura.jpg) | ![Night Rain](assets/rain.jpg) | ![Retro Sunset](assets/retro.jpg) |

---

## Highlights & Features

- **23 Procedural Live Themes**: 9 light and 14 dark presets including *Cloud Drift*, *Aurora*, *Honu Lagoon*, *Koi Pond*, *Jellyfish*, *Paper Boats*, *Sakura*, *Fireflies*, *Moonlit*, *Ember Dunes*, *Night Rain*, *Snowfall*, *Sky Lanterns*, *Windy Meadow*, *Spiral Galaxy*, *Bamboo Grove*, *Digital Rain*, *Morning Tide*, *Autumn Leaves*, *Alpine Dawn*, *Retro Sunset*, *Lava Lamp*, and *Starry Catnap*.
- **Harmonized Whole-App Theming**: Sidebar, context menus, composer, title bar, buttons, and system controls tint harmoniously to match every scene.
- **Instant Three-Way Picker**: Access themes anytime by clicking **Themes** in the header, pressing <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>W</kbd>, or typing `/theme` directly into the chat composer.
- **Controls & Tuning**: Pause animation motion, adjust intensity slider, or click **Off** to revert to the factory look on the fly.
- **Non-Intrusive Layout**: ASCII characters float gracefully behind text layers without capturing clicks or interfering with cursor positioning.
- **Performance Optimized**: Rendering completely suspends when the application window is hidden or minimized, and respects system `prefers-reduced-motion` preferences.
- **100% Private & Offline**: Zero network requests or telemetry. Preferences persist locally in your user profile.
- **No Node.js Required**: Bundled wrapper scripts seamlessly leverage Antigravity's built-in Electron runtime if system Node.js is not installed!

---

## Supported Builds

The manager cryptographically inspects and validates the SHA-256 hash of Antigravity's `app.asar` before applying patches:

| Platform | Antigravity Version | Original SHA-256 Hash |
| :--- | :--- | :--- |
| **Windows** | `v2.28.2` | `046fa2ba9abe96bc915eb7ed12887c067396a8a12148842ab4f4e2cd05a68feb` |
| **Linux** | `v2.24.0` | `bd10a0054ca3ad469142b2c2757566493ecc0afb934b9a61ce45d38a4d09316e` |

*(Custom or newer builds can be patched using the `--force` flag at your own discretion.)*

---

## Installation

### Method A: Windows Installation

1. Download the latest release from [GitHub Releases](https://github.com/InsomniacZero/Agy-Wall/releases) (or download repository ZIP) and extract it.
2. Close Antigravity.
3. Choose your preferred launcher:
   - **One-Click Batch**: Double-click `install.bat`.
   - **PowerShell**: Right-click `install.ps1` and select **Run with PowerShell** (or run `.\install.ps1` in a terminal).
   - **CLI (Node.js)**: Open terminal in folder and run:
     ```powershell
     node manage-wallpapers.cjs install
     ```
4. Launch Antigravity, click **Themes** in the top-right toolbar, and select your scene!

> **Note for Windows:** If Node.js is not installed on your system, `install.bat` and `install.ps1` automatically detect and use Antigravity's bundled runtime.

---

### Method B: Linux Installation

1. Download and extract the release folder.
2. Ensure Antigravity is closed.
3. Run the installer script:
   - **One-Click / GUI**: Double-click `install.sh` in your file manager (it auto-spawns a visible terminal).
   - **Terminal**: Run:
     ```bash
     chmod +x install.sh
     ./install.sh
     ```
   - **CLI (Node.js)**:
     ```bash
     node manage-wallpapers.cjs install
     ```
4. If Antigravity is installed in a system directory (e.g., `/opt/Antigravity`), `install.sh` will automatically prompt for `sudo` privilege elevation.

#### Linux AppImage Users
AppImages run from temporary read-only FUSE mounts (`/tmp/.mount_*`). To use Insom Agy Wall with an AppImage:
```bash
# 1. Extract the AppImage
./Antigravity.AppImage --appimage-extract

# 2. Patch the extracted application
node manage-wallpapers.cjs install --asar squashfs-root/resources/app.asar

# 3. Launch from the extracted directory
./squashfs-root/AppRun
```

---

## Bundled Node Fallback

You do **not** need Node.js installed to use Insom Agy Wall!

Antigravity is an Electron application containing a full Node.js environment. All wrapper scripts (`install.bat`, `install.ps1`, `install.sh`, `uninstall.sh`) automatically fallback to Antigravity's own executable using:
```bash
ELECTRON_RUN_AS_NODE=1 ELECTRON_NO_ASAR=1 <antigravity-bin> manage-wallpapers.cjs <action>
```
This guarantees 100% zero-dependency execution out of the box on both Windows and Linux.

---

## Uninstallation & Safe Rollback

To restore Antigravity back to its pristine factory state at any time:

- **Windows**: Double-click `uninstall.bat` (or run `.\uninstall.ps1` / `node manage-wallpapers.cjs restore`).
- **Linux**: Run `./uninstall.sh` (or `node manage-wallpapers.cjs restore`).

The restore process cryptographically checks the backup hash (`app.asar.ascii-wallpapers.backup`), verifies that it matches the original unmodified build, restores it atomically, and leaves your preferences and system intact.

---

## Advanced CLI Usage

The management script supports flexible arguments in any order:

```bash
# Verify integrity and simulate repack without writing changes
node manage-wallpapers.cjs verify

# Detect and print the resolved Antigravity app.asar path
node manage-wallpapers.cjs --print-path

# Specify a custom ASAR location or directory
node manage-wallpapers.cjs install --asar /custom/path/resources/app.asar

# Force installation on uninspected or newly updated builds
node manage-wallpapers.cjs install --force
```

---

## Troubleshooting & FAQ

| Problem | Cause | Resolution |
| :--- | :--- | :--- |
| **"Target locked (EBUSY / EPERM / ETXTBSY)"** | Antigravity is actively running and holding an OS lock on `app.asar`. | Close Antigravity before running installer. The wrapper scripts will offer to close it automatically. |
| **"Permission denied (EACCES)"** | Antigravity is installed in a system directory (e.g. `/opt` or `Program Files`). | **Linux**: Run `./install.sh` (it auto-escalates via `sudo`).<br>**Windows**: Right-click Command Prompt / PowerShell and select **Run as Administrator**. |
| **"Temporary AppImage FUSE mount"** | Running Antigravity from an AppImage mount (`/tmp/.mount_*`), which is ephemeral and read-only. | Extract the AppImage first (`./Antigravity.AppImage --appimage-extract`), then patch `squashfs-root/resources/app.asar` and run `./squashfs-root/AppRun`. |
| **"App files have changed / SHA-256 mismatch"** | A new version of Antigravity was updated by Google, modifying the original ASAR hash. | Run `install --force` to patch uninspected builds, or check the [GitHub releases](https://github.com/InsomniacZero/Agy-Wall/releases) for an updated profile. |
| **Themes button does not appear** | Window has not reloaded after installation. | Completely close and reopen Antigravity. You can also open the picker directly with <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>W</kbd> or typing `/theme` in the prompt composer. |
| **No Node.js installed on PC** | Node.js is not present in system PATH. | No installation needed! All `.bat`, `.ps1`, and `.sh` scripts automatically detect and execute using Antigravity's own bundled Node.js runtime. |

---

## Project Structure & Architecture

```
Agy-Wall/
├── ascii-wallpapers.js       # Core theme engine, CSS recoloring, UI picker component
├── wallpaper-scenes.js       # 23 procedural mathematical ASCII character renderers
├── wallpapers-main.js        # Main process bridge for cross-session settings persistence
├── manage-wallpapers.cjs     # Pure Node.js ASAR parser, repacker, and transactional installer
├── install.bat / .ps1        # Windows one-click installers with bundled runtime fallback
├── uninstall.bat / .ps1      # Windows one-click restore scripts
├── install.sh / uninstall.sh # Linux POSIX wrapper scripts with GUI terminal spawn & sudo elevation
├── scripts/
│   └── package-release.cjs   # Automated release packager creating dist/insom-agy-wall-project.zip
├── assets/                   # Theme preview imagery and documentation graphics
├── index.html                # Interactive web showcase and theme preview gallery
└── package.json              # Project metadata and lifecycle scripts
```

### How the Patch Works

1. **ASAR Header Parsing**: Decodes the byte offsets and sizes in the binary header without unpacking files to disk.
2. **Selective Injection**: Appends the theme manager to `dist/preload.js` (isolated renderer bridge) and `dist/main.js` (persistence handler).
3. **De-duplication**: Automatically strips any existing `// BEGIN LOCAL ASCII WALLPAPERS` blocks before repacking, ensuring idempotent updates.
4. **Header Recomputation**: Recalculates file sizes, byte offsets, and SHA-256 chunk integrity blocks for all files.
5. **Transactional Safety**: Safely writes to `.ascii-wallpapers.tmp`, atomically renames with retry loops for file locks, and commits `.ascii-wallpapers.json` receipt strictly upon success.

---

## Contributing & License

Contributions, new theme submissions, and PRs are welcome! Visit [GitHub Repository](https://github.com/InsomniacZero/Agy-Wall).

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
