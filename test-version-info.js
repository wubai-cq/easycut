const fs = require('fs');
const path = require('path');

console.log('=== 版本信息配置验证 ===');

// 1. 检查 version-info.json
console.log('1. 检查 version-info.json...');
const versionInfoPath = path.join(__dirname, 'version-info.json');
if (fs.existsSync(versionInfoPath)) {
    const versionInfo = JSON.parse(fs.readFileSync(versionInfoPath, 'utf8'));
    console.log('   ✅ version-info.json 内容:');
    console.log('   - 公司名称:', versionInfo.CompanyName);
    console.log('   - 产品名称:', versionInfo.ProductName);
    console.log('   - 文件描述:', versionInfo.FileDescription);
    console.log('   - 版权信息:', versionInfo.LegalCopyright);
    console.log('   - 原始文件名:', versionInfo.OriginalFilename);
    console.log('   - 产品版本:', versionInfo.ProductVersion);
    console.log('   - 文件版本:', versionInfo.FileVersion);
    console.log('   - 内部名称:', versionInfo.InternalName);
    console.log('   - 商标信息:', versionInfo.LegalTrademarks);
} else {
    console.log('   ❌ version-info.json 不存在');
}

// 2. 检查 package.json 中的元数据配置
console.log('\n2. 检查 package.json 元数据配置...');
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log('   ✅ package.json 元数据:');
console.log('   - 应用程序名称:', packageJson.name);
console.log('   - 产品名称:', packageJson.productName);
console.log('   - 图标:', packageJson.icon);

if (packageJson.build && packageJson.build.win) {
    const winConfig = packageJson.build.win;
    console.log('   - 可执行文件名:', winConfig.executableName);
    console.log('   - 文件版本:', winConfig.fileVersion);
    console.log('   - 产品版本:', winConfig.productVersion);
    console.log('   - 版权信息:', winConfig.legalCopyright);
    console.log('   - 文件描述:', winConfig.fileDescription);
    console.log('   - 公司名称:', winConfig.companyName);
    console.log('   - 原始文件名:', winConfig.originalFilename);
    console.log('   - 内部名称:', winConfig.internalName);
}

// 3. 检查图标文件
console.log('\n3. 检查图标文件...');
const iconPath = path.join(__dirname, 'icon.ico');
if (fs.existsSync(iconPath)) {
    const stats = fs.statSync(iconPath);
    console.log('   ✅ 图标文件存在:');
    console.log('   - 路径:', iconPath);
    console.log('   - 大小:', stats.size, 'bytes');
    console.log('   - 修改时间:', stats.mtime);
} else {
    console.log('   ❌ 图标文件不存在');
}

// 4. 修复建议
console.log('\n4. 修复建议:');
console.log('   1. 重新打包应用程序: npm run build:win');
console.log('   2. 检查打包后的 EasyCut.exe 属性');
console.log('   3. 如果仍然显示 Electron 信息，可能需要:');
console.log('      - 清理旧的打包文件');
console.log('      - 使用不同的打包配置');
console.log('      - 检查 electron-builder 版本');

console.log('\n5. 如果问题仍然存在:');
console.log('   - 尝试使用 electron-builder 的 rcedit 选项');
console.log('   - 检查是否有其他配置覆盖了版本信息');
console.log('   - 考虑使用自定义的构建脚本');

console.log('\n6. 验证步骤:');
console.log('   1. 运行: npm run build:win');
console.log('   2. 检查: C:\\code\\wifi\\dist\\win-unpacked\\EasyCut.exe');
console.log('   3. 右键 -> 属性 -> 详细信息');
console.log('   4. 验证所有元数据是否正确显示');
