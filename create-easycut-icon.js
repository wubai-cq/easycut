const fs = require('fs');
const path = require('path');

console.log('=== 创建 EasyCut 图标 ===');

// 创建一个简单的 SVG 图标
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆形 -->
  <circle cx="128" cy="128" r="120" fill="#4a90e2" stroke="#2c5aa0" stroke-width="4"/>
  
  <!-- 网络图标 -->
  <g transform="translate(64, 64)">
    <!-- 路由器/交换机图标 -->
    <rect x="20" y="40" width="88" height="48" rx="8" fill="#ffffff" stroke="#2c5aa0" stroke-width="2"/>
    
    <!-- 指示灯 -->
    <circle cx="40" cy="56" r="4" fill="#00ff00"/>
    <circle cx="60" cy="56" r="4" fill="#ffaa00"/>
    <circle cx="80" cy="56" r="4" fill="#ff0000"/>
    <circle cx="100" cy="56" r="4" fill="#00ff00"/>
    
    <!-- 网络连接线 -->
    <line x1="0" y1="20" x2="20" y2="40" stroke="#ffffff" stroke-width="3"/>
    <line x1="0" y1="40" x2="20" y2="40" stroke="#ffffff" stroke-width="3"/>
    <line x1="0" y1="60" x2="20" y2="40" stroke="#ffffff" stroke-width="3"/>
    <line x1="0" y1="80" x2="20" y2="40" stroke="#ffffff" stroke-width="3"/>
    
    <line x1="108" y1="40" x2="128" y2="20" stroke="#ffffff" stroke-width="3"/>
    <line x1="108" y1="40" x2="128" y2="40" stroke="#ffffff" stroke-width="3"/>
    <line x1="108" y1="40" x2="128" y2="60" stroke="#ffffff" stroke-width="3"/>
    <line x1="108" y1="40" x2="128" y2="80" stroke="#ffffff" stroke-width="3"/>
  </g>
  
  <!-- 文字 "EC" -->
  <text x="128" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#ffffff">EC</text>
</svg>`;

// 保存 SVG 图标
const svgPath = path.join(__dirname, 'easycut-icon.svg');
fs.writeFileSync(svgPath, svgIcon);
console.log('✅ SVG 图标已创建:', svgPath);

// 创建 ICO 文件的简单版本（这里我们创建一个占位符）
// 注意：实际应用中需要使用专业的图标转换工具
const icoHeader = Buffer.from([
    0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x68, 0x05,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00
]);

console.log('\n=== 图标创建完成 ===');
console.log('1. SVG 图标已创建:', svgPath);
console.log('2. 建议使用专业工具将 SVG 转换为 ICO 格式');
console.log('3. 或者使用在线图标转换工具');
console.log('4. 推荐工具: GIMP, Inkscape, 或在线转换器');

console.log('\n=== 使用建议 ===');
console.log('1. 使用现有的 icon.ico 文件（如果有效）');
console.log('2. 或者使用新创建的 SVG 文件转换为 ICO');
console.log('3. 确保图标文件包含多种尺寸（16x16, 32x32, 48x48, 64x64, 128x128, 256x256）');
console.log('4. 重新打包应用程序以应用新图标');
