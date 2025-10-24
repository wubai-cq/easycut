@echo off
chcp 65001 >nul
title 轻松切 - 打包菜单
color 0F

:menu
cls
echo.
echo ========================================
echo           轻松切网络切换工具
echo           打包菜单 v2.0
echo ========================================
echo.
echo 请选择打包方式：
echo.
echo [1] 完整打包（推荐）
echo     - 生成安装包 + 便携版
echo     - 包含所有功能
echo     - 适合正式发布
echo.
echo [2] 快速打包
echo     - 仅生成安装包
echo     - 快速构建
echo     - 适合测试
echo.
echo [3] 便携版打包
echo     - 仅生成便携版
echo     - 无需安装
echo     - 适合绿色使用
echo.
echo [4] 清理构建文件
echo     - 清理所有构建输出
echo     - 释放磁盘空间
echo.
echo [0] 退出
echo.
echo ========================================
set /p choice=请输入选择 (0-4): 

if "%choice%"=="1" goto full
if "%choice%"=="2" goto quick
if "%choice%"=="3" goto portable
if "%choice%"=="4" goto clean
if "%choice%"=="0" goto exit
echo 无效选择，请重新输入...
pause
goto menu

:full
echo.
echo 启动完整打包...
call build-all.bat
goto end

:quick
echo.
echo 启动快速打包...
call build-quick.bat
goto end

:portable
echo.
echo 启动便携版打包...
call build-portable-only.bat
goto end

:clean
echo.
echo 启动清理...
call build-clean.bat
goto end

:exit
echo.
echo 感谢使用！
exit /b 0

:end
echo.
echo 按任意键返回菜单...
pause >nul
goto menu
