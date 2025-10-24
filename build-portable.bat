@echo off
REM 打包为便携版（不创建安装包）
REM Build portable version

echo ============================================
echo Building Portable Version...
echo ============================================
echo.

REM 清理缓存
if exist "%LOCALAPPDATA%\electron-builder\Cache" (
    echo [INFO] Cleaning cache...
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache"
)

if exist "dist" (
    echo [INFO] Cleaning dist...
    rmdir /s /q "dist"
)

echo [INFO] Building portable app...
call npm run build:portable

if errorlevel 1 (
    echo [ERROR] Build failed
    pause
) else (
    echo.
    echo ============================================
    echo [SUCCESS] Portable build completed!
    echo ============================================
    echo.
    echo The portable app can be found in the 'dist' directory
    echo.
    pause
)

