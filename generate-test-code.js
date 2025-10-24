const ActivationManager = require('./activation');

// 生成测试激活码
function generateTestActivationCode() {
    const rules = [
        { pos: 0, type: 'letter' },
        { pos: 1, type: 'digit' },
        { pos: 2, type: 'letter' },
        { pos: 3, type: 'digit' },
        { pos: 4, type: 'digit' },
        { pos: 5, type: 'letter' },
        { pos: 6, type: 'digit' },
        { pos: 7, type: 'digit' },
        { pos: 8, type: 'letter' },
        { pos: 9, type: 'letter' },
        { pos: 10, type: 'digit' },
        { pos: 11, type: 'letter' },
        { pos: 12, type: 'alphanumeric' },
        { pos: 13, type: 'alphanumeric' },
        { pos: 14, type: 'alphanumeric' },
        { pos: 15, type: 'alphanumeric' }
    ];

    let code = '';
    
    for (const rule of rules) {
        if (rule.type === 'letter') {
            code += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
        } else if (rule.type === 'digit') {
            code += Math.floor(Math.random() * 10).toString(); // 0-9
        } else if (rule.type === 'alphanumeric') {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    // 添加连字符
    return code.substring(0, 4) + '-' + 
           code.substring(4, 8) + '-' + 
           code.substring(8, 12) + '-' + 
           code.substring(12, 16);
}

// 测试激活码生成和验证
function testActivationCode() {
    const activationManager = new ActivationManager();
    
    console.log('=== 激活码测试 ===');
    
    // 生成测试激活码
    const testCode = generateTestActivationCode();
    console.log('生成的测试激活码:', testCode);
    
    // 验证激活码格式
    const validation = activationManager.validateActivationCode(testCode);
    console.log('格式验证结果:', validation);
    
    if (validation.valid) {
        console.log('✓ 激活码格式正确');
        
        // 测试激活
        const activationResult = activationManager.activate(testCode);
        console.log('激活结果:', activationResult);
        
        if (activationResult.success) {
            console.log('✓ 激活成功');
            
            // 检查激活状态
            const status = activationManager.getActivationStatus();
            console.log('激活状态:', status);
        } else {
            console.log('✗ 激活失败:', activationResult.error);
        }
    } else {
        console.log('✗ 激活码格式错误:', validation.error);
    }
}

// 生成多个测试激活码
function generateMultipleCodes(count = 5) {
    console.log(`\n=== 生成 ${count} 个测试激活码 ===`);
    
    for (let i = 1; i <= count; i++) {
        const code = generateTestActivationCode();
        console.log(`${i}. ${code}`);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    console.log('激活码生成器');
    console.log('=============');
    
    // 生成多个测试激活码
    generateMultipleCodes(10);
    
    console.log('\n=== 测试激活码验证 ===');
    testActivationCode();
}

module.exports = {
    generateTestActivationCode,
    testActivationCode,
    generateMultipleCodes
};
