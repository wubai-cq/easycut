@echo off
echo === EasyCut 重置激活码 ===
echo.

echo 正在重置激活码...
echo.

REM 获取用户目录
set "USERPROFILE=%USERPROFILE%"
set "ACTIVATION_FILE=%USERPROFILE%\.easycut\activation.json"
set "EASYCUT_DIR=%USERPROFILE%\.easycut"

echo 用户目录: %USERPROFILE%
echo 激活文件: %ACTIVATION_FILE%
echo.

REM 检查激活文件是否存在
if exist "%ACTIVATION_FILE%" (
    echo 发现激活文件，正在删除...
    del "%ACTIVATION_FILE%"
    echo 激活文件已删除
) else (
    echo 未发现激活文件
)

REM 检查 .easycut 目录是否存在
if exist "%EASYCUT_DIR%" (
    echo 检查 .easycut 目录...
    dir "%EASYCUT_DIR%" /b >nul 2>&1
    if errorlevel 1 (
        echo 目录为空，正在删除...
        rmdir "%EASYCUT_DIR%"
        echo .easycut 目录已删除
    ) else (
        echo 目录不为空，保留目录
    )
) else (
    echo 未发现 .easycut 目录
)

echo.
echo 激活码重置完成！
echo.
echo 现在可以重新安装应用，需要重新输入激活码。
echo.
pause
