<#
.SYNOPSIS
Insom Agy Wall Project - Modern PowerShell Installer
#>
$ErrorActionPreference = "Continue"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "         Insom Agy Wall Project Installer          " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$runningProc = Get-Process -Name antigravity -ErrorAction SilentlyContinue | Select-Object -First 1
$detectedAsar = $null
$runningExe = $null

if ($runningProc) {
    try {
        $runningExe = $runningProc.Path
    } catch {}
    if ($runningExe) {
        $parentDir = Split-Path -Parent $runningExe
        $asarCandidate = Join-Path $parentDir "resources\app.asar"
        if (Test-Path $asarCandidate) {
            $detectedAsar = $asarCandidate
        }
    }
    Write-Host "[Insom Agy Wall] Antigravity is currently running." -ForegroundColor Yellow
    $prompt = try { Read-Host "Would you like to close Antigravity automatically? (Y/N, default Y)" } catch { "Y" }
    if ([string]::IsNullOrWhiteSpace($prompt) -or $prompt -match "^[Yy]") {
        Write-Host "[Insom Agy Wall] Closing Antigravity..." -ForegroundColor Gray
        Stop-Process -Name antigravity -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    } else {
        Write-Host "[Insom Agy Wall] Please close Antigravity and press Enter to continue..." -ForegroundColor Yellow
        try { [void][System.Console]::ReadLine() } catch {}
    }
}

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$nodeBin = $null
$useElectron = $false

if ($nodeCmd) {
    $nodeBin = "node"
} else {
    Write-Host "[Insom Agy Wall] System Node.js not found. Checking bundled Antigravity runtime..." -ForegroundColor Gray
    $candidates = @(
        $runningExe,
        "$env:LOCALAPPDATA\Programs\antigravity\antigravity.exe",
        "$env:ProgramFiles\Antigravity\antigravity.exe",
        "${env:ProgramFiles(x86)}\Antigravity\antigravity.exe"
    )
    foreach ($c in $candidates) {
        if ($c -and (Test-Path $c)) {
            $nodeBin = $c
            $useElectron = $true
            break
        }
    }
}

if (-not $nodeBin) {
    Write-Host "[Insom Agy Wall] Error: Neither Node.js nor Antigravity executable was found." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org or install Antigravity."
    try { Read-Host "Press Enter to exit..." } catch {}
    exit 1
}

$scriptPath = Join-Path $PSScriptRoot "manage-wallpapers.cjs"
$cliArgs = @($scriptPath, "install")
if ($detectedAsar) {
    $cliArgs += @("--asar", $detectedAsar)
}
if ($args) {
    $cliArgs += $args
}

if ($useElectron) {
    $env:ELECTRON_RUN_AS_NODE = "1"
    $env:ELECTRON_NO_ASAR = "1"
}

& $nodeBin $cliArgs
$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "[Insom Agy Wall] Completed successfully. Launch Antigravity and enjoy your live wallpapers!" -ForegroundColor Green
} else {
    Write-Host "[Insom Agy Wall] Installation failed with exit code $exitCode." -ForegroundColor Red
}

Write-Host ""
try {
    if ($Host.Name -match "ConsoleHost" -or [Environment]::UserInteractive) {
        Read-Host "Press Enter to exit..."
    }
} catch {}
exit $exitCode
