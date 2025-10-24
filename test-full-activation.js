const ActivationManager = require('./activation');

console.log('=== 完整激活检查测试 ===');

async function testActivationFlow() {
    const activationManager = new ActivationManager();
    
    console.log('1. 直接检查激活状态...');
    const directStatus = activationManager.getActivationStatus();
    console.log('   直接检查结果:', JSON.stringify(directStatus, null, 2));
    
    console.log('\n2. 模拟IPC调用...');
    try {
        const status = activationManager.getActivationStatus();
        const ipcResult = { success: true, data: status };
        console.log('   IPC模拟结果:', JSON.stringify(ipcResult, null, 2));
        
        if (ipcResult.success && ipcResult.data.activated) {
            console.log('   ✅ 应该显示主应用');
        } else {
            console.log('   ❌ 应该显示激活界面');
        }
    } catch (error) {
        console.log('   ❌ IPC调用失败:', error.message);
    }
    
    console.log('\n3. 检查激活文件状态...');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    const activationFile = path.join(os.homedir(), '.easycut', 'activation.json');
    
    if (fs.existsSync(activationFile)) {
        const data = JSON.parse(fs.readFileSync(activationFile, 'utf8'));
        console.log('   文件状态: 存在');
        console.log('   激活状态:', data.activated);
        console.log('   机器ID:', data.machineId);
        console.log('   激活码:', data.activationCode);
        console.log('   激活时间:', data.activatedAt);
        
        // 检查机器ID匹配
        const currentMachineId = activationManager.getMachineId();
        console.log('   当前机器ID:', currentMachineId);
        console.log('   机器ID匹配:', data.machineId === currentMachineId);
        
        if (data.activated && data.machineId === currentMachineId) {
            console.log('   ✅ 激活状态正常，应该显示主应用');
        } else {
            console.log('   ❌ 激活状态异常，应该显示激活界面');
        }
    } else {
        console.log('   ❌ 激活文件不存在，应该显示激活界面');
    }
    
    console.log('\n4. 测试激活码验证...');
    const testCode = 'E1D83J05BN4G4ALA'; // 使用文件中的激活码
    const validation = activationManager.validateActivationCode(testCode);
    console.log('   测试激活码:', testCode);
    console.log('   验证结果:', JSON.stringify(validation, null, 2));
    
    console.log('\n5. 总结...');
    console.log('   如果应用每次启动都要求激活码，可能的原因：');
    console.log('   - 激活检查时序问题');
    console.log('   - 主进程和渲染进程状态不同步');
    console.log('   - 激活文件被意外重置');
    console.log('   - 应用启动时激活检查逻辑有问题');
}

testActivationFlow().catch(console.error);
