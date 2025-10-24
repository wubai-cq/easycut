@echo off
chcp 65001 >nul
title 轻松切 - 完整打包（安装包+便携版）
color 0D

echo.
echo ========================================
echo           轻松切 - 完整打包
echo           安装包 + 便携版
echo ========================================
echo.

echo [1/4] 清理旧文件...
if exist "dist" rmdir /s /q "dist" 2>nul
echo ✅ 清理完成

echo.
echo [2/4] 打包安装包...
call npm run build:win
if errorlevel 1 (
    echo ❌ 安装包打包失败！
    pause
    exit /b 1
)
echo ✅ 安装包打包完成

echo.
echo [3/4] 打包便携版...
call npm run build:portable
if errorlevel 1 (
    echo ❌ 便携版打包失败！
    pause
    exit /b 1
)
echo ✅ 便携版打包完成

echo.
echo [4/4] 检查结果...
set "count=0"

if exist "dist\轻松切-1.0.0.exe" (
    echo ✅ 安装包：dist\轻松切-1.0.0.exe
    set /a count+=1
)

if exist "dist\win-unpacked\轻松切.exe" (
    echo ✅ 便携版：dist\win-unpacked\轻松切.exe
    set /a count+=1
)

echo.
echo ========================================
echo           打包完成！
echo ========================================
echo.
echo 📦 成功生成 %count% 个文件：
echo.
if exist "dist\轻松切-1.0.0.exe" (
    echo   📁 安装包：dist\轻松切-1.0.0.exe
    echo      - 自动安装到系统
    echo      - 创建桌面快捷方式
    echo      - 支持卸载
    echo.
)
if exist "dist\win-unpacked\轻松切.exe" (
    echo   📁 便携版：dist\win-unpacked\轻松切.exe
    echo      - 无需安装，直接运行
    echo      - 可复制到其他电脑
    echo.
)
echo 🎯 应用信息：
echo   - 应用名称：轻松切
echo   - 进程名称：轻松切
echo   - 版本：1.0.0
echo   - 架构：x64
echo.
echo 按任意键打开文件夹...
pause >nul
start explorer dist
