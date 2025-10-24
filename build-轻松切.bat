@echo off
title 轻松切 - 打包脚本
echo ========================================
echo           轻松切网络切换工具
echo           打包脚本 v1.0
echo ========================================
echo.

echo [1/5] 清理旧的构建文件...
if exist "dist" rmdir /s /q "dist"
if exist "build" rmdir /s /q "build"
echo 清理完成！

echo.
echo [2/5] 安装依赖包...
call npm install
if errorlevel 1 (
    echo 依赖安装失败！
    pause
    exit /b 1
)
echo 依赖安装完成！

echo.
echo [3/5] 开始打包应用...
call npm run build
if errorlevel 1 (
    echo 打包失败！
    pause
    exit /b 1
)
echo 打包完成！

echo.
echo [4/5] 检查构建结果...
if exist "dist\轻松切-1.0.0.exe" (
    echo ✓ 安装包已生成：dist\轻松切-1.0.0.exe
) else (
    echo ✗ 安装包未找到！
    pause
    exit /b 1
)

echo.
echo [5/5] 创建便携版...
call npm run build:portable
if errorlevel 1 (
    echo 便携版打包失败！
) else (
    echo ✓ 便携版已生成：dist\win-unpacked\
)

echo.
echo ========================================
echo           打包完成！
echo ========================================
echo.
echo 生成的文件：
echo - 安装包：dist\轻松切-1.0.0.exe
echo - 便携版：dist\win-unpacked\轻松切.exe
echo.
echo 按任意键退出...
pause >nul
