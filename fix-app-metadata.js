const fs = require('fs');
const path = require('path');

console.log('=== 修复应用程序元数据 ===');

// 1. 检查并更新 package.json
console.log('1. 检查 package.json 配置...');
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log('   当前 productName:', packageJson.build.productName);
console.log('   当前 executableName:', packageJson.build.win.executableName);
console.log('   当前 appId:', packageJson.build.appId);

// 2. 检查图标文件
console.log('\n2. 检查图标文件...');
const iconPath = path.join(__dirname, 'icon.ico');
if (fs.existsSync(iconPath)) {
    const stats = fs.statSync(iconPath);
    console.log('   ✅ 图标文件存在:', iconPath);
    console.log('   文件大小:', stats.size, 'bytes');
    console.log('   最后修改:', stats.mtime);
} else {
    console.log('   ❌ 图标文件不存在:', iconPath);
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

// 4. 建议的修复步骤
console.log('\n4. 修复建议:');
console.log('   1. 确保 icon.ico 文件存在且有效');
console.log('   2. 重新打包应用程序: npm run build');
console.log('   3. 安装新打包的应用程序');
console.log('   4. 检查任务管理器中的显示');

// 5. 创建修复后的 package.json 配置
console.log('\n5. 推荐的 package.json 配置:');
const recommendedConfig = {
    "build": {
        "appId": "com.easycut.app",
        "productName": "EasyCut",
        "win": {
            "target": "nsis",
            "icon": "icon.ico",
            "executableName": "EasyCut",
            "appIcon": "icon.ico",
            "appName": "EasyCut",
            "requestedExecutionLevel": "requireAdministrator"
        },
        "nsis": {
            "oneClick": false,
            "allowToChangeInstallationDirectory": true,
            "createDesktopShortcut": true,
            "createStartMenuShortcut": true,
            "shortcutName": "EasyCut",
            "installerIcon": "icon.ico",
            "uninstallerIcon": "icon.ico"
        }
    }
};

console.log('   推荐配置:', JSON.stringify(recommendedConfig, null, 2));

console.log('\n6. 如果问题仍然存在，可能的原因:');
console.log('   - 图标文件格式不正确');
console.log('   - 需要重新生成图标文件');
console.log('   - 打包配置需要更新');
console.log('   - 需要清理旧的打包文件');
