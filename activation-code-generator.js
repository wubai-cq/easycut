const ActivationManager = require('./activation');

// 激活码生成器类
class ActivationCodeGenerator {
    constructor() {
        this.activationManager = new ActivationManager();
    }

    // 生成单个激活码
    generateCode() {
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

    // 生成多个激活码
    generateMultiple(count = 10) {
        const codes = [];
        for (let i = 0; i < count; i++) {
            codes.push(this.generateCode());
        }
        return codes;
    }

    // 验证激活码
    validateCode(code) {
        return this.activationManager.validateActivationCode(code);
    }

    // 测试激活码
    testCode(code) {
        const validation = this.validateCode(code);
        if (validation.valid) {
            const activationResult = this.activationManager.activate(code);
            return {
                valid: true,
                activation: activationResult,
                status: this.activationManager.getActivationStatus()
            };
        }
        return { valid: false, error: validation.error };
    }

    // 生成并测试激活码
    generateAndTest() {
        const code = this.generateCode();
        const result = this.testCode(code);
        return { code, result };
    }

    // 批量生成并验证
    batchGenerateAndValidate(count = 10) {
        console.log(`\n=== 批量生成 ${count} 个激活码 ===`);
        const codes = this.generateMultiple(count);
        const results = [];

        for (let i = 0; i < codes.length; i++) {
            const code = codes[i];
            const validation = this.validateCode(code);
            results.push({
                index: i + 1,
                code: code,
                valid: validation.valid,
                error: validation.error
            });
        }

        return results;
    }

    // 导出激活码到文件
    exportToFile(codes, filename = 'activation-codes.txt') {
        const fs = require('fs');
        const content = codes.map((code, index) => `${index + 1}. ${code}`).join('\n');
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`激活码已导出到: ${filename}`);
    }

    // 生成激活码报告
    generateReport(count = 100) {
        console.log('\n=== 激活码生成报告 ===');
        
        const codes = this.generateMultiple(count);
        const validCodes = [];
        const invalidCodes = [];

        for (const code of codes) {
            const validation = this.validateCode(code);
            if (validation.valid) {
                validCodes.push(code);
            } else {
                invalidCodes.push({ code, error: validation.error });
            }
        }

        console.log(`总生成数量: ${count}`);
        console.log(`有效激活码: ${validCodes.length}`);
        console.log(`无效激活码: ${invalidCodes.length}`);
        console.log(`成功率: ${((validCodes.length / count) * 100).toFixed(2)}%`);

        if (invalidCodes.length > 0) {
            console.log('\n无效激活码:');
            invalidCodes.forEach(item => {
                console.log(`  ${item.code} - ${item.error}`);
            });
        }

        return {
            total: count,
            valid: validCodes.length,
            invalid: invalidCodes.length,
            successRate: (validCodes.length / count) * 100,
            validCodes,
            invalidCodes
        };
    }
}

// 命令行界面
function showHelp() {
    console.log('\n=== EasyCut 激活码生成器 ===');
    console.log('使用方法:');
    console.log('  node activation-code-generator.js [选项]');
    console.log('');
    console.log('选项:');
    console.log('  --generate, -g [数量]    生成指定数量的激活码 (默认: 10)');
    console.log('  --test, -t              生成并测试一个激活码');
    console.log('  --report, -r [数量]     生成激活码报告 (默认: 100)');
    console.log('  --export, -e [数量]     生成并导出激活码到文件 (默认: 50)');
    console.log('  --help, -h              显示帮助信息');
    console.log('');
    console.log('示例:');
    console.log('  node activation-code-generator.js --generate 20');
    console.log('  node activation-code-generator.js --test');
    console.log('  node activation-code-generator.js --report 200');
    console.log('  node activation-code-generator.js --export 100');
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    const generator = new ActivationCodeGenerator();

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }

    if (args.includes('--generate') || args.includes('-g')) {
        const count = parseInt(args[args.indexOf('--generate') + 1] || args[args.indexOf('-g') + 1] || 10);
        console.log(`\n=== 生成 ${count} 个激活码 ===`);
        const codes = generator.generateMultiple(count);
        codes.forEach((code, index) => {
            console.log(`${index + 1}. ${code}`);
        });
    }

    if (args.includes('--test') || args.includes('-t')) {
        console.log('\n=== 生成并测试激活码 ===');
        const result = generator.generateAndTest();
        console.log(`生成的激活码: ${result.code}`);
        console.log(`测试结果:`, result.result);
    }

    if (args.includes('--report') || args.includes('-r')) {
        const count = parseInt(args[args.indexOf('--report') + 1] || args[args.indexOf('-r') + 1] || 100);
        generator.generateReport(count);
    }

    if (args.includes('--export') || args.includes('-e')) {
        const count = parseInt(args[args.indexOf('--export') + 1] || args[args.indexOf('-e') + 1] || 50);
        console.log(`\n=== 生成并导出 ${count} 个激活码 ===`);
        const codes = generator.generateMultiple(count);
        generator.exportToFile(codes, `activation-codes-${count}.txt`);
        console.log('前10个激活码预览:');
        codes.slice(0, 10).forEach((code, index) => {
            console.log(`${index + 1}. ${code}`);
        });
    }
}

// 如果直接运行此文件
if (require.main === module) {
    main();
}

module.exports = ActivationCodeGenerator;
