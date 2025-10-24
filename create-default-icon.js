const fs = require('fs');
const path = require('path');

// 创建一个简单的默认图标
const iconSvg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="#0E1122"/>
  <circle cx="128" cy="128" r="100" fill="none" stroke="#1D2A55" stroke-width="8"/>
  <circle cx="128" cy="128" r="60" fill="none" stroke="#28a745" stroke-width="6"/>
  <circle cx="128" cy="128" r="20" fill="#28a745"/>
  <path d="M 80 80 L 176 176 M 176 80 L 80 176" stroke="#ffc107" stroke-width="4"/>
  <text x="128" y="200" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">轻松切</text>
</svg>`;

// 创建 assets 目录（如果不存在）
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 写入 SVG 文件
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSvg);

console.log('✅ 默认图标已创建：assets/icon.svg');
console.log('📝 请将此文件转换为 PNG 格式 (256x256) 并保存为 assets/icon.png');
console.log('🔗 在线转换工具：https://convertio.co/svg-png/');
