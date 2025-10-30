# EasyCut 激活系统使用说明

## 功能概述

EasyCut 现在集成了激活码系统，用户需要输入有效的激活码才能使用应用。

## 激活码规则

激活码格式：`XXXX-XXXX-XXXX-XXXX`（16位字符，用连字符分隔）

### 位置规则：
- 第1位：大写字母 (A-Z)
- 第2位：数字 (0-9)
- 第3位：大写字母 (A-Z)
- 第4位：数字 (0-9)
- 第5位：数字 (0-9)
- 第6位：大写字母 (A-Z)
- 第7位：数字 (0-9)
- 第8位：数字 (0-9)
- 第9位：大写字母 (A-Z)
- 第10位：大写字母 (A-Z)
- 第11位：数字 (0-9)
- 第12位：大写字母 (A-Z)
- 第13-16位：大写字母或数字组合

### 示例激活码：
- `N1Y6-7W44-JY3Q-E28A`
- `A2B3-4C5D-6E7F-8G9H`
- `X9Y8-Z7W6-V5U4-T3S2`

## 激活机制

1. **首次启动**：应用启动时检查激活状态
2. **未激活**：显示激活界面，要求输入激活码
3. **已激活**：直接进入主应用界面
4. **机器绑定**：每个激活码只能在同一台机器上使用一次
5. **本地存储**：激活状态保存在用户目录的 `.easycut/uck.ddl` 文件中

## 文件结构

```
c:\code\wifi\
├── activation.js              # 激活管理器
├── generate-test-code.js      # 测试激活码生成器
├── main.js                    # 主进程（已修改）
├── renderer.js                # 渲染进程（已修改）
├── preload.js                 # 预加载脚本（已修改）
├── index.html                 # 主界面（已修改）
├── styles.css                 # 样式文件（已修改）
└── ACTIVATION_README.md       # 本说明文件
```

## 测试激活码

运行以下命令生成测试激活码：

```bash
node generate-test-code.js
```

## 重置激活状态

如果需要重置激活状态（仅用于测试），可以在开发者控制台中运行：

```javascript
// 在渲染进程中
window.networkAPI.resetActivation();
```

## 激活状态存储位置

- Windows: `C:\Users\[用户名]\.easycut\uck.ddl`
- 文件内容示例：
```json
{
  "activated": true,
  "uuid": "XX:XX:XX:XX:XX:XX",
  "activationCode": "N1Y6-7W44-JY3Q-E28A",
  "activatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 安全特性

1. **机器绑定**：基于MAC地址的机器唯一标识
2. **格式验证**：严格的激活码格式校验
3. **本地存储**：激活状态仅存储在本地，无需网络连接
4. **防重复使用**：同一激活码在同一机器上只能使用一次

## 开发说明

### 主要修改的文件：

1. **activation.js** - 新增激活管理器
2. **main.js** - 添加激活检查和IPC处理
3. **renderer.js** - 添加激活界面交互
4. **preload.js** - 添加激活相关API
5. **index.html** - 添加激活界面HTML
6. **styles.css** - 添加激活界面样式

### 关键函数：

- `ActivationManager.validateActivationCode()` - 验证激活码格式
- `ActivationManager.activate()` - 激活应用
- `ActivationManager.getActivationStatus()` - 获取激活状态
- `formatActivationCode()` - 前端激活码格式化
- `activateApp()` - 前端激活处理

## 注意事项

1. 激活码区分大小写，系统会自动转换为大写
2. 输入时会自动格式化（添加连字符）
3. 支持粘贴激活码，会自动格式化
4. 激活成功后会自动切换到主应用界面
5. 如果激活失败，会显示具体错误信息
