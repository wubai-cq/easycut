const ActivationManager = require('./activation');
const path = require('path');
const os = require('os');

// 测试卸载重装后的激活码使用情况
function testUninstallReinstall() {
    console.log('=== 测试卸载重装后的激活码使用情况 ===\n');
    
    const activationManager = new ActivationManager();
    
    // 1. 检查当前激活状态
    console.log('1. 检查当前激活状态:');
    let status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('   激活码:', status.activationCode);
    console.log('   存储位置:', activationManager.activationFile);
    console.log('');
    
    // 2. 模拟卸载（删除应用，但保留用户数据）
    console.log('2. 模拟卸载应用（保留用户数据）:');
    console.log('   - 应用被卸载');
    console.log('   - 用户目录下的激活文件保留:', activationManager.activationFile);
    console.log('');
    
    // 3. 模拟重新安装
    console.log('3. 模拟重新安装应用:');
    console.log('   - 重新安装应用');
    console.log('   - 检查激活状态...');
    
    // 重新创建激活管理器（模拟新安装）
    const newActivationManager = new ActivationManager();
    const newStatus = newActivationManager.getActivationStatus();
    
    console.log('   重新安装后的激活状态:', newStatus.activated ? '已激活' : '未激活');
    console.log('   激活码:', newStatus.activationCode);
    console.log('');
    
    if (newStatus.activated) {
        console.log('✅ 结果：激活码可以继续使用！');
        console.log('   原因：用户目录下的激活文件在卸载时被保留');
        console.log('   存储位置：', newActivationManager.activationFile);
    } else {
        console.log('❌ 结果：激活码不能使用');
        console.log('   原因：激活文件可能被删除或机器ID发生变化');
    }
    console.log('');
    
    // 4. 说明不同情况
    console.log('=== 激活码使用情况说明 ===');
    console.log('✅ 可以继续使用：');
    console.log('   - 同一台电脑，同一用户账户');
    console.log('   - 重新安装应用后');
    console.log('   - 升级应用版本后');
    console.log('');
    console.log('❌ 不能继续使用：');
    console.log('   - 换到不同的电脑');
    console.log('   - 换到不同的用户账户');
    console.log('   - 手动删除激活文件');
    console.log('   - 重装操作系统');
    console.log('');
    
    // 5. 显示激活文件位置
    console.log('=== 激活文件位置 ===');
    console.log('Windows:', path.join(os.homedir(), '.easycut', 'activation.json'));
    console.log('macOS:', path.join(os.homedir(), '.easycut', 'activation.json'));
    console.log('Linux:', path.join(os.homedir(), '.easycut', 'activation.json'));
    console.log('');
    console.log('注意：卸载应用时，此文件通常不会被删除');
}

testUninstallReinstall();
