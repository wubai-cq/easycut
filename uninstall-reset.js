const fs = require('fs');
const path = require('path');
const os = require('os');

// 卸载时重置激活码
function resetActivationOnUninstall() {
    try {
        console.log('=== 应用卸载 - 重置激活码 ===');
        
        const activationFile = path.join(os.homedir(), '.easycut', 'activation.json');
        
        // 检查激活文件是否存在
        if (fs.existsSync(activationFile)) {
            console.log('发现激活文件:', activationFile);
            
            // 删除激活文件
            fs.unlinkSync(activationFile);
            console.log('✅ 激活文件已删除');
            
            // 尝试删除整个 .easycut 目录（如果为空）
            const easycutDir = path.dirname(activationFile);
            try {
                fs.rmdirSync(easycutDir);
                console.log('✅ .easycut 目录已删除');
            } catch (err) {
                console.log('ℹ️ .easycut 目录不为空，保留目录');
            }
        } else {
            console.log('ℹ️ 未发现激活文件，无需重置');
        }
        
        console.log('✅ 激活码重置完成');
        return true;
    } catch (error) {
        console.error('❌ 重置激活码失败:', error.message);
        return false;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    resetActivationOnUninstall();
}

module.exports = { resetActivationOnUninstall };
