@echo off
REM 重新打包应用（清理缓存 + 完整构建）
REM Rebuild application with clean cache

echo ============================================
echo Rebuilding with Administrator Privileges...
echo ============================================
echo.

REM 清理旧的构建文件
if exist "dist" (
    echo [INFO] Removing old dist directory...
    rmdir /s /q "dist"
)

REM 清理 electron-builder 缓存
if exist "%LOCALAPPDATA%\electron-builder\Cache" (
    echo [INFO] Cleaning electron-builder cache...
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache"
)

echo [INFO] Cache cleaned!
echo.
echo [INFO] Starting build with admin privileges support...
echo This may take a few minutes...
echo.

call npm run build:win

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed
    pause
    exit /b 1
) else (
    echo.
    echo ============================================
    echo [SUCCESS] Build completed!
    echo ============================================
    echo.
    echo The installer can be found in the 'dist' directory
    echo.
    echo IMPORTANT: The shortcuts will be set to run as administrator.
    echo If it doesn't work, please see '管理员权限说明.txt'
    echo.
    pause
)

