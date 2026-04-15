const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// The settings overlay works when we click id="btn-settings"
// Let's make sure the icon-button for settings has this id
const fixBtnSettings = indexHtml.replace(
    /<button id="btn-settings" class="icon-button" title="设置">/g,
    '<button id="btn-settings" class="icon-button settings-icon" title="设置">'
);

fs.writeFileSync('index.html', fixBtnSettings, 'utf8');
console.log('Fixed btn-settings class');
