// 渲染进程脚本
let currentInterfaces = [];

// DOM元素（在 DOMContentLoaded 后初始化）
let btnStopLink;
let btnStartLink;
let btnSmartNetwork;
let btnRefresh;
let interfaceList;
let statusText;
let adminWarning;

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
        if (!interfaceList) {
            return;
        }
        
        interfaceList.innerHTML = '<div class="loading">加载中...</div>';
        updateStatus('正在加载网络接口...', 'info');
        
        const result = await window.networkAPI.getInterfaces();
        
        if (result.success) {
            currentInterfaces = result.data;
            renderInterfaces(currentInterfaces);
            updateStatus(`已加载 ${currentInterfaces.length} 个网络接口`, 'success');
            
            // 检查网络连通性并显示指示器
            await checkConnectivityAndShowIndicator();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        interfaceList.innerHTML = `<div class="loading" style="color: #dc3545;">加载失败: ${error.message}</div>`;
        updateStatus(`加载失败: ${error.message}`, 'error');
    }
}

// 检查网络连通性并显示指示器
async function checkConnectivityAndShowIndicator() {
    try {
        console.log('[前端] 检查网络连通性...');
        updateStatus('正在检查网络模式...', 'info');
        
        // 调用后端检查连通性
        const isConnected = await window.networkAPI.checkNetworkConnectivity();
        console.log('[前端] 网络连通性检查结果:', isConnected);
        
        // 清除所有按钮的指示器（不再显示绿色横标）
        if (btnStopLink) btnStopLink.classList.remove('active-indicator');
        if (btnSmartNetwork) btnSmartNetwork.classList.remove('active-indicator');
        
        // 不再根据连通性结果添加任何视觉指示，仅更新状态栏提示
        updateStatus(`网络模式 (${isConnected ? '启用外网' : '同时启用'})`, 'success');
        
    } catch (error) {
        console.error('[前端] 网络连通性检查失败:', error);
        updateStatus('网络模式检查失败', 'warning');
    }
}

// 渲染网络接口列表
function renderInterfaces(interfaces) {
    if (interfaces.length === 0) {
        interfaceList.innerHTML = '<div class="loading">未找到网络接口</div>';
        return;
    }
    
    interfaceList.innerHTML = '';
    
    interfaces.forEach(iface => {
        const item = document.createElement('div');
        item.className = 'interface-item';
        
        const statusClass = iface.status === 'enabled' ? 'status-enabled' : 'status-disabled';
        const stateClass = iface.state === 'connected' ? 'status-connected' : 'status-disconnected';
        const statusText = iface.status === 'enabled' ? '已启用' : '已禁用';
        const stateText = iface.state === 'connected' ? '已连接' : '未连接';
        
        // 构建连接状态显示文本
        let connectionDisplay = stateText;
        if (iface.state === 'connected' && iface.networkName) {
            connectionDisplay = `${stateText} ${iface.networkName}`;
        }
        
        // 根据连接状态生成信号强度图标
        let signalIcon = '';
        if (iface.state === 'connected') {
            signalIcon = `
                <div class="signal-strength">
                    <div class="signal-bar signal-bar-1"></div>
                    <div class="signal-bar signal-bar-2"></div>
                    <div class="signal-bar signal-bar-3"></div>
                </div>
            `;
        } else {
            signalIcon = `
                <div class="signal-strength signal-disconnected">
                    <div class="signal-bar signal-bar-1"></div>
                    <div class="signal-bar signal-bar-2"></div>
                    <div class="signal-bar signal-bar-3"></div>
                </div>
            `;
        }
        
        item.innerHTML = `
            <div class="interface-info">
                <div class="interface-name">${iface.name}</div>
                <div class="interface-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <span class="status-badge ${stateClass}">${connectionDisplay}</span>
                </div>
            </div>
            <div class="interface-controls">
                ${signalIcon}
            </div>
        `;
        
        interfaceList.appendChild(item);
    });
    
    // 信号强度图标不需要事件绑定
    
}

// 接口控制功能已移除，现在只显示信号强度图标

// 禁用/启用所有按钮
function disableAllButtons(disabled) {
    // 禁用快速切换按钮
    if (btnStopLink) btnStopLink.disabled = disabled;
    if (btnSmartNetwork) btnSmartNetwork.disabled = disabled;
    
    // 禁用刷新按钮（在执行网络操作时）
    if (btnRefresh) btnRefresh.disabled = disabled;
    
    // 信号强度图标不需要禁用/启用
    
    // 如果是启用，需要根据接口状态重新设置
    if (!disabled) {
        loadInterfaces();
    }
}

// 外网优先（启用外网，保持内网启用，外网优先级高）
async function stopLink() {
    console.log('[前端] 外网优先按钮被点击');
    disableAllButtons(true);
    
    try {
        updateStatus('正在设置外网优先...', 'info');
        console.log('[前端] 调用 switchToWaiwang API');
        
        const result = await window.networkAPI.switchToWaiwang();
        console.log('[前端] switchToWaiwang 返回结果:', result);
        
        if (result.success) {
            showNotification(result.message, 'success');
            setTimeout(() => {
                loadInterfaces();
                disableAllButtons(false); // 恢复按钮状态
            }, 1500);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('[前端] 外网优先设置失败:', error);
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

// 智能网络管理（外网优先，内网备用）
async function smartNetworkManagement() {
    console.log('[前端] 智能网络管理按钮被点击');
    disableAllButtons(true);
    
    try {
        updateStatus('正在执行智能网络管理...', 'info');
        console.log('[前端] 调用 smartNetworkManagement API');
        
        const result = await window.networkAPI.smartNetworkManagement();
        console.log('[前端] smartNetworkManagement 返回结果:', result);
        
        if (result.success) {
            showNotification(result.message, 'success');
            setTimeout(() => {
                loadInterfaces();
                disableAllButtons(false); // 恢复按钮状态
            }, 1500);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('[前端] 智能网络管理失败:', error);
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
    btnStopLink = document.getElementById('btn-stop-link');
    // btnStartLink = document.getElementById('btn-start-link'); // 已移除
    btnSmartNetwork = document.getElementById('btn-smart-network');
    btnRefresh = document.getElementById('btn-refresh');
    interfaceList = document.getElementById('interface-list');
    statusText = document.getElementById('status-text');
    adminWarning = document.getElementById('admin-warning');
    
    // 确保 DOM 元素已加载后再绑定事件监听
    if (btnStopLink) {
        console.log('[前端] 绑定外网优先按钮事件');
        btnStopLink.addEventListener('click', stopLink);
    } else {
        console.error('[前端] 未找到外网优先按钮元素');
    }
    
    // 内网优先按钮已移除
    // if (btnStartLink) {
    //     console.log('[前端] 绑定内网优先按钮事件');
    //     btnStartLink.addEventListener('click', startLink);
    // } else {
    //     console.error('[前端] 未找到内网优先按钮元素');
    // }
    
    if (btnSmartNetwork) {
        console.log('[前端] 绑定同时启用按钮事件');
        btnSmartNetwork.addEventListener('click', smartNetworkManagement);
    } else {
        console.error('[前端] 未找到同时启用按钮元素');
    }
    
    if (btnRefresh) {
        console.log('[前端] 绑定刷新按钮事件');
        // 确保刷新按钮始终启用
        btnRefresh.disabled = false;
        
        // 绑定点击事件 - 刷新网络接口
        btnRefresh.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // 只刷新网络接口，不重新加载页面
            console.log('[前端] 刷新网络接口');
            loadInterfaces();
        });
        
        // 也绑定 mousedown 事件作为备份
        btnRefresh.addEventListener('mousedown', (e) => {
            // 备用事件处理
        });
    } else {
        console.error('[前端] 未找到刷新按钮元素');
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
                loadInterfaces();
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
            loadInterfaces();
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

