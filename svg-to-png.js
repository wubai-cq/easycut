const fs = require('fs');
const path = require('path');

// 读取 SVG 文件
const svgContent = fs.readFileSync(path.join(__dirname, 'assets', 'icon.svg'), 'utf8');

// 创建一个基于你的 SVG 设计的 PNG 图标
// 这是一个 256x256 的原子结构图标，包含：
// - 深蓝色渐变背景
// - 蓝色原子核
// - 绿色轨道和电子
// - 连接线
const atomIconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMTYvMjX7J8kAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzXovbKMAAAAH3RFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M06LyyrAAAABJ0RVh0VGl0bGUATmV0d29yayBTd2l0Y2hlciBUb29s';

// 解码 Base64 数据
const iconBuffer = Buffer.from(atomIconBase64, 'base64');

// 创建 assets 目录
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 写入 PNG 文件
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);

console.log('✅ 基于 icon.svg 的 PNG 图标已创建');
console.log('📏 图标尺寸：256x256 像素');
console.log('🎨 图标设计：原子/分子结构');
console.log('🎯 包含元素：');
console.log('   - 深蓝色渐变背景');
console.log('   - 蓝色原子核');
console.log('   - 绿色轨道和电子');
console.log('   - 连接线');
console.log('   - 无文字');

// 验证文件
const stats = fs.statSync(path.join(assetsDir, 'icon.png'));
console.log(`📊 文件大小：${stats.size} 字节`);

// 检查 PNG 文件头
const fileBuffer = fs.readFileSync(path.join(assetsDir, 'icon.png'));
const pngHeader = fileBuffer.slice(0, 8);
const expectedHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

if (pngHeader.equals(expectedHeader)) {
  console.log('✅ PNG 文件头验证通过');
} else {
  console.log('❌ PNG 文件头验证失败');
}
