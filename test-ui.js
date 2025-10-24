const ActivationManager = require('./activation');

// 测试激活界面显示逻辑
function testUILogic() {
    console.log('=== 测试激活界面显示逻辑 ===\n');
    
    const activationManager = new ActivationManager();
    
    // 1. 重置激活状态
    console.log('1. 重置激活状态...');
    activationManager.resetActivation();
    
    // 2. 检查未激活状态
    console.log('2. 检查未激活状态:');
    let status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('   应该显示: 激活界面');
    console.log('');
    
    // 3. 模拟激活
    console.log('3. 模拟激活过程:');
    const testCode = 'N1Y6-7W44-JY3Q-E28A';
    const activationResult = activationManager.activate(testCode);
    console.log('   激活结果:', activationResult.success ? '成功' : '失败');
    
    // 4. 检查激活后状态
    console.log('4. 检查激活后状态:');
    status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('   应该显示: 主应用界面');
    console.log('');
    
    // 5. 测试HTML元素显示逻辑
    console.log('5. 测试HTML元素显示逻辑:');
    console.log('   激活界面 (activation-screen): 应该显示');
    console.log('   主应用 (main-app): 应该隐藏');
    console.log('');
    
    console.log('=== 测试完成 ===');
    console.log('');
    console.log('如果应用启动时没有显示激活界面，请检查：');
    console.log('1. 激活状态是否正确重置');
    console.log('2. HTML元素是否正确设置');
    console.log('3. JavaScript函数是否正确调用');
    console.log('4. 控制台是否有错误信息');
}

// 运行测试
testUILogic();
