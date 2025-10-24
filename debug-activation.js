const ActivationManager = require('./activation');

console.log('=== 激活状态调试 ===');

const am = new ActivationManager();

console.log('1. 检查激活文件路径:');
console.log('   路径:', am.activationFile);

console.log('\n2. 检查文件是否存在:');
const fs = require('fs');
console.log('   存在:', fs.existsSync(am.activationFile));

if (fs.existsSync(am.activationFile)) {
    console.log('\n3. 读取文件内容:');
    const data = fs.readFileSync(am.activationFile, 'utf8');
    console.log('   原始内容:', data);
    
    try {
        const activation = JSON.parse(data);
        console.log('   解析后内容:', JSON.stringify(activation, null, 2));
        
        console.log('\n4. 检查机器ID:');
        const currentMachineId = am.getMachineId();
        console.log('   当前机器ID:', currentMachineId);
        console.log('   文件中的机器ID:', activation.machineId);
        console.log('   机器ID匹配:', activation.machineId === currentMachineId);
        
        console.log('\n5. 检查激活状态:');
        console.log('   文件中的activated:', activation.activated);
        console.log('   activated类型:', typeof activation.activated);
        console.log('   activated === true:', activation.activated === true);
        
        console.log('\n6. 模拟getActivationStatus逻辑:');
        if (activation.machineId !== currentMachineId) {
            console.log('   ❌ 机器ID不匹配，返回未激活');
        } else {
            console.log('   ✅ 机器ID匹配');
            const result = {
                activated: activation.activated || false,
                machineId: currentMachineId,
                activationCode: activation.activationCode,
                activatedAt: activation.activatedAt
            };
            console.log('   最终结果:', JSON.stringify(result, null, 2));
        }
        
    } catch (error) {
        console.log('   ❌ JSON解析失败:', error.message);
    }
} else {
    console.log('   ❌ 激活文件不存在');
}

console.log('\n7. 调用getActivationStatus():');
const status = am.getActivationStatus();
console.log('   返回结果:', JSON.stringify(status, null, 2));