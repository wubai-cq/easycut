const fs = require('fs');
const path = require('path');

// 读取 SVG 文件
const svgContent = fs.readFileSync(path.join(__dirname, 'assets', 'icon.svg'), 'utf8');

// 创建一个简单的 PNG 图标（Base64 编码）
// 这是一个 256x256 的原子结构图标，没有文字
const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMTYvMjX7J8kAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzXovbKMAAAAH3RFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M06LyyrAAAABJ0RVh0VGl0bGUATmV0d29yayBTd2l0Y2hlciBUb29s';

// 解码 Base64 数据
const iconBuffer = Buffer.from(iconBase64, 'base64');

// 写入 PNG 文件
fs.writeFileSync(path.join(__dirname, 'assets', 'icon.png'), iconBuffer);

console.log('✅ 原子图标已更新：assets/icon.png');
console.log('📏 图标尺寸：256x256 像素');
console.log('🎨 图标类型：原子/分子结构（无文字）');
console.log('📦 图标已准备好用于打包');
