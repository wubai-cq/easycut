# EasyCut 现代深色 UI 设计规范 v2.0

## 1. 设计理念

基于现代深色主题应用的设计理念,打造简洁、专业、易用的网络管理工具界面。

**核心原则:**
- **极简主义** - 减少视觉噪音,突出核心功能
- **高对比度** - 确保可读性和易用性
- **流畅交互** - 自然的动画和过渡效果
- **信息层次** - 清晰的视觉优先级

---

## 2. 颜色系统

### 2.1 背景色

```css
--bg-primary: #000000;           /* 主背景 - 纯黑 */
--bg-secondary: #0A0A0A;         /* 次级背景 - 近黑 */
--bg-card: #111111;              /* 卡片背景 - 深灰 */
--bg-elevated: #1A1A1A;          /* 提升元素背景 */
--bg-hover: #252525;             /* 悬停状态 */
```

### 2.2 文本颜色

```css
--text-primary: #FFFFFF;         /* 主要文本 - 纯白 */
--text-secondary: #999999;       /* 次要文本 - 灰色 */
--text-tertiary: #666666;        /* 辅助文本 - 深灰 */
--text-disabled: #4A4A4A;        /* 禁用状态 */
```

### 2.3 强调色

```css
--accent-primary: #3B82F6;       /* 主要强调 - 蓝色 */
--accent-secondary: #8B5CF6;     /* 次要强调 - 紫色 */
--accent-success: #10B981;       /* 成功 - 绿色 */
--accent-warning: #F59E0B;       /* 警告 - 橙色 */
--accent-danger: #EF4444;        /* 危险 - 红色 */
```

### 2.4 边框和分隔

```css
--border-subtle: rgba(255, 255, 255, 0.06);  /* 微妙边框 */
--border-default: rgba(255, 255, 255, 0.1);  /* 默认边框 */
--border-strong: rgba(255, 255, 255, 0.2);   /* 强边框 */
```

---

## 3. 布局系统

### 3.1 页面结构

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │        App Header                 │ │  ← 应用头部
│  │        Logo + Actions             │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │        Status Card                │ │  ← 状态卡片
│  │        Current Mode + Status      │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────┐  ┌───────────────┐ │
│  │               │  │               │ │
│  │  Mode Card 1  │  │  Mode Card 2  │ │  ← 模式卡片
│  │               │  │               │ │
│  └───────────────┘  └───────────────┘ │
│                                         │
│  Section Title                    🔧   │  ← 分组标题
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  Interface Item                   │ │  ← 接口项目
│  │  ─────────────────────────────── │ │
│  │  Interface Item                   │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Status Bar                       │ │  ← 底部状态栏
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 间距系统

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### 3.3 容器宽度

```css
--container-max-width: 480px;
--container-padding: 20px;
```

---

## 4. 组件设计

### 4.1 应用头部

**设计:**
```
┌─────────────────────────────────────────┐
│                                         │
│  EasyCut                    ⚙️  ⚡  👤  │
│                                         │
└─────────────────────────────────────────┘
```

**样式:**
```css
.app-header {
    padding: 24px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-subtle);
}

.app-logo {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
}

.header-actions {
    display: flex;
    gap: 16px;
}

.icon-button {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.icon-button:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}
```

### 4.2 状态卡片

**设计:**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐                                │
│  │ 🌐 │  网络状态                        │
│  └────┘  已连接                         │
│                                         │
│  当前模式: 双网模式                      │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ 外网 ✓   │  │ 内网 ✓   │           │
│  └──────────┘  └──────────┘           │
│                                         │
└─────────────────────────────────────────┘
```

**样式:**
```css
.status-card {
    margin: 24px;
    padding: 24px;
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 20px;
}

.status-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
}

.status-icon {
    width: 48px;
    height: 48px;
    background: var(--accent-primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.status-info {
    flex: 1;
}

.status-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.status-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.status-badges {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

.status-badge {
    padding: 8px 16px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    font-size: 14px;
    color: var(--text-secondary);
}

.status-badge.active {
    border-color: var(--accent-success);
    color: var(--accent-success);
}
```

### 4.3 模式切换卡片

**设计:**
```
┌───────────────────┐  ┌───────────────────┐
│                   │  │                   │
│       📡          │  │       🌐          │
│                   │  │                   │
│    启用外网       │  │    同时启用       │
│                   │  │                   │
│                   │  │       ✓           │
│                   │  │                   │
└───────────────────┘  └───────────────────┘
```

**样式:**
```css
.mode-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 0 24px;
    margin-bottom: 32px;
}

.mode-card {
    aspect-ratio: 1;
    background: var(--bg-card);
    border: 2px solid var(--border-default);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mode-card:hover {
    border-color: var(--border-strong);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.mode-card.active {
    border-color: var(--accent-primary);
    background: rgba(59, 130, 246, 0.05);
}

.mode-icon {
    font-size: 40px;
    margin-bottom: 8px;
}

.mode-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.mode-active-indicator {
    width: 24px;
    height: 24px;
    background: var(--accent-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
}
```

### 4.4 分组标题

**设计:**
```
网络接口                              🔧
```

**样式:**
```css
.section-header {
    padding: 0 24px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.section-action {
    font-size: 14px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: color 0.2s ease;
}

.section-action:hover {
    color: var(--accent-primary);
}
```

### 4.5 接口项目列表

**设计:**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐  WiFi - 内网                    │
│  │ 📶 │  ● 已连接                       │
│  └────┘  信号: 强   IP: 192.168.1.100   │
│                                 [禁用]  │
│  ─────────────────────────────────────  │
│                                         │
│  ┌────┐  以太网 - 外网                  │
│  │ 🔌 │  ○ 已禁用                       │
│  └────┘                                 │
│                                 [启用]  │
│                                         │
└─────────────────────────────────────────┘
```

**样式:**
```css
.interface-card {
    margin: 0 24px 24px;
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 20px;
    overflow: hidden;
}

.interface-item {
    padding: 20px;
    border-bottom: 1px solid var(--border-subtle);
}

.interface-item:last-child {
    border-bottom: none;
}

.interface-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 8px;
}

.interface-icon {
    width: 44px;
    height: 44px;
    background: var(--bg-elevated);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.interface-info {
    flex: 1;
}

.interface-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.interface-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-secondary);
}

.interface-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-success);
}

.interface-status-dot.disabled {
    background: var(--accent-danger);
}

.interface-details {
    font-size: 13px;
    color: var(--text-tertiary);
    margin-top: 8px;
}

.interface-action {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
}

.interface-btn {
    padding: 8px 20px;
    background: transparent;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.interface-btn:hover {
    background: var(--bg-hover);
    border-color: var(--border-strong);
}

.interface-btn.enable {
    border-color: var(--accent-success);
    color: var(--accent-success);
}

.interface-btn.enable:hover {
    background: rgba(16, 185, 129, 0.1);
}

.interface-btn.disable {
    border-color: var(--accent-danger);
    color: var(--accent-danger);
}

.interface-btn.disable:hover {
    background: rgba(239, 68, 68, 0.1);
}
```

### 4.6 底部状态栏

**设计:**
```
┌─────────────────────────────────────────┐
│  ✓ 就绪                                  │
└─────────────────────────────────────────┘
```

**样式:**
```css
.status-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 24px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-icon {
    width: 20px;
    height: 20px;
    color: var(--accent-success);
}

.status-text {
    font-size: 14px;
    color: var(--text-secondary);
}
```

---

## 5. 排版系统

### 5.1 字体

```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
              'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

### 5.2 字号系统

```css
--text-xs: 12px;
--text-sm: 13px;
--text-base: 14px;
--text-lg: 16px;
--text-xl: 18px;
--text-2xl: 20px;
--text-3xl: 24px;
```

### 5.3 字重

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 6. 圆角系统

```css
--radius-sm: 8px;
--radius-md: 10px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 20px;
--radius-full: 9999px;
```

---

## 7. 阴影系统

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.6);
```

---

## 8. 动画系统

### 8.1 过渡时长

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

### 8.2 缓动函数

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);
```

### 8.3 常用动画

**淡入淡出:**
```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

**向上滑入:**
```css
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**脉冲:**
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

---

## 9. 响应式设计

### 9.1 断点

```css
--breakpoint-sm: 360px;
--breakpoint-md: 420px;
--breakpoint-lg: 480px;
```

### 9.2 响应式规则

**小屏幕 (< 420px):**
- 减小内边距: 24px → 16px
- 减小圆角: 20px → 16px
- 模式卡片改为垂直布局

**大屏幕 (> 480px):**
- 增加最大宽度限制
- 增加卡片间距

---

## 10. 交互状态

### 10.1 悬停状态

```css
:hover {
    background: var(--bg-hover);
    border-color: var(--border-strong);
    transform: translateY(-2px);
}
```

### 10.2 激活状态

```css
:active {
    transform: scale(0.98);
}
```

### 10.3 禁用状态

```css
:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
```

---

## 11. 图标系统

使用 **Heroicons** 或 **Lucide Icons**:

- `globe` - 网络
- `wifi` - WiFi
- `cable` - 以太网
- `settings` - 设置
- `share` - 分享
- `refresh` - 刷新
- `check` - 确认
- `x` - 关闭

---

## 12. 实施建议

### 优先级
1. **高** - 颜色系统、基础组件
2. **中** - 状态卡片、模式切换
3. **低** - 动画优化、响应式调整

### 实施步骤
1. 创建 CSS 变量系统
2. 重写基础组件样式
3. 实现新的布局结构
4. 添加交互动画
5. 优化响应式设计

---

**设计规范版本**: 2.0
**设计日期**: 2025-01-10
**设计风格**: 现代极简深色主题
**适用于**: EasyCut 网络管理工具
