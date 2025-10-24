const { app } = require('electron');

console.log('=== 应用程序元数据测试 ===');

console.log('1. 应用程序名称设置:');
console.log('   app.getName():', app.getName());

console.log('\n2. 应用程序版本:');
console.log('   app.getVersion():', app.getVersion());

console.log('\n3. 应用程序用户模型ID:');
console.log('   app.getAppUserModelId():', app.getAppUserModelId());

console.log('\n4. 进程标题:');
console.log('   process.title:', process.title);

console.log('\n5. 平台信息:');
console.log('   process.platform:', process.platform);
console.log('   process.arch:', process.arch);

console.log('\n6. 环境变量:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   ELECTRON_IS_DEV:', process.env.ELECTRON_IS_DEV);

console.log('\n7. 建议的修复方案:');
console.log('   - 确保 package.json 中的 productName 和 executableName 正确设置');
console.log('   - 确保图标文件 icon.ico 存在且有效');
console.log('   - 确保 version-info.json 文件包含正确的应用程序信息');
console.log('   - 重新打包应用程序以应用新的设置');

// 如果直接运行此脚本
if (require.main === module) {
    console.log('\n注意：此脚本需要在 Electron 环境中运行才能获取完整的应用程序信息');
}
