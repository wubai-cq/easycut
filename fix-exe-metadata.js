const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('=== 修复可执行文件元数据 ===');

// 检查是否存在 rcedit 工具
function checkRcedit() {
    return new Promise((resolve) => {
        exec('rcedit --version', (error, stdout, stderr) => {
            if (error) {
                console.log('❌ rcedit 工具未安装');
                console.log('   请运行: npm install -g rcedit');
                resolve(false);
            } else {
                console.log('✅ rcedit 工具已安装');
                resolve(true);
            }
        });
    });
}

// 修复可执行文件元数据
async function fixExeMetadata() {
    const exePath = path.join(__dirname, 'dist', 'win-unpacked', 'EasyCut.exe');
    
    if (!fs.existsSync(exePath)) {
        console.log('❌ 可执行文件不存在:', exePath);
        console.log('   请先运行: npm run build:win');
        return;
    }
    
    console.log('✅ 找到可执行文件:', exePath);
    
    // 检查 rcedit 工具
    const hasRcedit = await checkRcedit();
    if (!hasRcedit) {
        console.log('\n安装 rcedit 工具...');
        return new Promise((resolve) => {
            exec('npm install -g rcedit', (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ 安装 rcedit 失败:', error.message);
                    resolve(false);
                } else {
                    console.log('✅ rcedit 安装成功');
                    resolve(true);
                }
            });
        });
    }
    
    // 使用 rcedit 修复元数据
    const rceditCommand = `rcedit "${exePath}" --set-version-string "FileDescription" "EasyCut - 双网切换工具" --set-version-string "ProductName" "EasyCut" --set-version-string "CompanyName" "EasyCut" --set-version-string "LegalCopyright" "Copyright (C) 2024 EasyCut. All rights reserved." --set-version-string "OriginalFilename" "EasyCut.exe" --set-version-string "InternalName" "EasyCut" --set-version-string "LegalTrademarks" "EasyCut" --set-file-version "1.0.0" --set-product-version "1.0.0"`;
    
    console.log('\n正在修复可执行文件元数据...');
    console.log('命令:', rceditCommand);
    
    return new Promise((resolve) => {
        exec(rceditCommand, (error, stdout, stderr) => {
            if (error) {
                console.log('❌ 修复元数据失败:', error.message);
                console.log('错误输出:', stderr);
                resolve(false);
            } else {
                console.log('✅ 元数据修复成功');
                console.log('输出:', stdout);
                resolve(true);
            }
        });
    });
}

// 主函数
async function main() {
    console.log('开始修复可执行文件元数据...\n');
    
    const success = await fixExeMetadata();
    
    if (success) {
        console.log('\n✅ 修复完成！');
        console.log('请检查: C:\\code\\wifi\\dist\\win-unpacked\\EasyCut.exe');
        console.log('右键 -> 属性 -> 详细信息');
        console.log('验证元数据是否正确显示');
    } else {
        console.log('\n❌ 修复失败');
        console.log('请检查错误信息并重试');
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { fixExeMetadata };
