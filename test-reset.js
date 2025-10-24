const ActivationManager = require('./activation');

// 重置激活状态
function resetActivation() {
    const activationManager = new ActivationManager();
    
    console.log('=== 重置激活状态测试 ===');
    
    // 检查当前状态
    const currentStatus = activationManager.getActivationStatus();
    console.log('当前状态:', currentStatus.activated ? '已激活' : '未激活');
    
    // 重置激活状态
    const resetResult = activationManager.resetActivation();
    console.log('重置结果:', resetResult.success ? '成功' : '失败');
    
    // 检查重置后状态
    const newStatus = activationManager.getActivationStatus();
    console.log('重置后状态:', newStatus.activated ? '已激活' : '未激活');
    
    if (!newStatus.activated) {
        console.log('✅ 重置成功！现在启动应用应该会显示激活界面');
    } else {
        console.log('❌ 重置失败！');
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    resetActivation();
}

// 导出函数供其他脚本调用
module.exports = { resetActivation };
