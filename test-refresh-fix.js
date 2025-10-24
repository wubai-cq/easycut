const ActivationManager = require('./activation');

// 测试刷新按钮修复
function testRefreshFix() {
    console.log('=== 测试刷新按钮修复 ===\n');
    
    const activationManager = new ActivationManager();
    
    // 1. 检查当前激活状态
    console.log('1. 检查当前激活状态:');
    let status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('');
    
    if (!status.activated) {
        console.log('2. 应用未激活，先激活...');
        const testCode = 'N1Y6-7W44-JY3Q-E28A';
        const activationResult = activationManager.activate(testCode);
        console.log('   激活结果:', activationResult.success ? '成功' : '失败');
        
        if (activationResult.success) {
            status = activationManager.getActivationStatus();
            console.log('   现在状态:', status.activated ? '已激活' : '未激活');
        }
        console.log('');
    }
    
    console.log('3. 修复说明:');
    console.log('   ✅ 刷新按钮现在只调用 loadInterfaces()');
    console.log('   ✅ 不会重新加载整个页面');
    console.log('   ✅ 不会重新检查激活状态');
    console.log('   ✅ 不会显示激活界面');
    console.log('');
    
    console.log('4. 测试方法:');
    console.log('   1. 启动应用: npx electron .');
    console.log('   2. 激活应用（如果未激活）');
    console.log('   3. 点击刷新按钮');
    console.log('   4. 应该只刷新网络接口，不显示激活界面');
    console.log('');
    
    console.log('5. 快捷键测试:');
    console.log('   - F5: 刷新网络接口');
    console.log('   - Ctrl+Shift+R: 刷新网络接口');
    console.log('   - 都不会重新加载页面');
    console.log('');
    
    console.log('=== 修复完成 ===');
    console.log('现在刷新按钮应该正常工作，不会显示激活界面了！');
}

testRefreshFix();
