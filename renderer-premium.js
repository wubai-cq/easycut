/* ============================================
   EasyCut Premium - 交互脚本
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const modeCards = document.querySelectorAll('.mode-card');
    const statusCard = document.getElementById('status-card');
    const currentModeDisplay = document.getElementById('current-mode');
    const interfacesList = document.getElementById('interfaces-list');
    const refreshBtn = document.getElementById('refresh-interfaces');

    // 当前活跃模式
    let currentMode = 'both';

    // ============================================
    // 网络模式切换
    // ============================================

    modeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const mode = this.dataset.mode;
            
            // 移除所有卡片的活跃状态
            modeCards.forEach(c => {
                c.classList.remove('active');
            });
            
            // 添加当前卡片的活跃状态
            this.classList.add('active');
            
            // 更新当前模式
            currentMode = mode;
            updateStatusDisplay(mode);
            
            // 触发模式切换动画
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // 调用后端API切换模式
            switchNetworkMode(mode);
        });

        // 悬停效果增强
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ============================================
    // 更新状态显示
    // ============================================

    function updateStatusDisplay(mode) {
        let modeText = '';
        
        switch(mode) {
            case 'external':
                modeText = '启用外网';
                break;
            case 'internal':
                modeText = '启用内网';
                break;
            case 'both':
                modeText = '同时启用';
                break;
        }
        
        currentModeDisplay.textContent = modeText;
        
        // 状态卡片闪烁效果
        statusCard.style.opacity = '0.8';
        setTimeout(() => {
            statusCard.style.opacity = '1';
        }, 200);
    }

    // ============================================
    // 网络模式切换API调用
    // ============================================

    async function switchNetworkMode(mode) {
        try {
            // 发送到Electron主进程
            if (window.api && window.api.switchNetworkMode) {
                const result = await window.api.switchNetworkMode(mode);
                console.log('网络模式切换结果:', result);
            } else {
                console.log('切换模式:', mode);
            }
        } catch (error) {
            console.error('模式切换失败:', error);
            // 恢复之前的模式
            showErrorNotification('网络模式切换失败，请重试');
        }
    }

    // ============================================
    // 刷新接口列表
    // ============================================

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.animation = 'spin 0.6s linear';
            
            // 模拟刷新延迟
            setTimeout(() => {
                this.style.animation = '';
                loadInterfacesList();
            }, 600);
        });
    }

    async function loadInterfacesList() {
        try {
            if (window.api && window.api.getNetworkInterfaces) {
                const interfaces = await window.api.getNetworkInterfaces();
                renderInterfaces(interfaces);
            }
        } catch (error) {
            console.error('获取网络接口失败:', error);
        }
    }

    function renderInterfaces(interfaces) {
        // 清空列表
        interfacesList.innerHTML = '';
        
        interfaces.forEach(iface => {
            const item = createInterfaceItem(iface);
            interfacesList.appendChild(item);
        });
    }

    function createInterfaceItem(iface) {
        const item = document.createElement('div');
        item.className = 'interface-item';
        
        if (iface.active) {
            item.classList.add('interface-item-active');
        }
        
        const statusText = iface.active ? '已连接' : '已禁用';
        const signalWidth = iface.active ? iface.signal : 0;
        const btnClass = iface.active ? 'btn-disable' : 'btn-enable';
        const btnText = iface.active ? '禁用' : '启用';
        
        item.innerHTML = `
            <div class="interface-header">
                <div class="interface-icon">${iface.icon || '🔌'}</div>
                <div class="interface-info">
                    <div class="interface-name">${iface.name}</div>
                    <div class="interface-status">${statusText}${iface.signal ? ' • 信号强度: ' + iface.signal + '%' : ''}</div>
                </div>
            </div>
            <div class="interface-signal">
                <div class="signal-bar" style="width: ${signalWidth}%;"></div>
            </div>
            <button class="btn-status-toggle ${btnClass}" data-interface="${iface.id}">
                ${btnText}
            </button>
        `;
        
        // 添加按钮事件
        const btn = item.querySelector('.btn-status-toggle');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleInterface(iface.id, iface.active);
        });
        
        return item;
    }

    async function toggleInterface(interfaceId, currentState) {
        try {
            if (window.api && window.api.toggleInterface) {
                const result = await window.api.toggleInterface(interfaceId, !currentState);
                console.log('接口状态切换:', result);
                loadInterfacesList(); // 重新加载列表
            }
        } catch (error) {
            console.error('接口切换失败:', error);
            showErrorNotification('接口切换失败，请重试');
        }
    }

    // ============================================
    // 通知提示
    // ============================================

    function showErrorNotification(message) {
        // 可以集成toast通知库
        console.error('⚠️', message);
    }

    // ============================================
    // 初始化
    // ============================================

    // 设置初始状态
    modeCards.forEach(card => {
        if (card.dataset.mode === currentMode) {
            card.classList.add('active');
        }
    });

    // 初始化状态显示
    updateStatusDisplay(currentMode);

    // 初始加载接口列表（如果需要）
    // loadInterfacesList();

    // ============================================
    // 快捷键支持
    // ============================================

    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    triggerModeCard('external');
                    break;
                case '2':
                    triggerModeCard('internal');
                    break;
                case '3':
                    triggerModeCard('both');
                    break;
            }
        }
    });

    function triggerModeCard(mode) {
        const card = document.querySelector(`[data-mode="${mode}"]`);
        if (card) {
            card.click();
        }
    }

    // ============================================
    // 平滑过渡
    // ============================================

    // 为页面加入加载完成的动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
    }, 100);

    // ============================================
    // 与Electron的通信
    // ============================================

    // 监听来自主进程的消息
    if (window.api && window.api.onNetworkModeChanged) {
        window.api.onNetworkModeChanged((newMode) => {
            console.log('网络模式已改变:', newMode);
            currentMode = newMode;
            
            modeCards.forEach(card => {
                if (card.dataset.mode === newMode) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            updateStatusDisplay(newMode);
        });
    }

    // ============================================
    // 页面可见性处理
    // ============================================

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('应用已最小化');
        } else {
            console.log('应用已恢复');
            // 可以在这里刷新数据
        }
    });

    console.log('EasyCut Premium UI 已加载 ✓');
});
