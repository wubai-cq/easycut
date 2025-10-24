const ActivationManager = require('./activation');

console.log('=== 模拟应用启动过程 ===');

// 创建激活管理器实例
const activationManager = new ActivationManager();

console.log('1. 检查激活状态...');
const activationStatus = activationManager.getActivationStatus();
console.log('   激活状态:', activationStatus);

if (activationStatus.activated) {
    console.log('   ✅ 应用已激活，应该显示主应用界面');
    console.log('   激活码:', activationStatus.activationCode);
    console.log('   激活时间:', activationStatus.activatedAt);
} else {
    console.log('   ❌ 应用未激活，应该显示激活界面');
    console.log('   机器ID:', activationStatus.machineId);
}

console.log('\n2. 检查激活文件...');
const fs = require('fs');
const path = require('path');
const os = require('os');

const activationFile = path.join(os.homedir(), '.easycut', 'activation.json');
console.log('   文件路径:', activationFile);
console.log('   文件存在:', fs.existsSync(activationFile));

if (fs.existsSync(activationFile)) {
    const data = JSON.parse(fs.readFileSync(activationFile, 'utf8'));
    console.log('   文件内容:', JSON.stringify(data, null, 2));
}

console.log('\n3. 测试激活流程...');
console.log('   如果应用每次启动都要求激活码，可能的原因：');
console.log('   - 激活文件被意外删除或损坏');
console.log('   - 机器ID发生变化');
console.log('   - 激活检查逻辑有问题');
console.log('   - 文件权限问题');

// 检查文件权限
if (fs.existsSync(activationFile)) {
    try {
        const stats = fs.statSync(activationFile);
        console.log('   文件权限:', stats.mode.toString(8));
        console.log('   文件大小:', stats.size, 'bytes');
        console.log('   最后修改:', stats.mtime);
    } catch (error) {
        console.log('   权限检查失败:', error.message);
    }
}
