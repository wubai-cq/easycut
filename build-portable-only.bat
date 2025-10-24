@echo off
chcp 65001 >nul
title 轻松切 - 便携版打包
color 0C

echo.
echo ========================================
echo           轻松切 - 便携版打包
echo ========================================
echo.

echo [1/3] 清理旧文件...
if exist "dist\win-unpacked" rmdir /s /q "dist\win-unpacked" 2>nul
echo ✅ 清理完成

echo.
echo [2/3] 开始打包便携版...
call npm run build:portable
if errorlevel 1 (
    echo ❌ 便携版打包失败！
    pause
    exit /b 1
)
echo ✅ 便携版打包完成

echo.
echo [3/3] 检查结果...
if exist "dist\win-unpacked\轻松切.exe" (
    echo ✅ 便携版已生成：dist\win-unpacked\轻松切.exe
    echo.
    echo 📦 便携版特点：
    echo   - 无需安装，直接运行
    echo   - 可复制到其他电脑使用
    echo   - 进程名称显示为"轻松切"
    echo   - 支持管理员权限
    echo.
    echo 按任意键打开文件夹...
    pause >nul
    start explorer dist\win-unpacked
) else (
    echo ❌ 便携版未找到！
    pause
)

echo.
echo 按任意键退出...
pause >nul
