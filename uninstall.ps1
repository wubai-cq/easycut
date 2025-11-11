# EasyCut 卸载脚本 - 重置激活码
# PowerShell 脚本

Write-Host "=== EasyCut 卸载 - 重置激活码 ===" -ForegroundColor Green

# 获取用户目录
$userProfile = $env:USERPROFILE
$activationFile = Join-Path $userProfile ".easycut\uck.dll"
$easycutDir = Join-Path $userProfile ".easycut"

Write-Host "用户目录: $userProfile" -ForegroundColor Yellow
Write-Host "激活文件: $activationFile" -ForegroundColor Yellow

# 检查激活文件是否存在
if (Test-Path $activationFile) {
    Write-Host "发现激活文件，正在删除..." -ForegroundColor Yellow
    Remove-Item $activationFile -Force
    Write-Host "✅ 激活文件已删除" -ForegroundColor Green
} else {
    Write-Host "ℹ️ 未发现激活文件" -ForegroundColor Cyan
}

# 检查 .easycut 目录是否存在
if (Test-Path $easycutDir) {
    Write-Host "检查 .easycut 目录..." -ForegroundColor Yellow
    
    # 获取目录中的文件数量
    $files = Get-ChildItem $easycutDir -Force
    if ($files.Count -eq 0) {
        Write-Host "目录为空，正在删除..." -ForegroundColor Yellow
        Remove-Item $easycutDir -Force
        Write-Host "✅ .easycut 目录已删除" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ 目录不为空，保留目录" -ForegroundColor Cyan
    }
} else {
    Write-Host "ℹ️ 未发现 .easycut 目录" -ForegroundColor Cyan
}

Write-Host "✅ 激活码重置完成" -ForegroundColor Green
Write-Host "按任意键继续..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
