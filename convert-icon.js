const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function parseArgs(argv) {
    const args = {};
    for (let i = 2; i < argv.length; i += 1) {
        const key = argv[i];
        if (!key || !key.startsWith('--')) continue;
        const value = argv[i + 1];
        if (value && !value.startsWith('--')) {
            args[key.slice(2)] = value;
            i += 1;
        } else {
            args[key.slice(2)] = true;
        }
    }
    return args;
}

function readPngSize(pngBuffer) {
    if (pngBuffer.length < 24) return null;
    const signature = pngBuffer.subarray(0, 8).toString('hex');
    if (signature !== '89504e470d0a1a0a') return null;
    const width = pngBuffer.readUInt32BE(16);
    const height = pngBuffer.readUInt32BE(20);
    return { width, height };
}

function buildIcoFromPngBuffers(pngBuffers) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(pngBuffers.length, 4);

    const dirs = [];
    let offset = 6 + 16 * pngBuffers.length;

    for (const pngBuffer of pngBuffers) {
        const size = readPngSize(pngBuffer);
        if (!size) throw new Error('PNG 数据无效');
        if (size.width !== size.height) throw new Error(`PNG 必须为正方形，当前为 ${size.width}x${size.height}`);
        if (size.width > 256) throw new Error(`PNG 尺寸过大 (${size.width}x${size.height})，Windows 图标需要 256x256 及以下`);

        const dir = Buffer.alloc(16);
        dir.writeUInt8(size.width === 256 ? 0 : size.width, 0);
        dir.writeUInt8(size.height === 256 ? 0 : size.height, 1);
        dir.writeUInt8(0, 2);
        dir.writeUInt8(0, 3);
        dir.writeUInt16LE(1, 4);
        dir.writeUInt16LE(32, 6);
        dir.writeUInt32LE(pngBuffer.length, 8);
        dir.writeUInt32LE(offset, 12);
        dirs.push(dir);
        offset += pngBuffer.length;
    }

    return Buffer.concat([header, ...dirs, ...pngBuffers]);
}

function convertWithPowerShell(pngPath, icoPath) {
    const psScriptPath = path.join(__dirname, 'convert-icon.ps1');
    if (!fs.existsSync(psScriptPath)) {
        throw new Error(`找不到脚本: ${psScriptPath}`);
    }

    const result = spawnSync(
        'powershell.exe',
        [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-File',
            psScriptPath,
            '-PngPath',
            pngPath,
            '-IcoPath',
            icoPath,
            '-Size',
            '256'
        ],
        { stdio: 'inherit', windowsHide: true }
    );

    if (result.status !== 0) {
        throw new Error('PowerShell 图标转换失败');
    }
}

function main() {
    const args = parseArgs(process.argv);

    const pngPath = path.resolve(args.png ? args.png : path.join(__dirname, '..', 'public', 'icon.png'));
    const buildDir = path.join(__dirname, '..', 'build');
    const icoPath = path.resolve(args.out ? args.out : path.join(buildDir, 'icon.ico'));

    if (!fs.existsSync(pngPath)) {
        console.error('✗ 错误: 找不到图标源文件');
        console.error(`  ${pngPath}`);
        process.exit(1);
    }

    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }

    try {
        const pngBuffer = fs.readFileSync(pngPath);
        const size = readPngSize(pngBuffer);
        if (!size) throw new Error('PNG 源文件无效');

        if (process.platform === 'win32') {
            if (size.width !== 256 || size.height !== 256) {
                convertWithPowerShell(pngPath, icoPath);
                console.log('\n✓ 图标准备完成！');
                return;
            }
        } else {
            if (size.width !== 256 || size.height !== 256) {
                throw new Error(`PNG 需要为 256x256（当前为 ${size.width}x${size.height}），请先调整尺寸后再生成 ico`);
            }
        }

        const ico = buildIcoFromPngBuffers([pngBuffer]);
        fs.writeFileSync(icoPath, ico);
        console.log(`✓ 图标已生成: ${icoPath}`);
        console.log(`  源文件: ${pngPath}`);
        console.log(`  大小: ${(ico.length / 1024).toFixed(2)} KB`);
        console.log('\n✓ 图标准备完成！');
    } catch (error) {
        console.error('\n✗ 图标转换失败:');
        console.error(`  ${error.message}`);
        process.exit(1);
    }
}

main();
