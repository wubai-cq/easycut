# 网络切换工具 (Network Switcher)

一个基于 Electron 的现代化网络切换工具，用于快速切换 Windows 系统的网络接口。这是原批处理脚本的图形化升级版本。

## ✨ 功能特点

- 🎨 **现代化图形界面** - 使用 Electron 构建，提供美观易用的用户界面
- ⚡ **快速切换** - 一键切换内网/外网
- 📊 **实时状态** - 实时显示所有网络接口的状态
- 🔧 **精细控制** - 可以单独启用/禁用任何网络接口
- 🛡️ **权限检测** - 自动检测管理员权限并提示
- 🔄 **状态刷新** - 随时刷新网络接口状态

## 📋 系统要求

- **操作系统**: Windows 7/8/10/11
- **Node.js**: 16.x 或更高版本
- **权限**: 需要管理员权限来控制网络接口

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm start
```

⚠️ **注意**: 必须以管理员身份运行才能正常控制网络接口

### 打包为可执行文件

```bash
# 打包为 Windows 安装程序
npm run build:win
```

打包后的安装程序将在 `dist` 目录中。

## 📖 使用说明

### 1. 快速切换功能

应用提供两个主要的快速切换按钮：

- **停止连接** (原批处理的 "stop link")
  - 禁用 `neiwang` 接口
  - 启用 `waiwang` 接口
  - 适用于切换到外网

- **启动连接** (原批处理的 "start link")
  - 启用 `neiwang` 接口
  - 适用于切换到内网

### 2. 网络接口管理

在接口列表中，你可以：
- 查看所有网络接口的状态（已启用/已禁用，已连接/未连接）
- 单独启用或禁用任何接口
- 点击"刷新"按钮更新接口状态

### 3. 管理员权限

- 应用启动时会自动检测管理员权限
- 如果没有管理员权限，顶部会显示黄色警告框
- 在 Windows 中，右键点击应用选择"以管理员身份运行"

## 🏗️ 项目结构

```
network-switcher/
├── main.js              # Electron 主进程
├── preload.js           # 预加载脚本（IPC 通信桥梁）
├── index.html           # 应用界面
├── styles.css           # 样式文件
├── renderer.js          # 渲染进程脚本（用户交互逻辑）
├── package.json         # 项目配置
├── assets/              # 资源文件（图标等）
└── dist/                # 打包输出目录
```

## 🔧 技术栈

- **Electron** - 跨平台桌面应用框架
- **Node.js** - 后端运行时
- **HTML/CSS/JavaScript** - 前端技术
- **Windows netsh** - 网络配置命令行工具

## 💡 原批处理文件对比

| 功能 | 批处理文件 | Electron 应用 |
|------|-----------|--------------|
| 界面 | 命令行文本界面 | 现代化图形界面 |
| 操作 | 数字选择 | 按钮点击 |
| 状态显示 | 无实时显示 | 实时状态更新 |
| 接口管理 | 仅支持固定接口 | 支持所有接口 |
| 权限检测 | 自动提权 | 权限提示 |
| 跨平台 | 仅 Windows | 可扩展到其他平台 |

## 🔒 安全说明

- 应用使用 `contextIsolation` 确保渲染进程安全
- 通过 `preload.js` 暴露有限的 API 给渲染进程
- 不使用 `nodeIntegration`，避免安全风险
- 所有系统命令都在主进程中执行

## 🐛 故障排除

### 问题 1: 提示"操作失败"或"拒绝访问"

**解决方案**: 
- 确保以管理员身份运行应用
- 在 Windows 中右键点击应用图标，选择"以管理员身份运行"

### 问题 2: 找不到网络接口 "neiwang" 或 "waiwang"

**解决方案**:
- 这些是原批处理文件中使用的接口名称
- 请在"网络接口管理"区域查看你的实际接口名称
- 你可以使用单独的启用/禁用按钮控制任何接口
- 如需修改快速切换按钮使用的接口名称，请编辑 `main.js` 中的 `switchToWaiwang()` 和 `switchToNeiwang()` 函数

### 问题 3: 应用无法启动

**解决方案**:
- 确保已安装 Node.js 16.x 或更高版本
- 运行 `npm install` 安装所有依赖
- 检查是否有防火墙或杀毒软件阻止

### 问题 4: 打包后的应用无法运行

**解决方案**:
- 打包后的应用已配置为自动请求管理员权限
- 如果 Windows Defender 提示，请允许运行
- 确保安装目录有写入权限

## 📝 自定义接口名称

如果你的网络接口名称不是 "neiwang" 和 "waiwang"，可以在 `main.js` 中修改：

```javascript
// 找到这两个函数并修改接口名称
async function switchToWaiwang() {
  try {
    await disableInterface('你的内网接口名称');
    await enableInterface('你的外网接口名称');
    return { success: true, message: '已切换到外网' };
  } catch (error) {
    throw new Error(`切换到外网失败: ${error.message}`);
  }
}

async function switchToNeiwang() {
  try {
    await enableInterface('你的内网接口名称');
    return { success: true, message: '已切换到内网' };
  } catch (error) {
    throw new Error(`切换到内网失败: ${error.message}`);
  }
}
```

## 📦 打包配置

应用使用 `electron-builder` 进行打包，配置已在 `package.json` 中设置：

- 自动请求管理员权限 (`requestedExecutionLevel: "requireAdministrator"`)
- 生成 NSIS 安装程序
- 支持自定义安装目录
- 创建桌面和开始菜单快捷方式

## 🤝 贡献

欢迎提交问题和改进建议！

## 📄 许可证

MIT License

## 🎯 未来计划

- [ ] 添加网络配置预设功能
- [ ] 支持定时切换
- [ ] 添加网络状态监控
- [ ] 支持 VPN 连接管理
- [ ] 添加系统托盘图标
- [ ] 支持开机自启动

## 📞 联系方式

如有问题或建议，请创建 Issue。

---

**注意**: 此应用是 Windows 批处理脚本的现代化替代品，提供更好的用户体验和更强大的功能。

