; EasyCut 安装脚本
; 在卸载时重置激活码

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

; 可选：在安装时显示信息
!macro customInstall
    DetailPrint "EasyCut 安装完成"
    DetailPrint "激活码将存储在用户目录下"
!macroend