@echo off
echo 正在修复应用程序元数据...

REM 检查 rcedit 是否存在
if not exist "%~dp0node_modules\rcedit\bin\rcedit.exe" (
    echo 错误: rcedit 工具未找到
    pause
    exit /b 1
)

REM 修复元数据
"%~dp0node_modules\rcedit\bin\rcedit.exe" "%~dp0EasyCut.exe" --set-version-string "FileDescription" "EasyCut" --set-version-string "ProductName" "EasyCut" --set-version-string "CompanyName" "EasyCut" --set-version-string "LegalCopyright" "Copyright (C) 2024 wubai rights reserved." --set-version-string "OriginalFilename" "EasyCut.exe" --set-version-string "InternalName" "EasyCut" --set-version-string "LegalTrademarks" "EasyCut" --set-file-version "1.0.0" --set-product-version "1.0.0"

if %errorlevel% equ 0 (
    echo 元数据修复成功！
) else (
    echo 元数据修复失败！
)

pause
