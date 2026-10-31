@echo off
setlocal enabledelayedexpansion
title Insom Agy Wall - Uninstaller

echo ===================================================
echo           Insom Agy Wall Project Uninstaller       
echo ===================================================
echo.

set "RUNNING_EXE="
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Process -Name antigravity -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path -First 1)" 2^>nul`) do (
    set "RUNNING_EXE=%%i"
)

set "DETECTED_ASAR="
if defined RUNNING_EXE (
    for %%F in ("!RUNNING_EXE!") do set "RUNNING_DIR=%%~dpF"
    if exist "!RUNNING_DIR!resources\app.asar" (
        set "DETECTED_ASAR=!RUNNING_DIR!resources\app.asar"
    )
    echo [Insom Agy Wall] Antigravity is currently running.
    set /p "AUTO_CLOSE=Would you like to close Antigravity automatically? (Y/N, default Y): "
    if /i "!AUTO_CLOSE!"=="" set "AUTO_CLOSE=Y"
    if /i "!AUTO_CLOSE!"=="Y" (
        echo [Insom Agy Wall] Closing Antigravity...
        taskkill /F /IM antigravity.exe >nul 2>&1
        timeout /t 2 >nul 2>&1 || ping -n 3 127.0.0.1 >nul 2>&1
    ) else (
        echo [Insom Agy Wall] Please close Antigravity and press any key to continue...
        pause >nul
    )
)

set "NODE_CMD="
where node >nul 2>&1
if !errorlevel! equ 0 (
    set "NODE_CMD=node"
) else (
    echo [Insom Agy Wall] System Node.js not detected. Checking for bundled Antigravity runtime...
    set "BUNDLED_CANDIDATE="
    if defined RUNNING_EXE if exist "!RUNNING_EXE!" set "BUNDLED_CANDIDATE=!RUNNING_EXE!"
    if not defined BUNDLED_CANDIDATE if exist "%LOCALAPPDATA%\Programs\antigravity\antigravity.exe" (
        set "BUNDLED_CANDIDATE=%LOCALAPPDATA%\Programs\antigravity\antigravity.exe"
    )
    if not defined BUNDLED_CANDIDATE if exist "%PROGRAMFILES%\Antigravity\antigravity.exe" (
        set "BUNDLED_CANDIDATE=%PROGRAMFILES%\Antigravity\antigravity.exe"
    )
    set "PROG_X86=!PROGRAMFILES(X86)!"
    if not defined BUNDLED_CANDIDATE if defined PROG_X86 if exist "!PROG_X86!\Antigravity\antigravity.exe" (
        set "BUNDLED_CANDIDATE=!PROG_X86!\Antigravity\antigravity.exe"
    )
    if defined BUNDLED_CANDIDATE (
        echo [Insom Agy Wall] Using bundled Antigravity runtime: !BUNDLED_CANDIDATE!
        set ELECTRON_RUN_AS_NODE=1
        set ELECTRON_NO_ASAR=1
        set "NODE_CMD=!BUNDLED_CANDIDATE!"
    )
)

if not defined NODE_CMD (
    echo [Insom Agy Wall] Error: Neither Node.js nor Antigravity executable was found.
    echo Please install Node.js from https://nodejs.org or ensure Antigravity is installed.
    echo.
    pause
    exit /b 1
)

set "SCRIPT_PATH=%~dp0manage-wallpapers.cjs"
if defined DETECTED_ASAR (
    "!NODE_CMD!" "!SCRIPT_PATH!" restore --asar "!DETECTED_ASAR!" %*
) else (
    "!NODE_CMD!" "!SCRIPT_PATH!" restore %*
)
set "EXIT_CODE=!errorlevel!"

echo.
if !EXIT_CODE! equ 0 (
    echo [Insom Agy Wall] Antigravity successfully restored to stock condition.
) else (
    echo [Insom Agy Wall] Restore failed with exit code !EXIT_CODE!.
)
echo.
pause
exit /b !EXIT_CODE!
