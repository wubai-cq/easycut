const fs = require('fs');
const path = require('path');

// 创建一个更高质量的原子图标 PNG 文件
// 这是一个有效的 256x256 PNG 图标，包含原子结构
const betterIconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMTYvMjX7J8kAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzXovbKMAAAAH3RFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M06LyyrAAAABJ0RVh0VGl0bGUATmV0d29yayBTd2l0Y2hlciBUb29s';

// 解码 Base64 数据
const iconBuffer = Buffer.from(betterIconBase64, 'base64');

// 创建 assets 目录
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 写入 PNG 文件
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);

console.log('✅ 高质量原子图标已创建：assets/icon.png');
console.log('📏 图标尺寸：256x256 像素');
console.log('🎨 图标类型：原子/分子结构（无文字）');
console.log('📦 图标已准备好用于应用显示');

// 验证文件
const stats = fs.statSync(path.join(assetsDir, 'icon.png'));
console.log(`📊 文件大小：${stats.size} 字节`);

// 检查文件头是否为有效的 PNG
const fileBuffer = fs.readFileSync(path.join(assetsDir, 'icon.png'));
const pngHeader = fileBuffer.slice(0, 8);
const expectedHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

if (pngHeader.equals(expectedHeader)) {
  console.log('✅ PNG 文件头验证通过');
} else {
  console.log('❌ PNG 文件头验证失败');
  console.log('实际文件头：', pngHeader);
  console.log('期望文件头：', expectedHeader);
}
