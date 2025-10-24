@echo off
chcp 65001 >nul
title 轻松切 - 清理构建文件
color 0E

echo.
echo ========================================
echo           轻松切 - 清理构建文件
echo ========================================
echo.

echo 正在清理构建文件...
echo.

if exist "dist" (
    echo 删除 dist 目录...
    rmdir /s /q "dist"
    echo ✅ dist 目录已删除
) else (
    echo ℹ️  dist 目录不存在
)

if exist "build" (
    echo 删除 build 目录...
    rmdir /s /q "build"
    echo ✅ build 目录已删除
) else (
    echo ℹ️  build 目录不存在
)

if exist "node_modules\.cache" (
    echo 删除缓存文件...
    rmdir /s /q "node_modules\.cache"
    echo ✅ 缓存已清理
) else (
    echo ℹ️  缓存目录不存在
)

if exist "*.log" (
    echo 删除日志文件...
    del /q "*.log" 2>nul
    echo ✅ 日志文件已删除
)

echo.
echo ========================================
echo           清理完成！
echo ========================================
echo.
echo 已清理的内容：
echo   - dist 目录（构建输出）
echo   - build 目录（临时文件）
echo   - 缓存文件
echo   - 日志文件
echo.
echo 按任意键退出...
pause >nul
