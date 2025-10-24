@echo off
title 创建默认图标
echo ========================================
echo           创建默认图标
echo ========================================
echo.

echo 正在创建默认图标文件...

REM 创建一个简单的SVG图标（网络切换主题）
echo ^<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg"^> > assets\icon.svg
echo   ^<rect width="256" height="256" fill="#0E1122"/^> >> assets\icon.svg
echo   ^<circle cx="128" cy="128" r="100" fill="none" stroke="#1D2A55" stroke-width="8"/^> >> assets\icon.svg
echo   ^<circle cx="128" cy="128" r="60" fill="none" stroke="#28a745" stroke-width="6"/^> >> assets\icon.svg
echo   ^<circle cx="128" cy="128" r="20" fill="#28a745"/^> >> assets\icon.svg
echo   ^<path d="M 80 80 L 176 176 M 176 80 L 80 176" stroke="#ffc107" stroke-width="4"/^> >> assets\icon.svg
echo   ^<text x="128" y="200" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16"^>轻松切^</text^> >> assets\icon.svg
echo ^</svg^> >> assets\icon.svg

echo SVG 图标已创建：assets\icon.svg

REM 提示用户如何转换为PNG
echo.
echo 请将 assets\icon.svg 转换为 PNG 格式：
echo 1. 使用在线工具：https://convertio.co/svg-png/
echo 2. 或使用工具如 GIMP、Photoshop
echo 3. 保存为 assets\icon.png (256x256 像素)
echo.
echo 或者直接运行：npm run build
echo （将使用默认图标）

pause
