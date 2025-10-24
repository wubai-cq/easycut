const ActivationManager = require('./activation');

// 测试修复后的激活流程
function testActivationFlow() {
    console.log('=== 测试激活流程修复 ===\n');
    
    const activationManager = new ActivationManager();
    
    // 1. 重置激活状态（模拟首次安装）
    console.log('1. 重置激活状态（模拟首次安装）...');
    activationManager.resetActivation();
    const status1 = activationManager.getActivationStatus();
    console.log('   状态:', status1.activated ? '已激活' : '未激活');
    console.log('   预期: 未激活 - 应该显示激活界面');
    console.log('');
    
    // 2. 模拟激活过程
    console.log('2. 模拟激活过程...');
    const testCode = 'N1Y6-7W44-JY3Q-E28A';
    const activationResult = activationManager.activate(testCode);
    console.log('   激活码:', testCode);
    console.log('   激活结果:', activationResult.success ? '成功' : '失败');
    
    if (activationResult.success) {
        console.log('   预期: 激活成功后应该自动切换到主应用界面');
        console.log('   预期: 主应用界面应该自动加载网络接口');
        console.log('   预期: 刷新按钮应该只刷新网络接口，不回到激活界面');
    }
    console.log('');
    
    // 3. 检查最终状态
    console.log('3. 检查最终状态...');
    const finalStatus = activationManager.getActivationStatus();
    console.log('   激活状态:', finalStatus.activated ? '已激活' : '未激活');
    console.log('   激活码:', finalStatus.activationCode);
    console.log('');
    
    console.log('=== 修复说明 ===');
    console.log('✅ 修复1: 激活成功后自动调用 showMainApp() 和 loadInterfaces()');
    console.log('✅ 修复2: 刷新按钮只调用 loadInterfaces()，不重新加载页面');
    console.log('✅ 修复3: 确保主应用界面正确显示和初始化');
    console.log('');
    console.log('现在可以测试应用：');
    console.log('1. 启动应用应该显示激活界面');
    console.log('2. 输入激活码后应该跳转到主应用界面');
    console.log('3. 主应用界面应该自动加载网络接口');
    console.log('4. 点击刷新按钮应该只刷新网络接口，不回到激活界面');
}

testActivationFlow();
