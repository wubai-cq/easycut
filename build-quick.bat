@echo off
chcp 65001 >nul
title 轻松切 - 快速打包
color 0B

echo.
echo ========================================
echo           轻松切 - 快速打包
echo ========================================
echo.

echo [1/3] 清理旧文件...
if exist "dist" rmdir /s /q "dist" 2>nul
echo ✅ 清理完成

echo.
echo [2/3] 开始打包...
call npm run build:win
if errorlevel 1 (
    echo ❌ 打包失败！
    pause
    exit /b 1
)
echo ✅ 打包完成

echo.
echo [3/3] 检查结果...
if exist "dist\轻松切-1.0.0.exe" (
    echo ✅ 安装包已生成：dist\轻松切-1.0.0.exe
    echo.
    echo 按任意键打开文件夹...
    pause >nul
    start explorer dist
) else (
    echo ❌ 安装包未找到！
    pause
)

echo.
echo 按任意键退出...
pause >nul
