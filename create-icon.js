const fs = require('fs');
const path = require('path');

// 创建一个原子/分子结构的图标
const iconSvg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="nucleus" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4fc3f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#29b6f6;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="orbit" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#81c784;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#66bb6a;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="256" height="256" fill="url(#bg)" rx="32"/>
  
  <!-- 原子核 -->
  <circle cx="128" cy="128" r="20" fill="url(#nucleus)" stroke="#1976d2" stroke-width="2"/>
  
  <!-- 轨道1 -->
  <ellipse cx="128" cy="128" rx="60" ry="30" fill="none" stroke="url(#orbit)" stroke-width="3" opacity="0.8"/>
  <circle cx="188" cy="128" r="8" fill="#81c784" stroke="#4caf50" stroke-width="1"/>
  
  <!-- 轨道2 -->
  <ellipse cx="128" cy="128" rx="45" ry="45" fill="none" stroke="url(#orbit)" stroke-width="2" opacity="0.6"/>
  <circle cx="173" cy="83" r="6" fill="#81c784" stroke="#4caf50" stroke-width="1"/>
  
  <!-- 轨道3 -->
  <ellipse cx="128" cy="128" rx="30" ry="60" fill="none" stroke="url(#orbit)" stroke-width="2" opacity="0.7"/>
  <circle cx="128" cy="68" r="6" fill="#81c784" stroke="#4caf50" stroke-width="1"/>
  
  <!-- 连接线 -->
  <line x1="128" y1="128" x2="188" y2="128" stroke="#4caf50" stroke-width="1" opacity="0.3"/>
  <line x1="128" y1="128" x2="173" y2="83" stroke="#4caf50" stroke-width="1" opacity="0.3"/>
  <line x1="128" y1="128" x2="128" y2="68" stroke="#4caf50" stroke-width="1" opacity="0.3"/>
  
  <!-- 应用名称 -->
  <text x="128" y="220" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="bold">轻松切</text>
</svg>`;

// 创建 assets 目录（如果不存在）
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 写入 SVG 文件
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSvg);

console.log('✅ 原子图标已创建：assets/icon.svg');
console.log('📝 请将此文件转换为 PNG 格式 (256x256) 并保存为 assets/icon.png');
console.log('🔗 在线转换工具：https://convertio.co/svg-png/');
console.log('💡 或者使用 ImageMagick: magick assets/icon.svg assets/icon.png');