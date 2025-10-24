@echo off
:: 以管理员身份启动网络切换工具
:: Start Network Switcher with Administrator privileges

:: 设置控制台编码为 UTF-8，解决中文乱码
chcp 65001 >nul 2>&1

echo ============================================
echo Network Switcher - Starting...
echo ============================================
echo.

:: 检查Node.js是否安装
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 检查是否已安装依赖
if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing dependencies...
    echo.
    call npm install
    echo.
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

:: 启动应用
echo [INFO] Starting Electron application...
echo [WARN] Please make sure to run this with Administrator privileges
echo.
npm start

if errorlevel 1 (
    echo.
    echo [ERROR] Application exited with an error
    pause
)

