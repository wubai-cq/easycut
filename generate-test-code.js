const ActivationManager = require('./activation');
const { query } = require('./other');

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

// 注意：此脚本不触发应用激活，仅生成并入库有效激活码

// 生成多个测试激活码（仅格式，不入库）
function generateMultipleCodes(count = 5) {
    console.log(`\n=== 生成 ${count} 个测试激活码（未入库）===`);
    for (let i = 1; i <= count; i++) {
        const code = generateTestActivationCode();
        console.log(`${i}. ${code}`);
    }
}

// 生成唯一激活码并写入数据库的有效激活码表（不激活）
async function generateUniqueCodesToDB(count = 10) {
    console.log(`\n=== 生成 ${count} 个唯一激活码并写入数据库 ===`);
    try {
        const inserted = [];
        while (inserted.length < count) {
            const candidate = generateTestActivationCode();
            const activationManager = new ActivationManager();
            const validation = activationManager.validateActivationCode(candidate);
            if (!validation.valid) continue;
            const clean = validation.code;

            const [usedRows, validRows] = await Promise.all([
                query('SELECT id FROM used_activation_codes WHERE usedCode = ? LIMIT 1', [clean]),
                query('SELECT id FROM valid_activation_codes WHERE validCode = ? LIMIT 1', [clean])
            ]);
            if (usedRows.length > 0 || validRows.length > 0) continue;

            await query('INSERT INTO valid_activation_codes (validCode) VALUES (?)', [clean]);
            inserted.push(clean);
            console.log(`${inserted.length}. ${clean}`);
        }
        console.log(`完成：写入 ${inserted.length} 个激活码`);
        return inserted;
    } catch (e) {
        console.log('✗ 入库失败:', e.message);
        return [];
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes('--db-generate')) {
        const idx = args.indexOf('--db-generate');
        const count = parseInt(args[idx + 1] || '10');
        generateUniqueCodesToDB(count).then(() => process.exit(0));
    } else {
        console.log('激活码生成器');
        console.log('=============');
        generateMultipleCodes(10);
        console.log('\n使用:');
        console.log('  node generate-test-code.js --db-generate 20   # 入库 20 个唯一激活码');
    }
}

module.exports = {
    generateTestActivationCode,
    generateMultipleCodes,
    generateUniqueCodesToDB
};
