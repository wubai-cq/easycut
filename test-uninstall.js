const { resetActivation } = require('./test-reset');
const ActivationManager = require('./activation');

// 测试卸载时重置激活码
function testUninstallReset() {
    console.log('=== 测试卸载时重置激活码 ===\n');
    
    const activationManager = new ActivationManager();
    
    // 1. 检查当前激活状态
    console.log('1. 检查当前激活状态:');
    let status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('   激活码:', status.activationCode);
    console.log('   存储位置:', activationManager.activationFile);
    console.log('');
    
    if (!status.activated) {
        console.log('ℹ️ 当前未激活，先激活一个测试码...');
        const testCode = 'N1Y6-7W44-JY3Q-E28A';
        const activationResult = activationManager.activate(testCode);
        console.log('   激活结果:', activationResult.success ? '成功' : '失败');
        
        if (activationResult.success) {
            status = activationManager.getActivationStatus();
            console.log('   现在状态:', status.activated ? '已激活' : '未激活');
        }
        console.log('');
    }
    
    // 2. 模拟卸载过程
    console.log('2. 模拟卸载过程:');
    console.log('   正在卸载应用...');
    console.log('   调用重置激活码脚本...');
    
    // 调用重置函数
    resetActivation();
    
    // 3. 检查重置后状态
    console.log('\n3. 检查重置后状态:');
    const newStatus = activationManager.getActivationStatus();
    console.log('   激活状态:', newStatus.activated ? '已激活' : '未激活');
    console.log('   激活码:', newStatus.activationCode);
    console.log('');
    
    if (!newStatus.activated) {
        console.log('✅ 卸载重置成功！');
        console.log('   - 激活状态已重置');
        console.log('   - 重新安装后需要重新激活');
        console.log('   - 激活码可以重新使用');
    } else {
        console.log('❌ 卸载重置失败！');
        console.log('   - 激活状态未重置');
        console.log('   - 需要手动删除激活文件');
    }
    console.log('');
    
    // 4. 说明卸载重置的好处
    console.log('=== 卸载重置的好处 ===');
    console.log('✅ 防止激活码泄露：');
    console.log('   - 卸载时自动清除激活信息');
    console.log('   - 防止他人使用已激活的激活码');
    console.log('   - 保护激活码的安全性');
    console.log('');
    console.log('✅ 用户体验：');
    console.log('   - 重新安装后需要重新激活');
    console.log('   - 激活码可以重新使用');
    console.log('   - 保持激活码的唯一性');
}

testUninstallReset();
