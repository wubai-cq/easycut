// 渲染进程脚本
let currentInterfaces = [];

// DOM元素（在 DOMContentLoaded 后初始化）
let statusText;
let adminWarning;
let shareButton;
let shareOverlay;

// 激活界面相关元素
let activationScreen;
let mainApp;
let activationCodeInput;
let activateButton;
let activationMessage;

// 更新状态栏
function updateStatus(message, type = 'info') {
    if (!statusText) {
        console.warn('[前端] statusText 元素未初始化');
        return;
    }
    
    statusText.textContent = message;
    
    // 根据类型设置颜色
    if (type === 'success') {
        statusText.style.color = '#28a745';
    } else if (type === 'error') {
        statusText.style.color = '#dc3545';
    } else if (type === 'warning') {
        statusText.style.color = '#ffc107';
    } else {
        statusText.style.color = '#6c757d';
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    updateStatus(message, type);
    
    // 3秒后恢复默认状态
    setTimeout(() => {
        updateStatus('就绪', 'info');
    }, 3000);
}

// 加载网络接口列表
async function loadInterfaces() {
    try {
        updateStatus('正在加载网络接口...', 'info');

        const result = await window.networkAPI.getInterfaces();

        if (result.success) {
            currentInterfaces = result.data;
            // 更新状态卡片中的外网/内网状态
            updateStatusBadges(currentInterfaces);
            updateStatus(`已加载 ${currentInterfaces.length} 个网络接口`, 'success');

            // 检查网络连通性并更新模式显示
            await checkConnectivityAndShowIndicator();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        updateStatus(`加载失败: ${error.message}`, 'error');
    }
}

// 初始加载时根据网络状态设置选中状态
async function initNetworkState() {
    try {
        const result = await window.networkAPI.getInterfaces();
        if (result.success) {
            const interfaces = result.data;

            // 查找外网和内网接口
            const waiwang = interfaces.find(iface =>
                iface.name.toLowerCase().includes('waiwang') ||
                iface.name.toLowerCase().includes('wifi') ||
                iface.name.toLowerCase().includes('wireless') ||
                iface.name.toLowerCase().includes('wi-fi')
            );

            const neiwang = interfaces.find(iface =>
                iface.name.toLowerCase().includes('neiwang') ||
                iface.name.toLowerCase().includes('ethernet') ||
                iface.name.toLowerCase().includes('lan')
            );

            const externalEnabled = waiwang && waiwang.status === 'enabled';
            const internalEnabled = neiwang && neiwang.status === 'enabled';

            // 根据初始状态设置选中状态
            if (externalEnabled && internalEnabled) {
                updateActionCards('both');
            } else if (externalEnabled) {
                updateActionCards('external');
            }

            // 更新状态标签
            updateStatusBadges(interfaces);
        }
    } catch (error) {
        console.error('[前端] 初始化网络状态失败:', error);
    }
}

// 更新状态卡片中的外网/内网状态标识
function updateStatusBadges(interfaces) {
    const badgeExternal = document.getElementById('badge-external');
    const badgeInternal = document.getElementById('badge-internal');
    const networkStatus = document.getElementById('network-status');
    
    // 查找外网接口
    const waiwang = interfaces.find(iface => 
        iface.name.toLowerCase().includes('waiwang') || 
        iface.name.toLowerCase().includes('wifi') || 
        iface.name.toLowerCase().includes('wireless') ||
        iface.name.toLowerCase().includes('wi-fi')
    );
    
    // 查找内网接口
    const neiwang = interfaces.find(iface => 
        iface.name.toLowerCase().includes('neiwang') || 
        iface.name.toLowerCase().includes('ethernet') ||
        iface.name.toLowerCase().includes('lan')
    );
    
    // 更新外网状态
    if (badgeExternal) {
        if (waiwang) {
            if (waiwang.status === 'enabled' && waiwang.state === 'connected') {
                badgeExternal.textContent = '外网: 启用';
                badgeExternal.classList.add('active');
            } else if (waiwang.status === 'enabled') {
                badgeExternal.textContent = '外网: 已启用';
                badgeExternal.classList.add('active');
            } else {
                badgeExternal.textContent = '外网: 已禁用';
                badgeExternal.classList.remove('active');
            }
        } else {
            badgeExternal.textContent = '外网: 未检测到';
            badgeExternal.classList.remove('active');
        }
    }
    
    // 更新内网状态
    if (badgeInternal) {
        if (neiwang) {
            if (neiwang.status === 'enabled' && neiwang.state === 'connected') {
                badgeInternal.textContent = '内网: 启用';
                badgeInternal.classList.add('active');
            } else if (neiwang.status === 'enabled') {
                badgeInternal.textContent = '内网: 已启用';
                badgeInternal.classList.add('active');
            } else {
                badgeInternal.textContent = '内网: 已禁用';
                badgeInternal.classList.remove('active');
            }
        } else {
            badgeInternal.textContent = '内网: 未检测到';
            badgeInternal.classList.remove('active');
        }
    }
    
    // 更新网络状态文字
    if (networkStatus) {
        const hasConnected = interfaces.some(iface => iface.state === 'connected');
        networkStatus.textContent = hasConnected ? '已连接' : '未连接';
    }
}

// 检查网络连通性并显示指示器
async function checkConnectivityAndShowIndicator() {
    try {
        console.log('[前端] 检查网络连通性...');
        updateStatus('正在检查网络模式...', 'info');
        
        // 获取接口状态来判断当前模式
        const result = await window.networkAPI.getInterfaces();
        if (result.success) {
            const interfaces = result.data;
            
            // 查找外网和内网接口
            const waiwang = interfaces.find(iface => 
                iface.name.toLowerCase().includes('waiwang') || 
                iface.name.toLowerCase().includes('wifi') || 
                iface.name.toLowerCase().includes('wireless') ||
                iface.name.toLowerCase().includes('wi-fi')
            );
            
            const neiwang = interfaces.find(iface => 
                iface.name.toLowerCase().includes('neiwang') || 
                iface.name.toLowerCase().includes('ethernet') ||
                iface.name.toLowerCase().includes('lan')
            );
            
            const externalEnabled = waiwang && waiwang.status === 'enabled';
            const internalEnabled = neiwang && neiwang.status === 'enabled';
            
            // 更新当前模式显示（不自动更新卡片选中状态，保持用户选择）
            const currentModeText = document.getElementById('current-mode');
            if (currentModeText) {
                if (externalEnabled && internalEnabled) {
                    currentModeText.textContent = '双网模式';
                } else if (externalEnabled) {
                    currentModeText.textContent = '外网模式';
                } else if (internalEnabled) {
                    currentModeText.textContent = '内网模式';
                } else {
                    currentModeText.textContent = '无网络';
                }
            }
            
            const modeText = externalEnabled && internalEnabled ? '双网模式' : 
                             externalEnabled ? '外网模式' : 
                             internalEnabled ? '内网模式' : '无网络';
            updateStatus(`当前模式: ${modeText}`, 'success');
        }
        
    } catch (error) {
        console.error('[前端] 网络连通性检查失败:', error);
        updateStatus('网络模式检查失败', 'warning');
    }
}

// 接口控制功能已移除

// 禁用/启用所有按钮（用于刷新操作）
function disableAllButtons(disabled) {
    // 模式切换按钮通过 CSS 类控制状态
    const cardExternal = document.getElementById('card-external');
    const cardBoth = document.getElementById('card-both');
    const statusRefresh = document.querySelector('.status-refresh');

    if (cardExternal) cardExternal.style.pointerEvents = disabled ? 'none' : 'auto';
    if (cardBoth) cardBoth.style.pointerEvents = disabled ? 'none' : 'auto';
    if (statusRefresh) statusRefresh.style.pointerEvents = disabled ? 'none' : 'auto';
}

// 更新操作卡片选中状态
function updateActionCards(mode) {
    const cardExternal = document.getElementById('card-external');
    const cardBoth = document.getElementById('card-both');

    // 重置所有卡片状态
    if (cardExternal) {
        cardExternal.classList.remove('active');
        const check = cardExternal.querySelector('.action-card-check');
        if (check) check.style.display = 'none';
    }
    if (cardBoth) {
        cardBoth.classList.remove('active');
        const check = cardBoth.querySelector('.action-card-check');
        if (check) check.style.display = 'none';
    }

    // 根据当前模式设置选中状态
    if (mode === 'external' && cardExternal) {
        cardExternal.classList.add('active');
        const check = cardExternal.querySelector('.action-card-check');
        if (check) check.style.display = 'flex';
    } else if (mode === 'both' && cardBoth) {
        cardBoth.classList.add('active');
        const check = cardBoth.querySelector('.action-card-check');
        if (check) check.style.display = 'flex';
    }
}

// 处理刷新按钮点击 - ping baidu.com 只更新当前模式显示，不切换网络
async function handleRefreshClick() {
    const refreshBtn = document.getElementById('refresh-btn');
    const currentModeText = document.getElementById('current-mode');

    try {
        // 添加旋转动画
        if (refreshBtn) refreshBtn.classList.add('spinning');
        updateStatus('正在检测网络连通性...', 'info');

        console.log('[前端] 开始 ping baidu.com...');

        // 调用主进程 ping baidu.com
        const canPingBaidu = await window.networkAPI.checkNetworkConnectivity();

        console.log('[前端] ping baidu.com 结果:', canPingBaidu);

        // 只更新当前模式显示，不实际切换网络
        if (canPingBaidu) {
            // 能 ping 通，显示外网模式
            if (currentModeText) {
                currentModeText.textContent = '外网模式';
            }
            updateStatus('检测到外网连通', 'success');
        } else {
            // ping 不通，显示双网模式
            if (currentModeText) {
                currentModeText.textContent = '双网模式';
            }
            updateStatus('外网不通', 'warning');
        }

    } catch (error) {
        console.error('[前端] 刷新操作失败:', error);
        showNotification('刷新失败: ' + error.message, 'error');
    } finally {
        // 移除旋转动画
        if (refreshBtn) refreshBtn.classList.remove('spinning');
    }
}

// 启用外网模式
async function stopLink() {
    console.log('[前端] 启用外网按钮被点击');
    disableAllButtons(true);

    try {
        updateStatus('正在设置外网模式...', 'info');
        console.log('[前端] 调用 switchToWaiwang API');

        const result = await window.networkAPI.switchToWaiwang();
        console.log('[前端] switchToWaiwang 返回结果:', result);

        if (result.success) {
            showNotification(result.message, 'success');
            updateActionCards('external');
            // 更新当前模式文字
            const currentModeText = document.getElementById('current-mode');
            if (currentModeText) currentModeText.textContent = '外网模式';
            // 延迟后恢复按钮，不再调用loadInterfaces来避免重置选中状态
            setTimeout(() => {
                disableAllButtons(false);
            }, 1500);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('[前端] 外网模式设置失败:', error);
        showNotification(`操作失败: ${error.message}`, 'error');
        disableAllButtons(false);
    }
}

// 内网优先（启用内网，保持外网启用，内网优先级高）
async function startLink() {
    console.log('[前端] 内网优先按钮被点击');
    disableAllButtons(true);
    
    try {
        updateStatus('正在设置内网优先...', 'info');
        console.log('[前端] 调用 switchToNeiwang API');
        
        const result = await window.networkAPI.switchToNeiwang();
        console.log('[前端] switchToNeiwang 返回结果:', result);
        
        if (result.success) {
            showNotification(result.message, 'success');
            setTimeout(() => {
                loadInterfaces();
            }, 1500);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('[前端] 内网优先设置失败:', error);
        showNotification(`操作失败: ${error.message}`, 'error');
        disableAllButtons(false);
    }
}

// 同时启用模式（双网模式）
async function smartNetworkManagement() {
    console.log('[前端] 同时启用按钮被点击');
    disableAllButtons(true);

    try {
        updateStatus('正在设置双网模式...', 'info');
        console.log('[前端] 调用 smartNetworkManagement API');

        const result = await window.networkAPI.smartNetworkManagement();
        console.log('[前端] smartNetworkManagement 返回结果:', result);

        if (result.success) {
            showNotification(result.message, 'success');
            updateActionCards('both');
            // 更新当前模式文字
            const currentModeText = document.getElementById('current-mode');
            if (currentModeText) currentModeText.textContent = '双网模式';
            // 延迟后恢复按钮，不再调用loadInterfaces来避免重置选中状态
            setTimeout(() => {
                disableAllButtons(false);
            }, 1500);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('[前端] 双网模式设置失败:', error);
        showNotification(`操作失败: ${error.message}`, 'error');
        disableAllButtons(false);
    }
}

// 检查管理员权限
async function checkAdminPrivileges() {
    try {
        const isAdmin = await window.networkAPI.checkAdmin();
        if (!isAdmin && adminWarning) {
            adminWarning.style.display = 'block';
        }
    } catch (error) {
        console.error('检查管理员权限失败:', error);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    console.log('[前端] DOM 加载完成，初始化应用');
    
    // 获取 DOM 元素
    // 注意：按钮事件通过 HTML 内联的 onclick 绑定
    // 这里只获取需要动态更新的元素
    statusText = document.getElementById('status-text');
    adminWarning = document.getElementById('admin-warning');
    shareButton = document.getElementById('btn-share');
    shareOverlay = document.getElementById('share-overlay');
    
    // 模式切换按钮通过 HTML onclick 绑定，无需在这里绑定
    // 刷新按钮也在状态卡片中，通过 HTML onclick 绑定

    // 分享覆盖文字：点击右上角按钮只保留背景与文字
    if (shareButton && shareOverlay) {
        shareButton.addEventListener('click', (e) => {
            e.preventDefault();
            // 隐藏主界面，仅显示一段文字
            if (mainApp) mainApp.style.display = 'none';
            if (activationScreen) activationScreen.style.display = 'none';
            shareOverlay.style.display = 'flex';
        });
        // 点击覆盖层恢复主界面
        shareOverlay.addEventListener('click', () => {
            shareOverlay.style.display = 'none';
            if (activationScreen && (!mainApp || mainApp.style.display === 'none')) {
                // 若未激活则显示激活界面
                const status = window.networkAPI ? null : null;
            }
            if (mainApp) mainApp.style.display = 'flex';
        });
        // Esc 关闭
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape' && shareOverlay && shareOverlay.style.display !== 'none') {
                shareOverlay.style.display = 'none';
                if (mainApp) mainApp.style.display = 'flex';
            }
        });
    }
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', (event) => {
        // 禁用Alt键菜单
        if (event.altKey) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        
        // Ctrl+Shift+R 强制刷新网络接口
        if (event.ctrlKey && event.shiftKey && event.key === 'R') {
            event.preventDefault();
            console.log('[前端] 快捷键触发强制刷新网络接口');
            loadInterfaces();
        }
        // F5 普通刷新接口列表
        else if (event.key === 'F5') {
            event.preventDefault();
            loadInterfaces();
        }
    });
    
    // 初始化激活界面
    initActivationScreen();

    // 检查激活状态并初始化
    checkActivationAndInit();

    // 绑定操作卡片点击事件
    const cardExternal = document.getElementById('card-external');
    const cardBoth = document.getElementById('card-both');

    if (cardExternal) {
        cardExternal.addEventListener('click', stopLink);
    }
    if (cardBoth) {
        cardBoth.addEventListener('click', smartNetworkManagement);
    }

    // 绑定刷新按钮点击事件
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefreshClick);
    }
});

// 激活相关函数

// 格式化激活码输入
function formatActivationCode(input) {
    let value = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // 限制长度为16位
    if (value.length > 16) {
        value = value.substring(0, 16);
    }
    
    // 添加连字符
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formatted += '-';
        }
        formatted += value[i];
    }
    
    input.value = formatted;
    
    // 添加格式化样式
    if (formatted.length > 0) {
        input.classList.add('formatted');
    } else {
        input.classList.remove('formatted');
    }
}

// 显示激活消息
function showActivationMessage(message, type = 'info') {
    if (!activationMessage) return;
    
    activationMessage.textContent = message;
    activationMessage.className = `activation-message ${type}`;
    activationMessage.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        activationMessage.style.display = 'none';
    }, 3000);
}

// 激活应用
async function activateApp() {
    if (!activationCodeInput || !activateButton) return;
    
    const activationCode = activationCodeInput.value.trim();
    
    if (!activationCode) {
        showActivationMessage('请输入激活码', 'error');
        return;
    }
    
    // 禁用按钮
    activateButton.disabled = true;
    activateButton.textContent = '激活中...';
    
    try {
        const result = await window.networkAPI.activateApp(activationCode);
        
        if (result.success) {
            showActivationMessage('激活成功！正在启动应用...', 'success');
            // 激活成功，切换到主应用界面并初始化
            setTimeout(() => {
                showMainApp();
                checkAdminPrivileges();
                // 初始化网络状态（根据实际网络状态设置选中状态）
                initNetworkState();
            }, 1000); // 延迟1秒让用户看到成功消息
        } else {
            showActivationMessage(result.error || '激活失败', 'error');
        }
    } catch (error) {
        console.error('激活失败:', error);
        showActivationMessage('激活失败: ' + error.message, 'error');
    } finally {
        // 恢复按钮状态
        activateButton.disabled = false;
        activateButton.textContent = '激活许可证';
    }
}

// 初始化激活界面
function initActivationScreen() {
    console.log('[前端] 开始初始化激活界面...');
    
    activationScreen = document.getElementById('activation-screen');
    mainApp = document.getElementById('main-app');
    activationCodeInput = document.getElementById('activation-code-input');
    activateButton = document.getElementById('activate-button');
    activationMessage = document.getElementById('activation-message');
    
    console.log('[前端] 元素查找结果:');
    console.log('  activationScreen:', !!activationScreen);
    console.log('  mainApp:', !!mainApp);
    console.log('  activationCodeInput:', !!activationCodeInput);
    console.log('  activateButton:', !!activateButton);
    console.log('  activationMessage:', !!activationMessage);
    
    if (!activationScreen || !mainApp || !activationCodeInput || !activateButton) {
        console.error('[前端] 激活界面元素未找到');
        console.error('缺少的元素:');
        if (!activationScreen) console.error('  - activation-screen');
        if (!mainApp) console.error('  - main-app');
        if (!activationCodeInput) console.error('  - activation-code-input');
        if (!activateButton) console.error('  - activate-button');
        return;
    }
    
    // 绑定激活码输入事件
    activationCodeInput.addEventListener('input', () => {
        formatActivationCode(activationCodeInput);
    });
    
    // 绑定激活按钮事件
    activateButton.addEventListener('click', activateApp);
    
    // 绑定回车键激活
    activationCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            activateApp();
        }
    });
    
    console.log('[前端] 激活界面初始化完成');
}

// 检查激活状态并初始化
async function checkActivationAndInit() {
    try {
        const result = await window.networkAPI.checkActivationStatus();
        if (result.success && result.data.activated) {
            // 已激活，初始化主应用
            console.log('[前端] 应用已激活，显示主应用');
            showMainApp();
            checkAdminPrivileges();
            // 初始化网络状态（根据实际网络状态设置选中状态）
            initNetworkState();
        } else {
            // 未激活，显示激活界面
            console.log('[前端] 应用未激活，显示激活界面');
            showActivationScreen();
        }
    } catch (error) {
        console.error('[前端] 检查激活状态失败:', error);
        // 如果检查失败，默认显示激活界面
        showActivationScreen();
    }
}

// 显示激活界面
function showActivationScreen() {
    console.log('[前端] 尝试显示激活界面...');
    console.log('activationScreen:', activationScreen);
    console.log('mainApp:', mainApp);
    
    if (activationScreen && mainApp) {
        activationScreen.style.display = 'flex';
        mainApp.style.display = 'none';
        console.log('[前端] 激活界面已显示');
        console.log('激活界面显示状态:', activationScreen.style.display);
        console.log('主应用显示状态:', mainApp.style.display);
    } else {
        console.error('[前端] 无法显示激活界面：元素未找到');
        console.log('activationScreen存在:', !!activationScreen);
        console.log('mainApp存在:', !!mainApp);
    }
}

// 显示主应用
function showMainApp() {
    if (activationScreen && mainApp) {
        activationScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        console.log('[前端] 主应用已显示');
    }
}