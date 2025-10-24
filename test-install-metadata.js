const fs = require('fs');
const path = require('path');

console.log('=== 安装时元数据修复测试 ===');

// 检查打包后的文件
const exePath = path.join(__dirname, 'dist', 'win-unpacked', 'EasyCut.exe');
const rceditPath = path.join(__dirname, 'dist', 'win-unpacked', 'node_modules', 'rcedit', 'bin', 'rcedit.exe');

console.log('1. 检查打包后的文件...');
console.log('   可执行文件:', exePath);
console.log('   存在:', fs.existsSync(exePath));

console.log('   rcedit 工具:', rceditPath);
console.log('   存在:', fs.existsSync(rceditPath));

if (fs.existsSync(exePath) && fs.existsSync(rceditPath)) {
    console.log('   ✅ 所有必需文件都已打包');
} else {
    console.log('   ❌ 缺少必需文件');
}

console.log('\n2. 安装时元数据修复流程:');
console.log('   1. 用户运行 EasyCut-1.0.0.exe');
console.log('   2. NSIS 安装程序开始安装');
console.log('   3. 安装完成后，调用 customInstall 宏');
console.log('   4. 使用 rcedit 修复 EasyCut.exe 的元数据');
console.log('   5. 创建桌面快捷方式');
console.log('   6. 安装完成');

console.log('\n3. 修复的元数据内容:');
console.log('   - 文件说明: EasyCut');
console.log('   - 产品名称: EasyCut');
console.log('   - 公司名称: EasyCut');
console.log('   - 版权: Copyright (C) 2024 wubai rights reserved.');
console.log('   - 原始文件名: EasyCut.exe');
console.log('   - 内部名称: EasyCut');
console.log('   - 商标: EasyCut');
console.log('   - 文件版本: 1.0.0');
console.log('   - 产品版本: 1.0.0');

console.log('\n4. 验证步骤:');
console.log('   1. 运行 EasyCut-1.0.0.exe 安装程序');
console.log('   2. 安装完成后，检查安装目录中的 EasyCut.exe');
console.log('   3. 右键 -> 属性 -> 详细信息');
console.log('   4. 验证元数据是否正确显示');
console.log('   5. 检查任务管理器中的应用名称');

console.log('\n5. 如果安装后仍有问题:');
console.log('   - 检查 NSIS 脚本是否正确执行');
console.log('   - 检查 rcedit 工具是否在正确位置');
console.log('   - 检查安装目录权限');
console.log('   - 手动运行修复脚本');

console.log('\n6. 手动修复方法:');
console.log('   如果自动修复失败，可以手动运行:');
console.log('   node_modules\\rcedit\\bin\\rcedit.exe "EasyCut.exe" --set-version-string "FileDescription" "EasyCut" ...');
