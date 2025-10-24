const fs = require('fs');
const path = require('path');

console.log('=== 应用程序元数据修复验证 ===');

// 1. 检查关键配置文件
console.log('1. 检查关键配置文件...');

// 检查 package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
console.log('   ✅ package.json 配置:');
console.log('      - 应用程序名称:', packageJson.name);
console.log('      - 产品名称:', packageJson.productName);
console.log('      - 图标:', packageJson.icon);
console.log('      - 可执行文件名:', packageJson.build.win.executableName);

// 检查版本信息文件
const versionInfoPath = path.join(__dirname, 'version-info.json');
if (fs.existsSync(versionInfoPath)) {
    const versionInfo = JSON.parse(fs.readFileSync(versionInfoPath, 'utf8'));
    console.log('   ✅ version-info.json 配置:');
    console.log('      - 产品名称:', versionInfo.ProductName);
    console.log('      - 公司名称:', versionInfo.CompanyName);
    console.log('      - 文件描述:', versionInfo.FileDescription);
}

// 检查图标文件
const iconPath = path.join(__dirname, 'icon.ico');
if (fs.existsSync(iconPath)) {
    const stats = fs.statSync(iconPath);
    console.log('   ✅ 图标文件:');
    console.log('      - 路径:', iconPath);
    console.log('      - 大小:', stats.size, 'bytes');
    console.log('      - 修改时间:', stats.mtime);
} else {
    console.log('   ❌ 图标文件不存在');
}

// 2. 检查 NSIS 脚本
console.log('\n2. 检查 NSIS 脚本...');
const installerPath = path.join(__dirname, 'installer.nsh');
if (fs.existsSync(installerPath)) {
    const installerContent = fs.readFileSync(installerPath, 'utf8');
    console.log('   ✅ installer.nsh 存在');
    console.log('   - 包含 customInstall 宏:', installerContent.includes('customInstall'));
    console.log('   - 包含 customUnInstall 宏:', installerContent.includes('customUnInstall'));
    console.log('   - 包含桌面快捷方式设置:', installerContent.includes('CreateShortCut'));
} else {
    console.log('   ❌ installer.nsh 不存在');
}

// 3. 检查 main.js 中的元数据设置
console.log('\n3. 检查 main.js 元数据设置...');
const mainPath = path.join(__dirname, 'main.js');
if (fs.existsSync(mainPath)) {
    const mainContent = fs.readFileSync(mainPath, 'utf8');
    console.log('   ✅ main.js 元数据设置:');
    console.log('   - 设置进程标题:', mainContent.includes("process.title = 'EasyCut'"));
    console.log('   - 设置应用名称:', mainContent.includes("app.setName('EasyCut')"));
    console.log('   - 设置用户模型ID:', mainContent.includes("app.setAppUserModelId"));
    console.log('   - 设置关于面板:', mainContent.includes("app.setAboutPanelOptions"));
}

// 4. 修复建议
console.log('\n4. 修复建议:');
console.log('   1. 重新打包应用程序: npm run build:win');
console.log('   2. 完全卸载旧版本应用');
console.log('   3. 清理桌面快捷方式');
console.log('   4. 安装新打包的应用程序');
console.log('   5. 检查任务管理器中的应用名称和图标');

console.log('\n5. 如果问题仍然存在:');
console.log('   - 检查图标文件格式是否正确');
console.log('   - 清理 Windows 图标缓存');
console.log('   - 重启计算机');
console.log('   - 检查是否有其他 Electron 应用干扰');

console.log('\n6. 清理图标缓存的方法:');
console.log('   - 删除 %localappdata%\\IconCache.db');
console.log('   - 重启 Windows 资源管理器');
console.log('   - 或者重启计算机');

console.log('\n7. 验证步骤:');
console.log('   1. 重新打包: npm run build:win');
console.log('   2. 卸载旧版本');
console.log('   3. 安装新版本');
console.log('   4. 检查桌面快捷方式图标');
console.log('   5. 检查任务管理器中的应用名称');
console.log('   6. 如果仍有问题，清理图标缓存并重启');
