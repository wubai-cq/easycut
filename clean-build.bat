@echo off
REM 清理 electron-builder 缓存并重新打包
REM Clean electron-builder cache and rebuild

echo ============================================
echo Cleaning electron-builder cache...
echo ============================================
echo.

REM 清理 electron-builder 缓存
if exist "%LOCALAPPDATA%\electron-builder\Cache" (
    echo [INFO] Removing electron-builder cache...
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache"
)

REM 清理项目构建文件
if exist "dist" (
    echo [INFO] Removing dist directory...
    rmdir /s /q "dist"
)

echo [INFO] Cache cleaned successfully!
echo.
echo Now running build...
echo.

call build.bat

