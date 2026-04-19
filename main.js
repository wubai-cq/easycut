const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const util = require('util');
const iconv = require('iconv-lite');
const ActivationManager = require('./activation');

// 设置进程名称和应用元数据
process.title = 'EasyCut';

// 强制设置进程名称（Windows）
if (process.platform === 'win32') {
  // 设置应用用户模型ID
  app.setAppUserModelId('com.easycut.app');
  
  // 设置应用名称
  app.setName('EasyCut');
  
  // 设置应用版本信息
  app.setVersion('1.0.0');
  
  // 设置应用程序描述
  app.setAboutPanelOptions({
    applicationName: 'EasyCut',
    applicationVersion: '1.0.0',
    copyright: 'Copyright (C) 2025 wubai EasyCut',
    credits: 'EasyCut - 双网切换工具'
  });
  
  // 强制设置进程标题
  try {
    process.title = 'EasyCut';
    // 尝试设置进程名称
    if (process.setTitle) {
      process.setTitle('EasyCut');
    }
  } catch (error) {
    console.log('设置进程标题失败:', error);
  }
}

const execPromise = util.promisify(exec);

// 获取图标路径（兼容开发和打包环境）
function getIconPath() {
  if (app.isPackaged) {
    // 打包后：图标在 resources 目录下
    return path.join(process.resourcesPath, 'icon.ico');
  } else {
    // 开发模式：图标在项目根目录
    return path.join(__dirname, 'icon.ico');
  }
}

// 创建激活管理器实例
let activationManager = new ActivationManager();

// ==================== 网络适配器配置管理 ====================
const fs = require('fs');
const os = require('os');

// 配置文件路径
const configDir = path.join(os.homedir(), '.easycut');
const adapterConfigFile = path.join(configDir, 'adapter_config.json');

// 确保配置目录存在
function ensureConfigDir() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

// 读取适配器配置
function getAdapterConfig() {
  try {
    ensureConfigDir();
    if (fs.existsSync(adapterConfigFile)) {
      const data = fs.readFileSync(adapterConfigFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('读取适配器配置失败:', error.message);
  }
  return null;
}

// 保存适配器配置
function saveAdapterConfig(config) {
  try {
    ensureConfigDir();
    fs.writeFileSync(adapterConfigFile, JSON.stringify(config, null, 2), 'utf8');
    console.log('适配器配置已保存:', config);
    return true;
  } catch (error) {
    console.error('保存适配器配置失败:', error.message);
    return false;
  }
}

// 检查适配器是否已配置（检查配置文件）
function isAdapterConfigured() {
  const config = getAdapterConfig();
  if (!config) return false;
  
  // 检查配置中是否有有效的内网和外网适配器名称
  return config.neiwang && config.waiwang && 
         config.neiwang.trim() !== '' && config.waiwang.trim() !== '';
}

// 检查实际适配器名称是否正确（检查系统中是否存在 neiwang 和 waiwang）
async function checkActualAdapters() {
  try {
    const interfaces = await getNetworkInterfaces();
    
    // 查找名为 "neiwang" 的适配器
    const neiwangExists = interfaces.some(iface => 
      iface.name.toLowerCase() === 'neiwang'
    );
    
    // 查找名为 "waiwang" 的适配器
    const waiwangExists = interfaces.some(iface => 
      iface.name.toLowerCase() === 'waiwang'
    );
    
    console.log(`[适配器检查] neiwang: ${neiwangExists}, waiwang: ${waiwangExists}`);
    
    return {
      neiwangExists,
      waiwangExists,
      bothExist: neiwangExists && waiwangExists
    };
  } catch (error) {
    console.error('检查适配器失败:', error.message);
    return { neiwangExists: false, waiwangExists: false, bothExist: false };
  }
}

// 重命名网络适配器
async function renameAdapter(oldName, newName) {
  try {
    console.log(`正在重命名适配器: "${oldName}" -> "${newName}"`);
    
    // 使用 PowerShell 重命名适配器（使用单引号避免转义问题）
    // 注意：需要处理适配器名称中可能包含的单引号
    const escapedOldName = oldName.replace(/'/g, "''");
    const escapedNewName = newName.replace(/'/g, "''");
    
    const psCommand = `Get-NetAdapter -Name '${escapedOldName}' -ErrorAction SilentlyContinue | Rename-NetAdapter -NewName '${escapedNewName}' -ErrorAction Stop; if ($?) { Write-Output 'success' } else { Write-Output 'failed' }`;
    
    const result = await execPromise(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${psCommand}"`);
    
    if (result.stdout.includes('success')) {
      console.log(`适配器重命名成功: "${oldName}" -> "${newName}"`);
      return { success: true, message: `适配器已重命名为 "${newName}"` };
    } else {
      // 检查是否是找不到适配器
      if (result.stderr.includes('No matching') || result.stderr.includes('找不到')) {
        return { success: false, error: `未找到名为 "${oldName}" 的适配器` };
      }
      return { success: false, error: '重命名失败: ' + (result.stderr || result.stdout) };
    }
  } catch (error) {
    console.error('重命名适配器失败:', error.message);
    return { success: false, error: error.message };
  }
}

// 配置网络适配器（重命名并保存配置）
async function configureAdapters(neiwangAdapter, waiwangAdapter) {
  try {
    console.log('开始配置网络适配器...');
    console.log('内网适配器:', neiwangAdapter);
    console.log('外网适配器:', waiwangAdapter);
    
    // 验证输入
    if (!neiwangAdapter || !waiwangAdapter) {
      return { success: false, error: '请选择内网和外网适配器' };
    }
    
    if (neiwangAdapter === waiwangAdapter) {
      return { success: false, error: '内网和外网不能选择同一个适配器' };
    }
    
    // 重命名内网适配器
    const neiwangResult = await renameAdapter(neiwangAdapter, 'neiwang');
    if (!neiwangResult.success) {
      return { success: false, error: `内网适配器重命名失败: ${neiwangResult.error}` };
    }
    
    // 重命名外网适配器
    const waiwangResult = await renameAdapter(waiwangAdapter, 'waiwang');
    if (!waiwangResult.success) {
      // 如果外网重命名失败，尝试恢复内网名称
      await renameAdapter('neiwang', neiwangAdapter);
      return { success: false, error: `外网适配器重命名失败: ${waiwangResult.error}` };
    }
    
    // 保存配置
    saveAdapterConfig({
      neiwang: 'neiwang',
      waiwang: 'waiwang',
      originalNeiwang: neiwangAdapter,
      originalWaiwang: waiwangAdapter,
      configuredAt: new Date().toISOString()
    });
    
    return { success: true, message: '网络适配器配置成功！' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Windows 控制台默认使用 GBK 编码（代码页 936）
// Node.js 输出会自动转换为 GBK，无需设置 chcp

// 重写 console.log，确保中文正确输出到 Windows 控制台
if (process.platform === 'win32') {
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = function(...args) {
    const message = args.map(arg => {
      if (typeof arg === 'string') {
        return arg;
      }
      return util.inspect(arg, { depth: null, colors: false });
    }).join(' ');
    
    try {
      // 使用 iconv 转换为 GBK 编码输出到 CMD
      const buffer = iconv.encode(message + '\n', 'gbk');
      process.stdout.write(buffer);
    } catch (e) {
      // 如果转换失败，使用原始方法
      try {
        process.stdout.write(message + '\n');
      } catch (e2) {
        originalLog.apply(console, args);
      }
    }
  };
  
  console.error = function(...args) {
    const message = args.map(arg => {
      if (typeof arg === 'string') {
        return arg;
      }
      return util.inspect(arg, { depth: null, colors: false });
    }).join(' ');
    
    try {
      // 使用 iconv 转换为 GBK 编码输出到 
      const buffer = iconv.encode(message + '\n', 'gbk');
      process.stderr.write(buffer);
    } catch (e) {
      // 如果转换失败，使用原始方法
      try {
        process.stderr.write(message + '\n');
      } catch (e2) {
        originalError.apply(console, args);
      }
    }
  };
}

// 使用spawn执行netsh命令
function execNetsh(args) {
  return new Promise((resolve, reject) => {
    console.log('执行命令: netsh', args.join(' '));

    // 为了避免不同主机控制台代码页差异导致的乱码：
    // 通过  先切换到 UTF-8；随后优先按 UTF-8 解码
    const cmdLine = `chcp 65001>nul & netsh ${args.join(' ')}`;
    const child = spawn('cmd', ['/c', cmdLine], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'buffer'
    });

    let stdoutBuffer = Buffer.alloc(0);
    let stderrBuffer = Buffer.alloc(0);

    child.stdout.on('data', (data) => {
      stdoutBuffer = Buffer.concat([stdoutBuffer, data]);
    });

    child.stderr.on('data', (data) => {
      stderrBuffer = Buffer.concat([stderrBuffer, data]);
    });

    child.on('close', (code) => {
      // 优先按 UTF-8 解码；失败或出现大量替换符时再回退到 GBK
      let stdout = '';
      let stderr = '';

      try {
        stdout = stdoutBuffer.toString('utf8');
        stderr = stderrBuffer.toString('utf8');

        // 如果含有大量替换符（\uFFFD），说明编码不对，回退到 GBK
        const hasManyRepl = (s) => (s.match(/\uFFFD/g) || []).length > 3;
        if (hasManyRepl(stdout) || hasManyRepl(stderr)) {
          stdout = iconv.decode(stdoutBuffer, 'cp936');
          stderr = iconv.decode(stderrBuffer, 'cp936');
        }
      } catch (e) {
        console.warn('UTF-8 解码失败，回退 GBK:', e);
        try {
          stdout = iconv.decode(stdoutBuffer, 'cp936');
          stderr = iconv.decode(stderrBuffer, 'cp936');
        } catch (e2) {
          stdout = stdoutBuffer.toString('utf8');
          stderr = stderrBuffer.toString('utf8');
        }
      }

      console.log(`命令执行完成，退出码: ${code}`);
      if (stdout) {
        console.log('stdout长度:', stdout.length);
        console.log('stdout内容:');
        console.log(stdout);
      }
      if (stderr) {
        console.log('stderr:', stderr);
      }

      if (code === 0) {
        resolve({ stdout, stderr, code: 0 });
      } else {
        let errorMsg = stderr || stdout || '未知错误';
        if (errorMsg.includes('\uFFFD') || /[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/.test(errorMsg)) {
          errorMsg = '命令执行失败，可能是接口名称不存在或权限不足';
        }
        reject(new Error(`命令执行失败 (退出码 ${code}): ${errorMsg}`));
      }
    });

    child.on('error', (error) => {
      console.error('进程错误:', error);
      reject(error);
    });
  });
}

let mainWindow;
let tray = null;
let isQuitting = false;

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 710,
    resizable: false,
    maximizable: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    autoHideMenuBar: true,
    title: 'EasyCut',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: getIconPath()
  });

  // 完全禁用菜单栏和Alt键菜单
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setMenu(null);

  mainWindow.loadFile('index.html');
  
  // 强制设置任务栏图标（Windows）
  if (process.platform === 'win32') {
    mainWindow.once('ready-to-show', () => {
      mainWindow.setIcon(getIconPath());
    });
  }
  
  // 设置窗口标题
  mainWindow.setTitle('EasyCut');

  // 只在开发模式下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
  mainWindow.webContents.openDevTools();
  }

  // 等待页面加载完成后再检查激活状态
  mainWindow.webContents.once('did-finish-load', () => {
    console.log('[主进程] 页面加载完成，检查激活状态');
    // 延迟一点时间确保DOM完全渲染
    setTimeout(() => {
      checkActivationStatus();
    }, 100);
  });

  // 添加键盘快捷键支持
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Ctrl+Shift+R 或 Ctrl+R 或 F5 强制刷新
    if ((input.control && input.shift && input.key.toLowerCase() === 'r') ||
        (input.control && input.key.toLowerCase() === 'r') ||
        input.key === 'F5') {
      console.log('快捷键触发刷新');
      mainWindow.webContents.reloadIgnoringCache();
      event.preventDefault();
    }
  });

  mainWindow.on('close', (event) => {
    // 如果不是真正退出，则隐藏窗口
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 检查是否需要管理员权限并自动重启
if (process.platform === 'win32' && !app.isPackaged) {
  // 开发模式不强制要求管理员权限
  console.log('开发模式：跳过管理员权限检查');
}

// 设置应用名称
app.setName('EasyCut');
app.setAppUserModelId('com.easycut.app');

// 禁用Alt键菜单功能
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');

// 当  完成初始化时创建窗口
ipcMain.on('window-minimize', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) {
    win.minimize();
  }
});

ipcMain.on('window-close', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) {
    win.hide(); // 隐藏窗口而不是关闭
  }
});

// 真正退出应用
ipcMain.on('window-quit', () => {
  isQuitting = true;
  app.quit();
});

// 创建系统托盘
function createTray() {
  // 创建托盘图标
  const iconPath = getIconPath();
  const trayIcon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(trayIcon);
  tray.setToolTip('EasyCut - 网络切换工具');
  
  // 创建右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '启用外网',
      click: async () => {
        try {
          await switchToWaiwang();
          console.log('[托盘] 已切换到外网模式');
          // 通知渲染进程更新UI
          if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('network-mode-changed', 'external');
          }
        } catch (err) {
          console.error('[托盘] 切换外网失败:', err);
        }
      }
    },
    {
      label: '同时启用',
      click: async () => {
        try {
          await enableBothNetworks();
          console.log('[托盘] 已切换到双网模式');
          // 通知渲染进程更新UI
          if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('network-mode-changed', 'both');
          }
        } catch (err) {
          console.error('[托盘] 切换双网失败:', err);
        }
      }
    },
    { type: 'separator' },
    {
      label: '显示窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          // 通知渲染进程刷新状态
          mainWindow.webContents.send('window-show');
        }
      }
    },
    { type: 'separator' },
    {
      label: '退出应用',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  
  // 双击托盘图标显示窗口
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      // 通知渲染进程刷新状态
      mainWindow.webContents.send('window-show');
    }
  });
  
  // 单击也显示窗口（Windows习惯）
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      // 通知渲染进程刷新状态
      mainWindow.webContents.send('window-show');
    }
  });
}

app.whenReady().then(() => {
  // 检查管理员权限
  exec('net session', (error) => {
    if (error) {
      console.warn('警告：未以管理员身份运行，某些功能可能无法使用');
    } else {
      console.log('已确认管理员权限');
    }
  });
  
  // 创建系统托盘
  createTray();
  
  createWindow();
  
  // 不再自动启动网络监控
  // setTimeout(() => {
  //   startNetworkMonitor();
  // }, 5000);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 在退出前设置标志
app.on('before-quit', () => {
  isQuitting = true;
});

// 当所有窗口关闭时退出应用（除非是最小化到托盘）
app.on('window-all-closed', function () {
  stopNetworkMonitor();
  // 如果正在退出，才真正退出
  if (isQuitting || process.platform !== 'win32') {
    if (tray) tray.destroy();
    app.quit();
  }
});

// 检查是否以管理员身份运行
function isAdmin() {
  if (process.platform !== 'win32') return false;
  
  try {
    // 尝试执行需要管理员权限的命令
    exec('net session', (error) => {
      if (error) {
        return false;
      }
      return true;
    });
  } catch (e) {
    return false;
  }
  return true;
}



// 获取网络接口列表
async function getNetworkInterfaces() {
  try {
    // 使用execNetsh来正确处理编码
    const { stdout } = await execNetsh(['interface', 'show', 'interface']);
    
    const interfaces = [];
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      // 跳过空行和标题行
      if (line.trim() === '' || line.includes('---') || line.includes('管理员状态') || line.includes('Admin State')) {
        continue;
      }
      
      // 解析接口信息
      // netsh 输出格式：管理员状态  状态  类型  接口名称
      const parts = line.trim().split(/\s{2,}/); // 使用2个或更多空格分割
      
      if (parts.length >= 4) {
        const adminStatus = parts[0]; // 第一列：管理员状态（已启用/已禁用）
        const connState = parts[1];   // 第二列：连接状态（已连接/已断开连接）
        const name = parts[3];         // 第四列：接口名称
        
        // 判断管理员状态（启用/禁用）
        const status = (adminStatus.includes('已启用') || adminStatus.includes('Enabled')) ? 'enabled' : 'disabled';
        // 判断连接状态
        const state = (connState.includes('已连接') || connState.includes('Connected')) ? 'connected' : 'disconnected';
        
        if (name && name.length > 0 && !name.includes('---')) {
          // 过滤掉 VMware 相关的虚拟网络接口
          const vmwareKeywords = [
            'vmware', 'vmnet', 'virtualbox', 'hyper-v', 'vbox', 
            'microsoft wi-fi direct', 'microsoft hosted network',
            'loopback', 'tunnel', 'teredo', 'isatap'
          ];
          
          const isVirtualInterface = vmwareKeywords.some(keyword => 
            name.toLowerCase().includes(keyword.toLowerCase())
          );
          
          // 只显示物理网络接口，过滤掉虚拟接口
          if (!isVirtualInterface) {
            // 根据接口名称推断网络类型
            let networkName = '';
            if (state === 'connected') {
              if (name.toLowerCase().includes('waiwang') || 
                  name.toLowerCase().includes('wifi') || 
                  name.toLowerCase().includes('wireless') ||
                  name.toLowerCase().includes('wi-fi')) {
                networkName = '外网';
              } else if (name.toLowerCase().includes('neiwang') || 
                         name.toLowerCase().includes('ethernet') ||
                         name.toLowerCase().includes('lan')) {
                networkName = '内网';
              } else {
                networkName = '已连接';
              }
            }
            
            interfaces.push({
              name: name,
              status: status,
              state: state,
              networkName: networkName
            });
          }
        }
      }
    }
    
    return interfaces;
  } catch (error) {
    console.error('获取网络接口失败:', error);
    throw error;
  }
}

// 禁用网络接口
async function disableInterface(interfaceName) {
  try {
    const args = ['interface', 'set', 'interface', interfaceName, 'admin=DISABLED'];
    await execNetsh(args);
    return { success: true, message: `接口 ${interfaceName} 已禁用` };
  } catch (error) {
    // 提供更友好的错误信息
    let errorMsg = error.message;
    if (errorMsg.includes('�') || errorMsg.includes('锘')) {
      // 如果错误信息包含乱码，提供通用错误信息
      errorMsg = `无法禁用接口 "${interfaceName}"。请确认接口名称正确，并以管理员身份运行程序。`;
    }
    throw new Error(errorMsg);
  }
}

// 启用网络接口
async function enableInterface(interfaceName) {
  try {
    const args = ['interface', 'set', 'interface', interfaceName, 'admin=ENABLED'];
    await execNetsh(args);
    return { success: true, message: `接口 ${interfaceName} 已启用` };
  } catch (error) {
    // 提供更友好的错误信息
    let errorMsg = error.message;
    if (errorMsg.includes('�') || errorMsg.includes('锘')) {
      // 如果错误信息包含乱码，提供通用错误信息
      errorMsg = `无法启用接口 "${interfaceName}"。请确认接口名称正确，并以管理员身份运行程序。`;
    }
    throw new Error(errorMsg);
  }
}

// 设置网络接口优先级和自动跃点数
async function setInterfacePriority(interfaceName, priority) {
  try {
    // 方法1：设置接口跃点数
    const args = ['interface', 'ipv4', 'set', 'interface', interfaceName, `metric=${priority}`];
    await execNetsh(args);
    
    // 方法2：禁用自动跃点数（设置为手动）
    // 这可以防止Windows自动调整网络优先级
    try {
      const disableAutoMetricArgs = ['interface', 'ipv4', 'set', 'interface', interfaceName, 'metric=auto'];
      // 如果需要手动跃点数，不使用auto
      // await execNetsh(disableAutoMetricArgs);
    } catch (err) {
      console.warn('设置自动跃点数失败:', err.message);
    }
    
    return { success: true, message: `接口 ${interfaceName} 优先级已设置为 ${priority}` };
  } catch (error) {
    throw new Error(`设置接口优先级失败: ${error.message}`);
  }
}

// 获取网络接口的当前优先级
async function getInterfacePriority(interfaceName) {
  try {
    const args = ['interface', 'ipv4', 'show', 'interface', interfaceName];
    const result = await execNetsh(args);
    
    // 解析输出中的跃点数
    const lines = result.stdout.split('\n');
    for (const line of lines) {
      if (line.includes('跃点数') || line.includes('Metric')) {
        const match = line.match(/(\d+)/);
        if (match) {
          return parseInt(match[1]);
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// 通过PowerShell和注册表彻底禁用网络适配器的自动禁用功能
async function disableAdapterAutoDisable(interfaceName) {
  try {
    console.log(`[关键] 禁用接口 ${interfaceName} 的自动禁用功能`);
    
    // PowerShell命令：设置网络适配器为始终启用
    // 这是防止Windows自动禁用网络的核心功能
    const psCommand = `
      # 获取网络适配器
      $adapter = Get-NetAdapter | Where-Object {$_.Name -eq '${interfaceName}'}
      if (!$adapter) {
        Write-Output "Adapter not found: ${interfaceName}"
        exit 1
      }
      
      $adapterGuid = $adapter.InterfaceGuid
      Write-Output "找到适配器: ${interfaceName}, GUID: $adapterGuid"
      
      # 方法1: 禁用节能功能
      try {
        $adapter | Set-NetAdapterAdvancedProperty -DisplayName "Energy Efficient Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
        Write-Output "已禁用节能以太网"
      } catch {
        Write-Output "节能以太网设置失败（可能不支持）"
      }
      
      # 方法2: 禁用电源管理（最关键！）
      $regPath = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002BE10318}"
      $found = $false
      Get-ChildItem $regPath -ErrorAction SilentlyContinue | ForEach-Object {
        $path = $_.PSPath
        $netCfgInstanceId = (Get-ItemProperty -Path $path -Name NetCfgInstanceId -ErrorAction SilentlyContinue).NetCfgInstanceId
        if ($netCfgInstanceId -eq $adapterGuid) {
          Write-Output "找到注册表路径: $path"
          
          # PnPCapabilities = 24 表示禁用电源管理
          Set-ItemProperty -Path $path -Name PnPCapabilities -Value 24 -Type DWord -ErrorAction SilentlyContinue
          Write-Output "已设置PnPCapabilities=24"
          
          # 禁用WOL (Wake on LAN) 相关的电源管理
          Set-ItemProperty -Path $path -Name "*WakeOnMagicPacket" -Value 0 -ErrorAction SilentlyContinue
          Set-ItemProperty -Path $path -Name "*WakeOnPattern" -Value 0 -ErrorAction SilentlyContinue
          
          $found = $true
        }
      }
      
      if (!$found) {
        Write-Output "警告: 未找到对应的注册表项"
      }
      
      # 方法3: 禁用Windows网络位置感知服务的自动管理
      # 设置网络为专用网络，防止被标记为"公用"而被禁用
      try {
        $profile = Get-NetConnectionProfile -InterfaceAlias '${interfaceName}' -ErrorAction SilentlyContinue
        if ($profile) {
          Set-NetConnectionProfile -InterfaceAlias '${interfaceName}' -NetworkCategory Private -ErrorAction SilentlyContinue
          Write-Output "已设置为专用网络"
        }
      } catch {
        Write-Output "网络类别设置失败（可能未连接）"
      }
      
      # 方法4: 禁用自动跃点数（强制使用手动设置的跃点数）
      try {
        Set-NetIPInterface -InterfaceAlias '${interfaceName}' -AutomaticMetric Disabled -ErrorAction SilentlyContinue
        Write-Output "已禁用自动跃点数"
      } catch {
        Write-Output "自动跃点数设置失败"
      }
      
      Write-Output "Success: 配置完成"
    `;
    
    return new Promise((resolve, reject) => {
      const child = spawn('powershell.exe', [
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-Command', psCommand
      ], {
        windowsHide: true
      });
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0 && output.includes('Success')) {
          console.log(`接口 ${interfaceName} 自动禁用功能已关闭`);
          resolve({ success: true });
        } else {
          console.warn(`关闭自动禁用功能失败: ${errorOutput || output}`);
          // 不抛出错误，因为这不是关键功能
          resolve({ success: false, warning: true });
        }
      });
      
      child.on('error', (error) => {
        console.warn(`PowerShell执行失败:`, error);
        resolve({ success: false, warning: true });
      });
    });
  } catch (error) {
    console.error(`禁用接口自动禁用功能失败:`, error);
    return { success: false, warning: true };
  }
}

// 设置网络接口为持久启用（防止被Windows自动禁用）
async function setInterfacePersistent(interfaceName) {
  try {
    console.log(`设置接口 ${interfaceName} 为持久启用`);
    
    // 1. 启用接口
    await enableInterface(interfaceName);
    
    // 2. 禁用适配器的自动禁用功能（尝试，失败不影响主流程）
    try {
      await disableAdapterAutoDisable(interfaceName);
    } catch (err) {
      console.warn('禁用自动禁用功能失败，继续...', err);
    }
    
    // 3. 确保接口状态稳定
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error(`设置接口 ${interfaceName} 持久启用失败:`, error);
    throw error;
  }
}

// 禁用Windows网络桥接检测（这是导致自动禁用的主要原因）
async function disableNetworkBridgeDetection() {
  try {
    console.log('[关键] 禁用Windows网络桥接检测...');
    
    const psCommand = `
      # 禁用网络桥接检测服务
      try {
        # 方法1：禁用Windows的网络列表服务自动管理
        Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\NetworkConnectivityStatusIndicator" -Name "NoActiveProbe" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
        Write-Output "已禁用网络连接状态指示器"
        
        # 方法2：禁用网络位置感知的自动禁用功能
        Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\NlaSvc\\Parameters\\Internet" -Name "EnableActiveProbing" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
        Write-Output "已禁用NLA主动探测"
        
        # 方法3：禁用Windows的智能多主机名称解析
        Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\DNSClient" -Name "EnableMulticast" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
        Write-Output "已禁用多播DNS"
        
        Write-Output "Success"
      } catch {
        Write-Output "Error: $_"
      }
    `;
    
    return new Promise((resolve) => {
      const child = spawn('powershell.exe', [
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-Command', psCommand
      ], { windowsHide: true });
      
      let output = '';
      child.stdout.on('data', (data) => { output += data.toString(); });
      child.on('close', () => {
        if (output.includes('Success')) {
          console.log('[成功] Windows网络桥接检测已禁用');
          resolve({ success: true });
        } else {
          console.warn('[警告] 禁用网络桥接检测部分失败，继续...');
          resolve({ success: false, warning: true });
        }
      });
      child.on('error', () => resolve({ success: false, warning: true }));
    });
  } catch (error) {
    console.warn('[警告] 禁用网络桥接检测失败:', error);
    return { success: false, warning: true };
  }
}

// 配置双网络共存（终极方案 - 不设置跃点数，让Windows自动分配）
async function configureDualNetwork(primaryInterface, secondaryInterface) {
  try {
    console.log(`========== 配置双网络共存 ==========`);
    console.log(`【关键发现】设置跃点数会触发Windows自动禁用`);
    console.log(`【新策略】只启用接口，不设置跃点数，让Windows自然分配`);
    console.log(`主接口: ${primaryInterface}, 辅接口: ${secondaryInterface}`);
    
    // 【步骤0】禁用Windows网络桥接检测
    console.log('\n[步骤0] 禁用Windows网络桥接检测');
    await disableNetworkBridgeDetection();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 【步骤1】禁用适配器的自动禁用功能
    console.log('\n[步骤1] 禁用适配器的电源管理');
    try {
      await Promise.all([
        disableAdapterAutoDisable(primaryInterface),
        disableAdapterAutoDisable(secondaryInterface)
      ]);
      console.log('[成功] 适配器自动禁用功能已关闭');
    } catch (err) {
      console.warn('[警告] 部分适配器设置失败，继续...', err);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 【步骤2】启用两个接口（不设置跃点数！）
    console.log('\n[步骤2] 启用两个网络接口（不设置跃点数，避免触发禁用）');
    
    // 先启用辅助接口
    console.log(`[2.1] 启用 ${secondaryInterface}...`);
    await enableInterface(secondaryInterface);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 检查辅助接口状态
    let interfaces = await getNetworkInterfaces();
    let secondary = interfaces.find(iface => iface.name === secondaryInterface);
    console.log(`[状态] ${secondaryInterface}: ${secondary?.status} ${secondary?.state}`);
    
    // 再启用主接口
    console.log(`[2.2] 启用 ${primaryInterface}...`);
    await enableInterface(primaryInterface);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 检查主接口状态
    interfaces = await getNetworkInterfaces();
    let primary = interfaces.find(iface => iface.name === primaryInterface);
    console.log(`[状态] ${primaryInterface}: ${primary?.status} ${primary?.state}`);
    
    // 【步骤3】验证两个接口是否都保持启用
    console.log('\n[步骤3] 验证接口状态（不设置跃点数）');
    
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      interfaces = await getNetworkInterfaces();
      primary = interfaces.find(iface => iface.name === primaryInterface);
      secondary = interfaces.find(iface => iface.name === secondaryInterface);
      
      console.log(`[检查${i+1}/5] ${primaryInterface}: ${primary?.status}, ${secondaryInterface}: ${secondary?.status}`);
      
      // 如果主接口被禁用，重新启用（但不设置跃点数）
      if (primary?.status !== 'enabled') {
        console.log(`[修正] ${primaryInterface} 被禁用，重新启用（不设置跃点数）`);
        await enableInterface(primaryInterface);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 如果辅助接口被禁用，重新启用
      if (secondary?.status !== 'enabled') {
        console.log(`[修正] ${secondaryInterface} 被禁用，重新启用`);
        await enableInterface(secondaryInterface);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 如果连续3次检查都保持启用，认为成功
      if (i >= 2 && primary?.status === 'enabled' && secondary?.status === 'enabled') {
        console.log(`[成功] 两个接口连续${i+1}次检查都保持启用状态`);
        break;
      }
    }
    
    // 【最终验证】
    console.log('\n========== 最终验证 ==========');
    const finalInterfaces = await getNetworkInterfaces();
    const finalPrimary = finalInterfaces.find(iface => iface.name === primaryInterface);
    const finalSecondary = finalInterfaces.find(iface => iface.name === secondaryInterface);
    
    console.log(`${primaryInterface}: ${finalPrimary?.status} ${finalPrimary?.state}`);
    console.log(`${secondaryInterface}: ${finalSecondary?.status} ${finalSecondary?.state}`);
    
    if (finalPrimary?.status === 'enabled' && finalSecondary?.status === 'enabled') {
      console.log('\n========== 配置成功 ==========');
      console.log('[✓] 两个网络接口同时保持启用状态');
      console.log('[提示] 路由优先级由Windows自动管理');
      console.log('[提示] 如需手动调整，请在网络适配器属性中设置');
      return { success: true };
    } else {
      console.warn('\n========== 配置部分成功 ==========');
      console.warn('[!] 部分接口未能保持启用');
      console.warn('[!] 可能需要手动禁用Windows的网络管理功能');
      return { success: false, warning: true };
    }
  } catch (error) {
    console.error('\n========== 配置失败 ==========');
    console.error('[×] 错误:', error.message);
    throw error;
  }
}

// 确保两个网络接口都启用（优化版本 - 不再使用监控，而是预防）
async function ensureBothInterfacesEnabled() {
  const interfaces = await getNetworkInterfaces();
  
  // 自动检测网口类型
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
  
  const tasks = [];
  
  // 如果外网被禁用，启用它
  if (waiwang && waiwang.status === 'disabled') {
    console.log('检测到外网被禁用，正在重新启用...');
    tasks.push(enableInterface(waiwang.name));
  }
  
  // 如果内网被禁用，启用它
  if (neiwang && neiwang.status === 'disabled') {
    console.log('检测到内网被禁用，正在重新启用...');
    tasks.push(enableInterface(neiwang.name));
  }
  
  if (tasks.length > 0) {
    await Promise.all(tasks);
    // 等待接口稳定
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 执行网络切换（原批处理文件的功能）
async function switchToWaiwang() {
  try {
    console.log('=== 启动外网，保持内网连接但使用 xxxx地址');
    
    // 动态检测网口
    const interfaces = await getNetworkInterfaces();
    const neiwang = interfaces.find(iface => 
      iface.name.toLowerCase().includes('neiwang') || 
      iface.name.toLowerCase().includes('ethernet') ||
      iface.name.toLowerCase().includes('lan')
    );
    const waiwang = interfaces.find(iface => 
      iface.name.toLowerCase().includes('waiwang') || 
      iface.name.toLowerCase().includes('wifi') || 
      iface.name.toLowerCase().includes('wireless') ||
      iface.name.toLowerCase().includes('wi-fi')
    );
    
    if (!neiwang) {
      throw new Error('未找到内网接口');
    }
    if (!waiwang) {
      throw new Error('未找到外网接口');
    }
    
    // 1. 先启用内网接口（保持连接状态）
    await enableInterface(neiwang.name);
    console.log('内网接口已启用（保持连接）');
    
    // 2. 设置内网为 xxxx地址（169.254.x.x），使其无法正常使用
    try {
      console.log('设置内网为 xxxx地址...');
      
      // 方法1：先禁用 DHCP，再设置静态 xxxx地址
      await execNetsh(['interface', 'ipv4', 'set', 'interface', neiwang.name, 'dhcp=disabled']);
      console.log('已禁用内网 DHCP');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await execNetsh(['interface', 'ipv4', 'set', 'address', neiwang.name, 'static', '169.254.1.1', '255.255.0.0']);
      
    } catch (apipaError) {
      
      // 备用方法：使用 PowerShell 设置
      try {
        const psCommand = `
          # 获取内网适配器
          $adapter = Get-NetAdapter | Where-Object {$_.Name -eq '${neiwang.name}'}
          if ($adapter) {
            # 禁用 DHCP
            Set-NetIPInterface -InterfaceAlias '${neiwang.name}' -Dhcp Disabled -ErrorAction SilentlyContinue
            
            # 设置静态 xxxx地址
            New-NetIPAddress -InterfaceAlias '${neiwang.name}' -IPAddress '169.254.1.1' -PrefixLength 16 -ErrorAction SilentlyContinue
            
            Write-Output "内网已设置为 xxxx地址"
          } else {
            Write-Output "未找到内网适配器"
          }
        `;
        
        const { spawn } = require('child_process');
        const child = spawn('powershell.exe', [
          '-NoProfile',
          '-ExecutionPolicy', 'Bypass',
          '-Command', psCommand
        ], { windowsHide: true });
        
        await new Promise((resolve, reject) => {
          let output = '';
          child.stdout.on('data', (data) => { output += data.toString(); });
          child.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              resolve(); // 不阻止主流程
            }
          });
        });
        
      } catch (psError) {
        console.log('PowerShell 设置也失败，继续...', psError.message);
      }
    }
    
    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. 启用外网 WiFi
    await enableInterface(waiwang.name);
    
    // 等待 WiFi 连接建立
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 恢复 WiFi 的正常  设置（简化版本，避免断开连接）
    try {
      
      // 1. 直接设置  模式（不禁用接口）
      await execNetsh(['interface', 'ipv4', 'set', 'interface', waiwang.name, 'dhcp=enabled']);
      
      // 2. 释放当前 IP 地址
      await execNetsh(['interface', 'ipv4', 'set', 'address', waiwang.name, 'dhcp']);
      
      // 3. 重置 DNS 为自动获取
      await execNetsh(['interface', 'ipv4', 'set', 'dns', waiwang.name, 'dhcp']);
      console.log('已重置 DNS 为自动获取');
      
      // 4. 等待网络重新建立连接
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 8. 使用 PowerShell 强制重置网络适配器
      try {
        const psCommand = `
          # 获取 WiFi 适配器
          $wifiAdapter = Get-NetAdapter | Where-Object {$_.Name -like "*Wi-Fi*" -or $_.Name -like "*Wireless*"}
          if ($wifiAdapter) {
            # 禁用适配器
            Disable-NetAdapter -Name $wifiAdapter.Name -Confirm:$false
            Start-Sleep -Seconds 3
            
            # 启用适配器
            Enable-NetAdapter -Name $wifiAdapter.Name -Confirm:$false
            Start-Sleep -Seconds 5
            
            # 强制刷新 IP 配置
            ipconfig /release
            ipconfig /renew
            
            Write-Output "WiFi 适配器已强制重置"
          } else {
            Write-Output "未找到 WiFi 适配器"
          }
        `;
        
        const { spawn } = require('child_process');
        const child = spawn('powershell.exe', [
          '-NoProfile',
          '-ExecutionPolicy', 'Bypass',
          '-Command', psCommand
        ], { windowsHide: true });
        
        child.on('close', (code) => {
          console.log('PowerShell 网络重置完成');
        });
        
        await new Promise(resolve => setTimeout(resolve, 8000));
        
      } catch (refreshError) {
        console.log('PowerShell 重置失败，继续...', refreshError.message);
      }
      
    } catch (dhcpError) {
      console.log('恢复 WiFi 连接失败，继续...', dhcpError.message);
    }
    
    return { success: true, message: '已启用外网，内网保持连接' };
  } catch (error) {
    throw new Error(`启动外网失败: ${error.message}`);
  }
}

async function switchToNeiwang() {
  try {
    console.log('=== 启动内网，禁用外网');
    
    // 动态检测网口
    const interfaces = await getNetworkInterfaces();
    const neiwang = interfaces.find(iface => 
      iface.name.toLowerCase().includes('neiwang') || 
      iface.name.toLowerCase().includes('ethernet') ||
      iface.name.toLowerCase().includes('lan')
    );
    const waiwang = interfaces.find(iface => 
      iface.name.toLowerCase().includes('waiwang') || 
      iface.name.toLowerCase().includes('wifi') || 
      iface.name.toLowerCase().includes('wireless') ||
      iface.name.toLowerCase().includes('wi-fi')
    );
    
    if (!neiwang) {
      throw new Error('未找到内网接口');
    }
    if (!waiwang) {
      throw new Error('未找到外网接口');
    }
    
    // 启用内网
    await enableInterface(neiwang.name);
    
    // 禁用外网
    await disableInterface(waiwang.name);
    
    return { success: true, message: '已启动内网，禁用外网' };
  } catch (error) {
    throw new Error(`启动内网失败: ${error.message}`);
  }
}

// 同时启用内外网（内网正常连接，外网使用 xxxx地址）
async function enableBothNetworks() {
  try {
    console.log('=== 同时启用内外网（内网正常连接，外网使用xxxx地址）');
    
    // 动态检测网口
    const interfaces = await getNetworkInterfaces();
    const neiwang = interfaces.find(iface => 
      iface.name.toLowerCase().includes('neiwang') || 
      iface.name.toLowerCase().includes('ethernet') ||
      iface.name.toLowerCase().includes('lan')
    );
    const waiwang = interfaces.find(iface => 
      iface.name.toLowerCase().includes('waiwang') || 
      iface.name.toLowerCase().includes('wifi') || 
      iface.name.toLowerCase().includes('wireless') ||
      iface.name.toLowerCase().includes('wi-fi')
    );
    
    if (!neiwang) {
      throw new Error('未找到内网接口');
    }
    if (!waiwang) {
      throw new Error('未找到外网接口');
    }
    
    // 1. 先启用内网接口（保持连接状态）
    await enableInterface(neiwang.name);
    console.log('内网接口已启用（保持连接）');
    
    // 2. 恢复内网为正常  连接（不修改内网配置）
    try {
      console.log('恢复内网为正常 DHCP 连接...');
      
      // 1. 设置内网为  模式
      await execNetsh(['interface', 'ipv4', 'set', 'address', neiwang.name, 'dhcp']);
      console.log('已重置内网为 DHCP 模式');
      
      // 2. 重置 DNS 为自动获取
      await execNetsh(['interface', 'ipv4', 'set', 'dns', neiwang.name, 'dhcp']);
      console.log('已重置内网 DNS 为自动获取');
      
      // 3. 等待内网网络稳定
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (neiwangError) {
      console.log('恢复内网连接失败，继续...', neiwangError.message);
    }
    
    // 等待内网稳定
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. 启用外网 WiFi
    await enableInterface(waiwang.name);
    console.log('外网 WiFi 已启用');
     
    // 等待 WiFi 连接建立
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. 设置外网 WiFi 为静态 xxxx地址
    try {
      console.log('设置外网 WiFi 为静态 xxxx地址...');
      
      // 方法1：设置静态 xxxx地址
      await execNetsh(['interface', 'ipv4', 'set', 'address', waiwang.name, 'static', '169.254.2.1', '255.255.0.0']);
      console.log('外网 WiFi 已设置为静态 xxxx地址（169.254.2.1）');
      
    } catch (apipaError) {
      console.log('设置外网 WiFi xxxx地址失败，尝试备用方法...', apipaError.message);
      
      // 备用方法：使用 PowerShell 直接添加地址
      try {
        const psCommand = `
          # 获取外网 WiFi 适配器
          $adapter = Get-NetAdapter | Where-Object {$_.Name -eq '${waiwang.name}'}
          if ($adapter) {
            # 先移除现有IP配置，然后设置静态 xxxx地址
            Remove-NetIPAddress -InterfaceAlias '${waiwang.name}' -Confirm:$false -ErrorAction SilentlyContinue
            New-NetIPAddress -InterfaceAlias '${waiwang.name}' -IPAddress '169.254.2.1' -PrefixLength 16 -ErrorAction SilentlyContinue
            
            Write-Output "外网 WiFi 已设置为静态 xxxx地址"
          } else {
            Write-Output "未找到外网 WiFi 适配器"
          }
        `;
        
        const { spawn } = require('child_process');
        const child = spawn('powershell.exe', [
          '-NoProfile',
          '-ExecutionPolicy', 'Bypass',
          '-Command', psCommand
        ], { windowsHide: true });
        
        await new Promise((resolve, reject) => {
          let output = '';
          child.stdout.on('data', (data) => { output += data.toString(); });
          child.on('close', (code) => {
            if (code === 0) {
              console.log('PowerShell 设置外网 WiFi xxxx成功');
              resolve();
            } else {
              console.log('PowerShell 设置失败，继续...');
              resolve(); // 不阻止主流程
            }
          });
        });
        
      } catch (psError) {
        console.log('PowerShell 设置也失败，继续...', psError.message);
      }
    }
    
    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 5. 设置外网 WiFi 适配器保护措施（防止被 Windows 自动禁用）
    try {
      console.log('设置外网 WiFi 适配器保护措施...');
      
      const psCommand = `
        # 获取外网 WiFi 适配器
        $wifiAdapter = Get-NetAdapter | Where-Object {$_.Name -eq '${waiwang.name}'}
        if ($wifiAdapter) {
          # 禁用电源管理
          $wifiAdapter | Set-NetAdapterAdvancedProperty -DisplayName "Power Management" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
          $wifiAdapter | Set-NetAdapterAdvancedProperty -DisplayName "Allow the computer to turn off this device" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
          
          # 禁用节能功能
          $wifiAdapter | Set-NetAdapterAdvancedProperty -DisplayName "Energy Efficient Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
          
          Write-Output "外网 WiFi 电源管理已禁用"
        } else {
          Write-Output "未找到外网 WiFi 适配器"
        }
      `;
      
      const { spawn } = require('child_process');
      const child = spawn('powershell.exe', [
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-Command', psCommand
      ], { windowsHide: true });
      
      child.on('close', (code) => {
        console.log('PowerShell 外网 WiFi 保护设置完成');
      });
      
    } catch (protectError) {
      console.log('外网 WiFi 保护设置失败，继续...', protectError.message);
    }
    
    return { success: true, message: '已同时启用内外网（内网正常连接，外网保持）' };
  } catch (error) {
    throw new Error(`启用网络失败: ${error.message}`);
  }
}

// IPC 通信处理

// 检查适配器是否已配置（检查实际适配器名称）
ipcMain.handle('check-adapter-config', async () => {
  try {
    // 检查系统中是否实际存在 neiwang 和 waiwang 适配器
    const adapterStatus = await checkActualAdapters();
    const config = getAdapterConfig();
    
    return { 
      success: true, 
      configured: adapterStatus.bothExist,
      neiwangExists: adapterStatus.neiwangExists,
      waiwangExists: adapterStatus.waiwangExists,
      config 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 配置网络适配器
ipcMain.handle('configure-adapters', async (event, neiwangAdapter, waiwangAdapter) => {
  try {
    const result = await configureAdapters(neiwangAdapter, waiwangAdapter);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 获取适配器配置
ipcMain.handle('get-adapter-config', async () => {
  try {
    const config = getAdapterConfig();
    return { success: true, config };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-interfaces', async () => {
  try {
    const interfaces = await getNetworkInterfaces();
    return { success: true, data: interfaces };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('disable-interface', async (event, interfaceName) => {
  try {
    const result = await disableInterface(interfaceName);
    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('enable-interface', async (event, interfaceName) => {
  try {
    const result = await enableInterface(interfaceName);
    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('switch-to-waiwang', async () => {
  try {
    const result = await switchToWaiwang();
    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('switch-to-neiwang', async () => {
  try {
    const result = await switchToNeiwang();
    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-admin', async () => {
  return isAdmin();
});

// 检查网络连通性（ping baidu.com）
ipcMain.handle('check-network-connectivity', async () => {
  return new Promise(resolve => {
    exec('ping -n 1 baidu.com', { encoding: 'buffer' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[后端] Ping baidu.com 失败: ${error.message}`);
        resolve(false);
        return;
      }

      // 将 stdout 从 GBK 解码为 UTF-8
      const decodedStdout = iconv.decode(stdout, 'gbk');
      console.log(`[后端] Ping baidu.com 结果:\n${decodedStdout}`);

      // 检查输出中是否包含"来自"或"Reply from"等成功标志
      if (decodedStdout.includes('来自') || decodedStdout.includes('Reply from')) {
        console.log('[后端] baidu.com 连通性检查: 成功');
        resolve(true);
      } else {
        console.log('[后端] baidu.com 连通性检查: 失败');
        resolve(false);
      }
    });
  });
});


// 网络监控定时器
let networkMonitorTimer = null;
let lastCheckTime = 0;

// 启动网络监控（已禁用自动启动，需手动触发）
function startNetworkMonitor() {
  if (networkMonitorTimer) {
    clearInterval(networkMonitorTimer);
  }
  
  // 网络监控已禁用，不再自动循环检查和启用外网
  console.log('[监控] 网络监控功能已禁用（根据用户要求）');
  
  // networkMonitorTimer = setInterval(async () => {
  //   try {
  //     const now = Date.now();
  //     // 避免过于频繁的检查（至少间隔2秒）
  //     if (now - lastCheckTime < 2000) {
  //       return;
  //     }
  //     lastCheckTime = now;
  //     
  //     const interfaces = await getNetworkInterfaces();
  //     const waiwang = interfaces.find(iface => iface.name === 'waiwang');
  //     const neiwang = interfaces.find(iface => iface.name === 'neiwang');
  //     
  //     let needRestore = false;
  //     
  //     // 检查外网是否被禁用
  //     if (waiwang && waiwang.status === 'disabled') {
  //       console.log('[监控] 检测到外网被禁用，立即恢复...');
  //       await enableInterface('waiwang');
  //       needRestore = true;
  //     }
  //     
  //     // 检查内网是否被禁用
  //     if (neiwang && neiwang.status === 'disabled') {
  //       console.log('[监控] 检测到内网被禁用，立即恢复...');
  //       await enableInterface('neiwang');
  //       needRestore = true;
  //     }
  //     
  //     // 如果有接口被恢复，记录日志（不设置跃点数，避免再次触发禁用）
  //     if (needRestore) {
  //       console.log('[监控] 网络接口已恢复启用（不设置跃点数）');
  //     }
  //   } catch (error) {
  //     console.error('[监控] 网络监控出错:', error);
  //   }
  // }, 3000); // 每3秒检查一次
  
  // console.log('[监控] 网络监控已启动（间隔3秒）');
}

// 停止网络监控
function stopNetworkMonitor() {
  if (networkMonitorTimer) {
    clearInterval(networkMonitorTimer);
    networkMonitorTimer = null;
    console.log('网络监控已停止');
  }
}

// 智能网络管理：同时启用内外网
ipcMain.handle('smart-network-management', async () => {
  try {
    console.log('=== 同时启用内外网');
    
    const result = await enableBothNetworks();
    
    return { 
      success: true, 
      message: result.message
    };
  } catch (error) {
    console.error('同时启用失败:', error);
    return { success: false, error: error.message };
  }
});

// 启动网络监控IPC
ipcMain.handle('start-network-monitor', async () => {
  startNetworkMonitor();
  return { success: true, message: '网络监控已启动' };
});

// 停止网络监控IPC
ipcMain.handle('stop-network-monitor', async () => {
  stopNetworkMonitor();
  return { success: true, message: '网络监控已停止' };
});

// 激活相关函数
function checkActivationStatus() {
  const activationStatus = activationManager.getActivationStatus();
  
  if (activationStatus.activated) {
    // 已激活，显示主应用
    showMainApp();
  } else {
    // 未激活，显示激活界面
    showActivationScreen();
  }
}

// 显示激活界面
function showActivationScreen() {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      if (typeof showActivationScreen === 'function') {
        showActivationScreen();
      } else {
        document.getElementById('activation-screen').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
      }
    `);
  }
}

// 显示主应用
function showMainApp() {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      if (typeof showMainApp === 'function') {
        showMainApp();
      } else {
        document.getElementById('activation-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
      }
    `);
  }
}

// 激活相关IPC处理程序
ipcMain.handle('check-activation-status', async () => {
  try {
    const status = activationManager.getActivationStatus();
    return { success: true, data: status };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('activate-app', async (event, activationCode) => {
  try {
    const result = await activationManager.activate(activationCode);
    if (result.success) {
      // 激活成功，切换到主应用
      showMainApp();
    }
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validate-activation-code', async (event, code) => {
  try {
    const result = activationManager.validateActivationCode(code);
    return result;
  } catch (error) {
    return { valid: false, error: error.message };
  }
});

ipcMain.handle('reset-activation', async () => {
  try {
    const result = activationManager.resetActivation();
    if (result.success) {
      showActivationScreen();
    }
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

