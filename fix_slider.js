const fs = require('fs');

const css = fs.readFileSync('styles.css', 'utf8');

const additionalCss = `

/* 进一步修复滑块开关，确保与新 UI 一致 */
.toggle-slider {
    background: var(--bg-hover) !important;
    border: 1px solid var(--border-strong) !important;
}

.toggle-switch input:checked + .toggle-slider {
    background: var(--accent-success) !important;
    border-color: var(--accent-success) !important;
}

.toggle-slider::before {
    background: var(--text-primary) !important;
}

`;

fs.writeFileSync('styles.css', css + additionalCss, 'utf8');
fs.writeFileSync('styles-v2.css', css + additionalCss, 'utf8');
