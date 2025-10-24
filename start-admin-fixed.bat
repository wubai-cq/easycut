@echo off
REM Auto request admin privileges and start network switching tool

>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

if '%errorlevel%' NEQ '0' (
    echo Requesting administrator privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

REM Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not detected
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] First run, installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    echo.
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

cls
echo ============================================
echo   Network Switching Tool - Admin Mode
echo ============================================
echo.
echo [OK] Administrator privileges granted
echo [OK] Node.js installed
echo [OK] Dependencies ready
echo.
echo Starting application...
echo.

npm start

if errorlevel 1 (
    echo.
    echo [ERROR] Application failed to start
    pause
)


