const fs = require('fs');
const path = require('path');

console.log('=== 应用程序元数据修复验证 ===');

// 1. 检查 package.json 配置
console.log('1. 检查 package.json 配置...');
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log('   ✅ 应用程序名称:', packageJson.name);
console.log('   ✅ 产品名称:', packageJson.productName);
console.log('   ✅ 图标设置:', packageJson.icon);
console.log('   ✅ 可执行文件名:', packageJson.build.win.executableName);

// 2. 检查图标文件
console.log('\n2. 检查图标文件...');
const iconPath = path.join(__dirname, 'icon.ico');
if (fs.existsSync(iconPath)) {
    const stats = fs.statSync(iconPath);
    console.log('   ✅ 图标文件存在:', iconPath);
    console.log('   文件大小:', stats.size, 'bytes');
} else {
    console.log('   ❌ 图标文件不存在');
}

// 3. 检查版本信息文件
console.log('\n3. 检查版本信息文件...');
const versionInfoPath = path.join(__dirname, 'version-info.json');
if (fs.existsSync(versionInfoPath)) {
    const versionInfo = JSON.parse(fs.readFileSync(versionInfoPath, 'utf8'));
    console.log('   ✅ 版本信息文件存在');
    console.log('   产品名称:', versionInfo.ProductName);
    console.log('   公司名称:', versionInfo.CompanyName);
    console.log('   文件描述:', versionInfo.FileDescription);
} else {
    console.log('   ❌ 版本信息文件不存在');
}

// 4. 检查 NSIS 配置
console.log('\n4. 检查 NSIS 配置...');
console.log('   ✅ 桌面快捷方式:', packageJson.build.nsis.createDesktopShortcut);
console.log('   ✅ 快捷方式名称:', packageJson.build.nsis.shortcutName);
console.log('   ✅ 安装程序图标:', packageJson.build.nsis.installerIcon);

// 5. 修复建议
console.log('\n5. 修复建议:');
console.log('   1. 重新打包应用程序: npm run build');
console.log('   2. 完全卸载旧版本应用');
console.log('   3. 安装新打包的应用程序');
console.log('   4. 检查桌面快捷方式图标');
console.log('   5. 检查任务管理器中的应用名称和图标');

console.log('\n6. 如果问题仍然存在:');
console.log('   - 确保图标文件是有效的 ICO 格式');
console.log('   - 检查图标文件是否包含多种尺寸');
console.log('   - 清理 Windows 图标缓存');
console.log('   - 重启计算机');

console.log('\n7. 清理图标缓存的方法:');
console.log('   - 删除 %localappdata%\\IconCache.db');
console.log('   - 重启 Windows 资源管理器');
console.log('   - 或者重启计算机');
