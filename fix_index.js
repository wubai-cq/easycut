const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexHtmlBackup = fs.readFileSync('index.html.backup', 'utf8');

const settingsOverlayRegex = /<!-- 设置面板 -->[\s\S]*?(?=<!-- Toast 提示 -->)/;
const settingsOverlayMatch = indexHtmlBackup.match(settingsOverlayRegex);

const toastDialogRegex = /<!-- Toast 提示 -->[\s\S]*?(?=<script src="renderer.js">)/;
const toastDialogMatch = indexHtmlBackup.match(toastDialogRegex);


if (settingsOverlayMatch && toastDialogMatch) {
    const updatedHtml = indexHtml.replace(
        /<!-- 分享覆盖层 -->[\s\S]*?(?=<script src="renderer.js">)/,
        `<!-- 分享覆盖层 -->\n    <div id="share-overlay" class="share-overlay" style="display: none;">\n        <div class="share-wrapper">\n            <img src="assets/icon_wubai.png" alt="分享二维码" class="share-qr">\n            <div class="share-text">公众号500佰<br>欢迎留言 发送EasyCut获取下载链接</div>\n        </div>\n    </div>\n\n    ${settingsOverlayMatch[0]}\n    ${toastDialogMatch[0]}`
    );
    fs.writeFileSync('index.html', updatedHtml, 'utf8');
    console.log('Fixed index.html');
} else {
    console.log('Could not find matches');
}
