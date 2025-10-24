; EasyCut 安装脚本
; 在卸载时重置激活码

!macro customInstall
    DetailPrint "EasyCut 安装完成"
    DetailPrint "激活码将存储在用户目录下"
    
    ; 修复可执行文件元数据
    DetailPrint "正在修复应用程序元数据..."
    
    ; 使用 rcedit 修复元数据和图标
    ExecWait '"$INSTDIR\node_modules\rcedit\bin\rcedit.exe" "$INSTDIR\EasyCut.exe" --set-version-string "FileDescription" "EasyCut" --set-version-string "ProductName" "EasyCut" --set-version-string "CompanyName" "EasyCut" --set-version-string "LegalCopyright" "Copyright (C) 2024 wubai rights reserved." --set-version-string "OriginalFilename" "EasyCut.exe" --set-version-string "InternalName" "EasyCut" --set-version-string "LegalTrademarks" "EasyCut" --set-file-version "1.0.0" --set-product-version "1.0.0" --set-icon "$INSTDIR\icon.ico"'
    
    DetailPrint "应用程序元数据修复完成"
    
    ; 创建桌面快捷方式（直接覆盖，避免闪烁）
    DetailPrint "创建桌面快捷方式..."
    SetShellVarContext current
    CreateShortCut "$DESKTOP\EasyCut.lnk" "$INSTDIR\EasyCut.exe" "" "$INSTDIR\EasyCut.exe" 0 SW_SHOWNORMAL "" "EasyCut - 双网保持"
    
    ; 清理可能存在的旧Electron快捷方式（静默删除）
    Delete "$DESKTOP\Electron.lnk"
    
    DetailPrint "桌面快捷方式创建完成"
!macroend

!macro customUnInstall
    ; 卸载时执行的操作
    DetailPrint "正在重置激活码..."
    
    ; 获取用户目录
    ReadRegStr $0 HKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders" "Personal"
    
    ; 构建激活文件路径
    StrCpy $1 "$0\.easycut\activation.json"
    
    ; 直接尝试删除激活文件
    Delete "$1"
    DetailPrint "激活文件处理完成"
    
    ; 尝试删除 .easycut 目录
    RMDir "$0\.easycut"
    
    DetailPrint "激活码重置完成"
!macroend