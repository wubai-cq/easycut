const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Also fix close button in settings to match modern style 
const fixCloseSettings = indexHtml.replace(
    /<button id="btn-close-settings" class="close-button" title="关闭">/,
    '<button id="btn-close-settings" class="icon-button close-button" title="关闭">'
);

fs.writeFileSync('index.html', fixCloseSettings, 'utf8');
