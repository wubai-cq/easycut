@echo off
chcp 65001 >nul
title EasyCut - Build Script
color 0A


echo.
echo ========================================
echo           EasyCut Network Switcher
echo           Build Script v2.0
echo ========================================
echo.

echo [0/6] Set working directory...
cd /d "%~dp0"
echo Current dir: %CD%
if not exist "main.js" (
    echo ERROR: main.js not found. Run this script at project root.
    echo Current dir: %CD%
    pause
    exit /b 1
)
echo OK: working directory set


echo [1/6] Check environment...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js
    echo URL: https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js found

where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found
    pause
    exit /b 1
)
echo OK: npm found


echo.
echo [2/6] Clean old files...
if exist "dist" (
    echo Clean dist ...
    rmdir /s /q "dist"
)
if exist "build" (
    echo Clean build ...
    rmdir /s /q "build"
)
if exist "node_modules\.cache" (
    echo Clean cache ...
    rmdir /s /q "node_modules\.cache"
)
echo OK: Clean completed


echo.
echo [3/6] Install dependencies...
echo Installing, please wait...
call npm install --silent
if errorlevel 1 (
    echo ERROR: Install failed!
    echo Try mirror: npm config set registry https://registry.npmmirror.com
    pause
    exit /b 1
)
echo OK: Dependencies installed


echo.
echo [4/6] Check required files...
if not exist "main.js" (
    echo ERROR: main.js not found
    pause
    exit /b 1
)
if not exist "index.html" (
    echo ERROR: index.html not found
    pause
    exit /b 1
)
if not exist "renderer.js" (
    echo ERROR: renderer.js not found
    pause
    exit /b 1
)
if not exist "styles.css" (
    echo ERROR: styles.css not found
    pause
    exit /b 1
)
if not exist "assets\icon.svg" (
    echo ERROR: assets\icon.svg not found
    pause
    exit /b 1
)
echo OK: Required files found


echo.
echo [5/6] Build installer...
echo Building installer...
call npm run build:win
if errorlevel 1 (
    echo ERROR: Build failed!
    echo Check the error output above.
    pause
    exit /b 1
)
echo OK: Build completed

rem portable build removed; only installer generated


echo.
echo [6/6] Verify output...
set "success=0"

echo Check installer...
if exist "dist\EasyCut-1.0.0.exe" (
    echo OK: found dist\EasyCut-1.0.0.exe
    set "success=1"
) else (
    echo WARN: installer not found
)

rem only check installer

echo Check other possible files...
if exist "dist\EasyCut-1.0.0-portable.exe" (
    echo OK: found dist\EasyCut-1.0.0-portable.exe
    set "success=1"
)

if exist "dist\EasyCut-1.0.0-setup.exe" (
    echo OK: found dist\EasyCut-1.0.0-setup.exe
    set "success=1"
)

if "%success%"=="0" (
    echo.
    echo ERROR: No output files found
    pause
    exit /b 1
)


echo.
echo ========================================
echo           Build finished successfully!
echo ========================================
echo.
echo(================ Output Summary ================
if exist "dist\EasyCut-1.0.0.exe" (
    echo( - Installer: dist\EasyCut-1.0.0.exe
)
if exist "dist\EasyCut-1.0.0-setup.exe" (
    echo( - Setup:     dist\EasyCut-1.0.0-setup.exe
)
if exist "dist\EasyCut-1.0.0-portable.exe" (
    echo( - Portable:  dist\EasyCut-1.0.0-portable.exe
)
echo(
echo(App Info:
echo( - Name: EasyCut
echo( - Window Title: EasyCut
echo( - Requires Administrator for network operations

echo.
echo(Press any key to exit...
pause >nul