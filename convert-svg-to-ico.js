const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否有 sharp 库
try {
    require.resolve('sharp');
} catch (e) {
    console.log('正在安装 sharp 库...');
    execSync('npm install sharp --save-dev', { stdio: 'inherit', cwd: __dirname });
}

const sharp = require('sharp');

async function convertPngToIco(pngPath, icoPath) {
    // 读取 PNG 并调整为多个尺寸
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = [];

    for (const size of sizes) {
        const buffer = await sharp(pngPath)
            .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();
        pngBuffers.push(buffer);
    }

    // 构建 ICO 文件
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type: Icon
    header.writeUInt16LE(pngBuffers.length, 4); // Count

    const dirs = [];
    let offset = 6 + 16 * pngBuffers.length;

    for (let i = 0; i < pngBuffers.length; i++) {
        const pngBuffer = pngBuffers[i];
        const size = sizes[i];

        const dir = Buffer.alloc(16);
        dir.writeUInt8(size === 256 ? 0 : size, 0); // Width
        dir.writeUInt8(size === 256 ? 0 : size, 1); // Height
        dir.writeUInt8(0, 2); // Colors
        dir.writeUInt8(0, 3); // Reserved
        dir.writeUInt16LE(1, 4); // Color planes
        dir.writeUInt16LE(32, 6); // Bits per pixel
        dir.writeUInt32LE(pngBuffer.length, 8); // Size
        dir.writeUInt32LE(offset, 12); // Offset
        dirs.push(dir);
        offset += pngBuffer.length;
    }

    const icoBuffer = Buffer.concat([header, ...dirs, ...pngBuffers]);
    fs.writeFileSync(icoPath, icoBuffer);

    console.log(`✓ ICO 图标已生成: ${icoPath}`);
    console.log(`  包含尺寸: ${sizes.join(', ')}px`);
}

async function main() {
    const pngPath = path.join(__dirname, 'assets', 'icon.png');
    const icoPath = path.join(__dirname, 'icon.ico');

    if (!fs.existsSync(pngPath)) {
        console.error('✗ 错误: 找不到 assets/icon.png');
        process.exit(1);
    }

    try {
        await convertPngToIco(pngPath, icoPath);
        console.log('\n✓ 转换完成！请重启应用查看新图标。');
    } catch (error) {
        console.error('\n✗ 转换失败:', error.message);
        process.exit(1);
    }
}

main();
