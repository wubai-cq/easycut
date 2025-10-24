@echo off
title 轻松切 - 安装包打包
echo ========================================
echo           轻松切网络切换工具
echo           安装包打包脚本
echo ========================================
echo.

echo [1/3] 清理旧文件...
if exist "dist\轻松切-*.exe" del /q "dist\轻松切-*.exe"
echo 清理完成！

echo.
echo [2/3] 开始打包安装包...
call npm run build:win
if errorlevel 1 (
    echo 安装包打包失败！
    pause
    exit /b 1
)
echo 安装包打包完成！

echo.
echo [3/3] 检查结果...
if exist "dist\轻松切-1.0.0.exe" (
    echo ✓ 安装包已生成：dist\轻松切-1.0.0.exe
    echo.
    echo 安装包特点：
    echo - 自动安装到系统
    echo - 创建桌面快捷方式
    echo - 进程名称显示为"轻松切"
    echo - 支持卸载
) else (
    echo ✗ 安装包未找到！
    pause
    exit /b 1
)

echo.
echo ========================================
echo           安装包打包完成！
echo ========================================
echo.
echo 按任意键退出...
pause >nul
