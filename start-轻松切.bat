@echo off
title 轻松切
echo 启动轻松切网络切换工具...

REM 启动 Electron 应用
start "轻松切" /min electron .

REM 等待应用启动
timeout /t 3 /nobreak >nul

REM 尝试重命名进程（需要管理员权限）
powershell -Command "try { Get-Process electron | Where-Object {$_.MainWindowTitle -eq '轻松切'} | ForEach-Object { $_.ProcessName = '轻松切' } } catch { Write-Host '无法重命名进程，但应用已启动' }"

echo 轻松切已启动！
pause
