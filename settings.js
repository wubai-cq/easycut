// ========================================
// 设置面板交互逻辑
// ========================================

// 默认设置
const DEFAULT_SETTINGS = {
    // 通用设置
    autoStart: false,
    minimizeToTray: true,
    closeToMinimize: true,

    // 界面设置
    theme: 'dark',
    language: 'zh-CN',
    fontSize: 'medium',

    // 网络设置
    autoSwitch: false,
    checkInterval: 10,
    retryCount: 3,

    // 通知设置
    enableNotification: true,
    soundAlert: true,
    statusChangeNotify: true,

    // 高级设置
    logLevel: 'warn'
};

// 当前设置
let currentSettings = { ...DEFAULT_SETTINGS };

// DOM 元素
let settingsOverlay, settingsModal, btnOpenSettings, btnSaveSettings, btnReset;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    settingsOverlay = document.getElementById('settings-overlay');
    settingsModal = document.querySelector('.settings-modal');
    btnOpenSettings = document.getElementById('btn-settings');
    btnSaveSettings = document.getElementById('btn-save-settings');
    btnReset = document.getElementById('btn-reset');

    // 加载保存的设置
    loadSettings();

    // 绑定事件
    bindEvents();
});

// 绑定事件
function bindEvents() {
    // 打开设置面板
    btnOpenSettings.addEventListener('click', openSettings);

    // 关闭设置面板
    document.getElementById('btn-close-settings').addEventListener('click', closeSettings);
    settingsOverlay.addEventListener('click', (e) => {
        if (e.target === settingsOverlay) {
            closeSettings();
        }
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsOverlay.style.display === 'flex') {
            closeSettings();
        }
    });

    // 保存设置
    btnSaveSettings.addEventListener('click', saveSettings);

    // 重置按钮
    btnReset.addEventListener('click', () => {
        showConfirmDialog('确认重置', '确定要重置所有设置为默认值吗?', () => {
            currentSettings = { ...DEFAULT_SETTINGS };
            applySettingsToUI();
            saveToStorage();
            showToast('✓ 已恢复默认设置', 'success');
        });
    });

    // 清除缓存按钮
    document.getElementById('btn-clear-cache').addEventListener('click', () => {
        showConfirmDialog('确认清除', '确定要清除所有缓存数据吗?', () => {
            clearCache();
        });
    });

    // 重置设置按钮
    document.getElementById('btn-reset-settings').addEventListener('click', () => {
        showConfirmDialog('确认重置', '确定要重置所有设置为默认值吗?', () => {
            currentSettings = { ...DEFAULT_SETTINGS };
            applySettingsToUI();
            saveToStorage();
            showToast('✓ 已恢复默认设置', 'success');
        });
    });

    // 实时更新设置项
    document.querySelectorAll('.toggle-switch input').forEach(input => {
        input.addEventListener('change', () => {
            updateSettingFromUI();
        });
    });

    document.querySelectorAll('.radio-group input').forEach(input => {
        input.addEventListener('change', () => {
            updateSettingFromUI();
        });
    });

    document.querySelectorAll('.setting-select').forEach(select => {
        select.addEventListener('change', () => {
            updateSettingFromUI();
        });
    });
}

// 打开设置面板
function openSettings() {
    settingsOverlay.style.display = 'flex';
    loadSettingsToUI();
    document.body.style.overflow = 'hidden';
}

// 关闭设置面板
function closeSettings() {
    settingsOverlay.classList.add('closing');
    setTimeout(() => {
        settingsOverlay.style.display = 'none';
        settingsOverlay.classList.remove('closing');
        document.body.style.overflow = '';
    }, 200);
}

// 加载设置到 UI
function loadSettingsToUI() {
    // 通用设置
    document.getElementById('setting-auto-start').checked = currentSettings.autoStart;
    document.getElementById('setting-minimize-to-tray').checked = currentSettings.minimizeToTray;
    document.getElementById('setting-close-to-minimize').checked = currentSettings.closeToMinimize;

    // 界面设置
    document.querySelector(`input[name="theme"][value="${currentSettings.theme}"]`).checked = true;
    document.getElementById('setting-language').value = currentSettings.language;
    document.querySelector(`input[name="fontSize"][value="${currentSettings.fontSize}"]`).checked = true;

    // 网络设置
    document.getElementById('setting-auto-switch').checked = currentSettings.autoSwitch;
    document.getElementById('setting-check-interval').value = currentSettings.checkInterval;
    document.getElementById('setting-retry-count').value = currentSettings.retryCount;

    // 通知设置
    document.getElementById('setting-enable-notification').checked = currentSettings.enableNotification;
    document.getElementById('setting-sound-alert').checked = currentSettings.soundAlert;
    document.getElementById('setting-status-change-notify').checked = currentSettings.statusChangeNotify;

    // 高级设置
    document.getElementById('setting-log-level').value = currentSettings.logLevel;
}

// 从 UI 更新设置
function updateSettingFromUI() {
    // 通用设置
    currentSettings.autoStart = document.getElementById('setting-auto-start').checked;
    currentSettings.minimizeToTray = document.getElementById('setting-minimize-to-tray').checked;
    currentSettings.closeToMinimize = document.getElementById('setting-close-to-minimize').checked;

    // 界面设置
    currentSettings.theme = document.querySelector('input[name="theme"]:checked').value;
    currentSettings.language = document.getElementById('setting-language').value;
    currentSettings.fontSize = document.querySelector('input[name="fontSize"]:checked').value;

    // 网络设置
    currentSettings.autoSwitch = document.getElementById('setting-auto-switch').checked;
    currentSettings.checkInterval = parseInt(document.getElementById('setting-check-interval').value);
    currentSettings.retryCount = parseInt(document.getElementById('setting-retry-count').value);

    // 通知设置
    currentSettings.enableNotification = document.getElementById('setting-enable-notification').checked;
    currentSettings.soundAlert = document.getElementById('setting-sound-alert').checked;
    currentSettings.statusChangeNotify = document.getElementById('setting-status-change-notify').checked;

    // 高级设置
    currentSettings.logLevel = document.getElementById('setting-log-level').value;
}

// 应用设置到 UI
function applySettingsToUI() {
    loadSettingsToUI();
}

// 保存设置
function saveSettings() {
    updateSettingFromUI();

    const btn = btnSaveSettings;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '保存中...';

    setTimeout(() => {
        saveToStorage();
        applySettings();

        btn.disabled = false;
        btn.textContent = originalText;

        showToast('✓ 设置已保存', 'success');
        closeSettings();
    }, 500);
}

// 保存到存储
function saveToStorage() {
    try {
        localStorage.setItem('easycut-settings', JSON.stringify(currentSettings));
        console.log('设置已保存:', currentSettings);
    } catch (error) {
        console.error('保存设置失败:', error);
        showToast('✗ 保存失败', 'error');
    }
}

// 从存储加载设置
function loadSettings() {
    try {
        const saved = localStorage.getItem('easycut-settings');
        if (saved) {
            currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            console.log('设置已加载:', currentSettings);
        }
        applySettings();
    } catch (error) {
        console.error('加载设置失败:', error);
        currentSettings = { ...DEFAULT_SETTINGS };
    }
}

// 应用设置
function applySettings() {
    // 这里可以添加实际应用设置的逻辑
    // 例如: 主题切换、语言切换等

    console.log('应用设置:', currentSettings);

    // 主题应用
    if (currentSettings.theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    // 字体大小应用
    const fontSizes = {
        small: '14px',
        medium: '16px',
        large: '18px'
    };
    document.documentElement.style.fontSize = fontSizes[currentSettings.fontSize];

    // 语言应用 (需要配合 i18n)
    // ...

    // Electron 特定设置
    if (typeof require !== 'undefined') {
        try {
            const { ipcRenderer } = require('electron');

            // 发送设置到主进程
            ipcRenderer.send('update-settings', currentSettings);

            // 开机自启动
            if (currentSettings.autoStart !== undefined) {
                ipcRenderer.send('set-auto-start', currentSettings.autoStart);
            }
        } catch (error) {
            console.error('Electron 设置应用失败:', error);
        }
    }
}

// 清除缓存
function clearCache() {
    try {
        // 清除 localStorage
        localStorage.clear();

        // 清除 sessionStorage
        sessionStorage.clear();

        // 清除其他缓存
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }

        showToast('✓ 缓存已清除', 'success');
        console.log('缓存已清除');
    } catch (error) {
        console.error('清除缓存失败:', error);
        showToast('✗ 清除失败', 'error');
    }
}

// 显示 Toast 提示
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('hiding');
        }, 300);
    }, 2000);
}

// 显示确认对话框
function showConfirmDialog(title, message, onConfirm) {
    const overlay = document.getElementById('confirm-dialog');
    const titleEl = overlay.querySelector('.confirm-title');
    const messageEl = document.getElementById('confirm-message');
    const btnCancel = document.getElementById('btn-confirm-cancel');
    const btnOk = document.getElementById('btn-confirm-ok');

    titleEl.textContent = title;
    messageEl.textContent = message;
    overlay.style.display = 'flex';

    const close = () => {
        overlay.style.display = 'none';
        btnCancel.removeEventListener('click', close);
        btnOk.removeEventListener('click', confirm);
    };

    const confirm = () => {
        close();
        if (onConfirm) {
            onConfirm();
        }
    };

    btnCancel.addEventListener('click', close);
    btnOk.addEventListener('click', confirm);
}

// 导出函数 (供其他模块使用)
window.Settings = {
    get: (key) => currentSettings[key],
    set: (key, value) => {
        currentSettings[key] = value;
        saveToStorage();
    },
    getAll: () => ({ ...currentSettings }),
    reset: () => {
        currentSettings = { ...DEFAULT_SETTINGS };
        saveToStorage();
        applySettingsToUI();
    }
};
