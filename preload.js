const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('networkAPI', {
  // 获取网络接口列表
  getInterfaces: () => ipcRenderer.invoke('get-interfaces'),
  
  // 禁用接口
  disableInterface: (interfaceName) => ipcRenderer.invoke('disable-interface', interfaceName),
  
  // 启用接口
  enableInterface: (interfaceName) => ipcRenderer.invoke('enable-interface', interfaceName),
  
  // 切换到外网（原批处理的"stop link"功能）
  switchToWaiwang: () => ipcRenderer.invoke('switch-to-waiwang'),
  
  // 切换到内网（原批处理的"start link"功能）
  switchToNeiwang: () => ipcRenderer.invoke('switch-to-neiwang'),
  
  // 检查管理员权限
  checkAdmin: () => ipcRenderer.invoke('check-admin'),
  
  // 智能网络管理
  smartNetworkManagement: () => ipcRenderer.invoke('smart-network-management'),
  
  // 检查网络连通性
  checkNetworkConnectivity: () => ipcRenderer.invoke('check-network-connectivity'),
  
  // 激活相关API
  checkActivationStatus: () => ipcRenderer.invoke('check-activation-status'),
  activateApp: (activationCode) => ipcRenderer.invoke('activate-app', activationCode),
  validateActivationCode: (code) => ipcRenderer.invoke('validate-activation-code', code),
  resetActivation: () => ipcRenderer.invoke('reset-activation'),
  
  // 适配器配置相关API
  checkAdapterConfig: () => ipcRenderer.invoke('check-adapter-config'),
  configureAdapters: (neiwangAdapter, waiwangAdapter) => ipcRenderer.invoke('configure-adapters', neiwangAdapter, waiwangAdapter),
  getAdapterConfig: () => ipcRenderer.invoke('get-adapter-config')
});

// 窗口控制API - 暴露为独立对象
contextBridge.exposeInMainWorld('windowControl', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close')
});

// 网络模式变化监听API
contextBridge.exposeInMainWorld('networkModeListener', {
  onModeChanged: (callback) => {
    ipcRenderer.on('network-mode-changed', (event, mode) => callback(mode));
  },
  removeListener: () => {
    ipcRenderer.removeAllListeners('network-mode-changed');
  },
  onWindowShow: (callback) => {
    // 先移除旧的监听器，避免重复添加
    ipcRenderer.removeAllListeners('window-show');
    ipcRenderer.on('window-show', () => callback());
  }
});

