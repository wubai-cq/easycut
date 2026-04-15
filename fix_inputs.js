const fs = require('fs');

const css = fs.readFileSync('styles.css', 'utf8');

const additionalCss = `

/* 修复设置面板的输入框和单选框样式以匹配深色主题 */
.setting-select {
    background-color: var(--bg-hover) !important;
    border: 1px solid var(--border-default) !important;
    color: var(--text-primary) !important;
    border-radius: var(--radius-md) !important;
    height: 36px !important;
    padding: 0 var(--spacing-md) !important;
    font-size: var(--text-sm) !important;
    outline: none !important;
}

.setting-select:focus {
    border-color: var(--accent-primary) !important;
}

.setting-select option {
    background-color: var(--bg-elevated) !important;
    color: var(--text-primary) !important;
}

.radio-label {
    color: var(--text-secondary) !important;
}

.radio-option input:checked + .radio-label {
    color: var(--accent-primary) !important;
}

.radio-label::before {
    border: 2px solid var(--border-strong) !important;
}

.radio-option input:checked + .radio-label::before {
    border-color: var(--accent-primary) !important;
    background-color: var(--accent-primary) !important;
}

.radio-option:hover .radio-label::before {
    border-color: var(--accent-primary) !important;
}

`;

fs.writeFileSync('styles.css', css + additionalCss, 'utf8');
fs.writeFileSync('styles-v2.css', css + additionalCss, 'utf8');
