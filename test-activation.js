const ActivationManager = require('./activation');

async function testActivationSystem() {
    console.log('=== EasyCut 激活系统测试 ===\n');
    
    const activationManager = new ActivationManager();
    
    // 1. 检查初始状态
    console.log('1. 检查初始激活状态:');
    let status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('   机器ID:', status.machineId);
    console.log('');
    
    // 2. 生成测试激活码
    console.log('2. 生成测试激活码:');
    const testCodes = [
        'N1Y6-7W44-JY3Q-E28A',  // 示例格式
        'A2B3-4C5D-6E7F-8G9H',  // 格式错误：第8位是字母
        'X9Y8-Z7W6-V5U4-T3S2',  // 格式错误：第5位是字母
        'B1C2-3D4E-5F6G-7H8I',  // 格式错误：第8位是字母
        'M9N8-O7P6-Q5R4-S3T2',  // 格式错误：第5位是字母
        'C5T3-6P91-PT7O-VY77',  // 正确格式
        'T3R2-0G77-LS6T-WNLQ'   // 正确格式
    ];
    
    for (let i = 0; i < testCodes.length; i++) {
        const code = testCodes[i];
        const validation = activationManager.validateActivationCode(code);
        console.log(`   ${i + 1}. ${code} - ${validation.valid ? '✓ 格式正确' : '✗ 格式错误'}`);
        if (!validation.valid) {
            console.log(`      错误: ${validation.error}`);
        }
    }
    console.log('');
    
    // 3. 测试激活
    console.log('3. 测试激活过程:');
    const testCode = testCodes[0]; // 使用第一个测试码
    console.log(`   使用激活码: ${testCode}`);
    
    const activationResult = activationManager.activate(testCode);
    console.log('   激活结果:', activationResult.success ? '✓ 成功' : '✗ 失败');
    if (!activationResult.success) {
        console.log('   错误信息:', activationResult.error);
    } else {
        console.log('   成功信息:', activationResult.message);
    }
    console.log('');
    
    // 4. 检查激活后状态
    console.log('4. 检查激活后状态:');
    status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('   激活码:', status.activationCode);
    console.log('   激活时间:', status.activatedAt);
    console.log('');
    
    // 5. 测试重复激活
    console.log('5. 测试重复激活（应该失败）:');
    const duplicateResult = activationManager.activate(testCode);
    console.log('   重复激活结果:', duplicateResult.success ? '✓ 成功' : '✗ 失败（预期）');
    if (!duplicateResult.success) {
        console.log('   错误信息:', duplicateResult.error);
    }
    console.log('');
    
    // 6. 测试不同激活码（应该成功）
    console.log('6. 测试不同激活码（应该成功）:');
    const differentCode = testCodes[5]; // 使用第6个测试码（正确格式）
    const differentResult = activationManager.activate(differentCode);
    console.log(`   使用不同激活码: ${differentCode}`);
    console.log('   激活结果:', differentResult.success ? '✓ 成功' : '✗ 失败');
    if (!differentResult.success) {
        console.log('   错误信息:', differentResult.error);
    }
    console.log('');
    
    // 7. 最终状态
    console.log('7. 最终激活状态:');
    status = activationManager.getActivationStatus();
    console.log('   激活状态:', status.activated ? '已激活' : '未激活');
    console.log('   当前激活码:', status.activationCode);
    console.log('');
    
    console.log('=== 测试完成 ===');
}

// 运行测试
testActivationSystem().catch(console.error);
