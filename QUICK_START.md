# 快速开始指南

## 🚀 30秒快速启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动应用
```bash
npm start
```

⚠️ **重要**: 必须以管理员身份运行！

---

## 📦 Windows 快捷方式

### 开发模式
双击 `start.bat` 文件（右键 → 以管理员身份运行）

### 打包应用
双击 `build.bat` 文件

---

## 🎯 首次使用检查清单

- [ ] 已安装 Node.js (16.x+)
- [ ] 以管理员身份运行
- [ ] 已运行 `npm install`
- [ ] 检查网络接口名称是否为 `neiwang` 和 `waiwang`

---

## ⚙️ 自定义接口名称

如果你的网络接口名称不同，请编辑 `main.js`:

**第 83 行左右** - `switchToWaiwang` 函数:
```javascript
await disableInterface('你的内网接口名称');
await enableInterface('你的外网接口名称');
```

**第 95 行左右** - `switchToNeiwang` 函数:
```javascript
await enableInterface('你的内网接口名称');
```

---

## 🔍 查看网络接口名称

### 方法1: 使用命令行
```cmd
netsh interface show interface
```

### 方法2: 使用应用
启动应用后，在"网络接口管理"区域可以看到所有接口名称。

---

## 💡 常见问题

### Q: 提示"拒绝访问"？
**A**: 必须以管理员身份运行应用。

### Q: 找不到 neiwang/waiwang 接口？
**A**: 这些是示例名称，请根据实际情况修改 `main.js` 中的接口名称。

### Q: 应用启动后显示空白？
**A**: 打开开发者工具（Ctrl+Shift+I）查看错误信息。

---

## 📖 完整文档

查看 [README.md](README.md) 获取完整文档和高级配置。

