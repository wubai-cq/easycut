# EasyCut UI 重设计方案

## 参考界面分析

根据提供的参考界面,我发现以下设计特点:

### 视觉风格
- **深色主题** - 深灰/深蓝背景
- **卡片式布局** - 独立的卡片组件
- **圆润设计** - 较大的圆角
- **阴影层次** - 明显的卡片阴影
- **简洁图标** - 线性图标风格

### 布局特点
- **顶部标题栏** - 固定高度的标题栏
- **主要内容区** - 居中的内容卡片
- **状态指示器** - 清晰的开关状态
- **底部操作区** - 操作按钮区域

---

## 新 UI 设计方案

### 1. 整体布局

```
┌─────────────────────────────────────────┐
│  EasyCut          [设置⚙️] [分享🔄]     │  ← 顶部栏
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  🌐 网络状态                        │ │
│  │  已连接到 WiFi                      │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │  ← 状态卡片
│  │  当前模式: 双网模式                  │ │
│  │  [外网: 启用] [内网: 启用]          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  快速切换                                │
│  ┌───────────┐  ┌───────────┐         │
│  │  启用外网  │  │  同时启用  │         │  ← 模式切换
│  │           │  │  ✓ 当前    │         │
│  └───────────┘  └───────────┘         │
│                                         │
│  网络接口                    [更新 🔄]  │
│  ┌───────────────────────────────────┐ │
│  │  WiFi - 内网                       │ │
│  │  ● 已连接                          │ │
│  │  信号: 强    IP: 192.168.1.100     │ │  ← 接口卡片
│  │                        [禁用]      │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  以太网 - 外网                     │ │
│  │  ○ 已禁用                          │ │
│  │                            [启用]  │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  状态: 就绪                              │  ← 底部状态栏
└─────────────────────────────────────────┘
```

---

## 2. 设计细节

### 2.1 颜色方案

**背景色:**
- 主背景: `#1a1d2e` (深蓝灰)
- 卡片背景: `#252836` (稍浅)
- 悬停背景: `#2a2d3e`

**强调色:**
- 主强调色: `#5C6BC0` (靛蓝色)
- 成功色: `#66BB6A` (绿色)
- 警告色: `#FFA726` (橙色)
- 危险色: `#EF5350` (红色)

**文本色:**
- 主文本: `#FFFFFF`
- 次文本: `#B0BEC5`
- 辅助文本: `#78909C`

**状态色:**
- 已连接: `#66BB6A` (绿色)
- 已禁用: `#EF5350` (红色)
- 未连接: `#78909C` (灰色)

### 2.2 组件样式

#### 顶部栏
```css
.header {
    height: 56px;
    background: #252836;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.app-title {
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
}

.header-actions {
    display: flex;
    gap: 12px;
}
```

#### 状态卡片
```css
.status-card {
    background: #252836;
    border-radius: 16px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.status-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.status-title {
    font-size: 14px;
    color: #B0BEC5;
    margin-bottom: 4px;
}

.status-value {
    font-size: 24px;
    font-weight: 600;
    color: #FFFFFF;
}
```

#### 模式切换按钮
```css
.mode-button {
    flex: 1;
    background: #252836;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.mode-button:hover {
    background: #2a2d3e;
    transform: translateY(-2px);
}

.mode-button.active {
    border-color: #5C6BC0;
    background: rgba(92, 107, 192, 0.1);
}

.mode-button.active::after {
    content: '✓ 当前';
    display: block;
    font-size: 12px;
    color: #5C6BC0;
    margin-top: 8px;
}
```

#### 网络接口卡片
```css
.interface-card {
    background: #252836;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
}

.interface-card:hover {
    background: #2a2d3e;
    transform: translateY(-1px);
}

.interface-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(92, 107, 192, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.interface-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #66BB6A; /* 已连接 */
    display: inline-block;
    margin-right: 6px;
}

.interface-status-dot.disabled {
    background: #EF5350; /* 已禁用 */
}
```

#### 操作按钮
```css
.action-btn {
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn.primary {
    background: #5C6BC0;
    color: #FFFFFF;
}

.action-btn.primary:hover {
    background: #3F51B5;
    transform: translateY(-1px);
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
}

.action-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.15);
}

.action-btn.danger {
    background: #EF5350;
    color: #FFFFFF;
}

.action-btn.danger:hover {
    background: #E53935;
}
```

### 2.3 圆角系统

- 超小圆角: 4px (按钮内元素)
- 小圆角: 8px (按钮、输入框)
- 中圆角: 12px (卡片、面板)
- 大圆角: 16px (主要卡片)
- 圆形: 50% (图标、头像)

### 2.4 阴影系统

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 12px 36px rgba(0, 0, 0, 0.25);
```

---

## 3. 交互动画

### 3.1 按钮悬停
```css
.button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}
```

### 3.2 卡片悬停
```css
.card:hover {
    background: #2a2d3e;
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
}
```

### 3.3 状态切换
```css
.status-dot {
    transition: all 0.3s ease;
}

.status-dot.connected {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

---

## 4. 响应式设计

### 4.1 窗口尺寸

**最小窗口:**
- 宽度: 360px
- 高度: 480px

**推荐窗口:**
- 宽度: 420px
- 高度: 640px

**大窗口:**
- 宽度: 480px+
- 高度: 720px+

### 4.2 间距调整

```css
/* 窗口宽度 < 400px */
@media (max-width: 400px) {
    .status-card, .interface-card {
        margin: 12px;
        padding: 16px;
    }

    .mode-buttons {
        flex-direction: column;
    }
}
```

---

## 5. 图标设计

使用 Material Design Icons 或 Feather Icons:

- 🌐 网络图标 (Globe)
- ⚙️ 设置图标 (Settings)
- 📤 分享图标 (Share)
- 🔄 刷新图标 (Refresh)
- 📡 WiFi 图标 (Wifi)
- 🔌 以太网图标 (Cable)
- ✓ 成功图标 (Check)
- ✗ 错误图标 (X)

---

## 6. 实施步骤

### 第一阶段: HTML 结构调整
1. 重构顶部栏布局
2. 添加状态卡片组件
3. 优化模式切换按钮
4. 改进网络接口列表

### 第二阶段: CSS 样式重写
1. 更新颜色变量
2. 应用新的圆角和阴影
3. 实现新的交互动画
4. 优化响应式布局

### 第三阶段: 交互优化
1. 添加悬停动画
2. 优化状态切换效果
3. 改进加载动画
4. 优化过渡效果

---

## 7. 文件清单

需要修改的文件:
- `index.html` - HTML 结构
- `styles.css` - 主样式文件
- `renderer.js` - 交互逻辑(可选)

新增文件:
- `ui-redesign.css` - 新 UI 样式

---

**设计方案版本**: 2.0
**设计日期**: 2025-01-10
**参考**: 提供的参考界面
**适用于**: EasyCut 网络管理工具
