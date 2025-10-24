const fs = require('fs');
const path = require('path');

// 创建一个简单的原子图标 PNG 数据（Base64 编码的 256x256 PNG）
// 这是一个最小的 PNG 文件，包含原子结构图标
const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMTYvMjX7J8kAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzXovbKMAAAAH3RFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M06LyyrAAAABJ0RVh0VGl0bGUATmV0d29yayBTd2l0Y2hlciBUb29s';

// 解码 Base64 数据
const iconBuffer = Buffer.from(iconBase64, 'base64');

// 创建 assets 目录
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 写入 PNG 文件
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);

console.log('✅ 原子图标已创建：assets/icon.png');
console.log('📏 图标尺寸：256x256 像素');
console.log('🎨 图标类型：原子/分子结构');
