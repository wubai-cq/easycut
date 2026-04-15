# Design System for EasyCut

## 1. Visual Theme & Atmosphere

EasyCut embodies a professional network management tool aesthetic with a dark, tech-forward design language. The interface uses a deep navy-black background (#0E1122) with a subtle textured overlay, creating an immersive workspace that reduces eye strain during extended use. The design philosophy prioritizes clarity and efficiency for network administrators and IT professionals.

The color system is built around three core elements: deep dark surfaces, vibrant teal-cyan accents (#39e6cf), and strategic use of status colors (green for success, red for danger, orange for warnings). This creates a high-contrast, information-dense interface where critical network states are immediately visible.

Typography uses Microsoft YaHei with system fallbacks, optimized for Chinese readability at standard UI scales (11px-16px). The interface density is high but organized, with clear visual hierarchy through font weights (500-700) and color differentiation.

**Key Characteristics:**
- Deep navy-black canvas (#0E1122) with optional textured background
- Teal-cyan accent (#39e6cf) as the primary brand color - used for interactive elements, highlights, and active states
- High contrast dark UI optimized for network status visibility
- Gradient buttons with hover elevation for tactile feedback
- Subtle card elevation with dark surface hierarchy (#1a1d2e over #0E1122)
- Smooth cubic-bezier transitions (0.4, 0, 0.2, 1) for natural motion
- Light glow effects on interactive elements for depth
- Chinese-optimized typography with Microsoft YaHei

## 2. Color Palette & Roles

### Primary Surfaces
- **Deep Navy Black** (`#0E1122`): Primary background canvas, creates immersive dark environment
- **Dark Surface** (`#1a1d2e`): Elevated card backgrounds, section containers
- **Border Gray** (`#2a2d3e`): Subtle division lines, card borders
- **Pure White** (`#ffffff`): High-emphasis text, active labels

### Accent Colors
- **Teal Cyan** (`#39e6cf`): Primary brand accent, interactive highlights, active indicators
- **Teal Cyan Light** (`#5ff5e0`): Hover state for teal elements
- **Sky Blue** (`#4a90e2`): Links, activation UI, secondary interactive elements
- **Deep Blue** (`#357abd`, `#2c5aa0`): Button hover states

### Status Colors
- **Success Green** (`#28a745`, `#218838`): Enabled status, confirmation, positive actions
- **Danger Red** (`#dc3545`, `#c82333`): Disabled status, errors, destructive actions
- **Warning Orange** (`#ffc107`, `#dd5b00`): Warnings, attention states
- **Info Blue** (`#d1ecf1`, `#0c5460`): Information badges

### Text Colors
- **Primary Text** (`#ffffff`): Headlines, primary labels, active text
- **Secondary Text** (`#e0e6ed`): Body text, descriptions
- **Muted Text** (`#8a8d9e`): Disabled states, placeholder text, captions
- **Dark Text** (`#333`): Light background text (fallback)

### Semantic Badge Colors
- **Enabled Badge** (`#d4edda` bg, `#155724` text): Green success badge
- **Disabled Badge** (`#f8d7da` bg, `#721c24` text): Red danger badge
- **Connected Badge** (`#d1ecf1` bg, `#0c5460` text): Blue info badge
- **Disconnected Badge** (`#e2e3e5` bg, `#383d41` text): Gray neutral badge

### Interactive States
- **Button Primary**: Gradient `#4a90e2` to `#357abd`
- **Button Hover**: Gradient `#357abd` to `#2c5aa0` with elevation
- **Button Active**: Scale down (0.98) with shadow reduction
- **Button Disabled**: Gray (`#555`) with grayscale filter

## 3. Typography Rules

### Font Family
- **Primary**: `'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
- Optimized for Chinese characters with excellent readability
- System fallbacks ensure cross-platform consistency

### Hierarchy

| Role | Size | Weight | Color | Use Case |
|------|------|--------|-------|----------|
| Heading Large | 28px | 700 | #ffffff | Activation title, main headers |
| Heading Medium | 14px | 600 | #ffffff | Section titles |
| Body Large | 16px | 600 | #ffffff | Button text |
| Body | 16px | 400-500 | #e0e6ed | Standard text, descriptions |
| Body Small | 14px | 400-500 | #8a8d9e | Status text, captions |
| Label | 12px | 500 | #39e6cf | Labels, indicators |
| Badge | 11px | 500 | contextual | Status badges |
| Micro | 11px | 500 | #e0e6ed | Refresh button text |

### Principles
- **Chinese-first design**: Microsoft YaHei provides optimal Chinese character rendering
- **Weight-based hierarchy**: Uses 500 (medium), 600 (semibold), 700 (bold) for emphasis
- **Color differentiation**: Text hierarchy maintained through color rather than size alone
- **Compact spacing**: Line heights kept tight (20px for 12px text) for information density

## 4. Component Stylings

### Buttons

**Primary Action Button** (启用外网/同时启用)
- Background: `#1D2A55` (启用外网) or Gradient `#141414` to `#2a2a2a` (同时启用)
- Text: `#ffffff`, 16px weight 600
- Padding: 20px vertical, full width
- Radius: 10px (rounded but not pill)
- Shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Hover: `translateY(-3px) scale(1.01)`, shadow intensifies to `0 6px 20px`
- Active: `scale(0.98)`, shadow reduces
- Transition: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Glow effect on click (white radial expansion)

**Control Button** (启用/禁用)
- Enable: `#28a745` with `0 2px 4px rgba(40,167,69,0.3)` shadow
- Disable: `#dc3545` with `0 2px 4px rgba(220,53,69,0.3)` shadow
- Padding: 6px 12px
- Radius: 5px
- Font: 12px
- Hover: Background darkens, `translateY(-1px)`, shadow intensifies
- Active: `scale(0.98)`
- Ripple effect on click (white radial)

**Icon Button** (刷新/分享)
- Size: 34px × 34px (share), auto (refresh)
- Background: transparent
- Hover: Scale up (1.08-1.1x), optional background glow
- Active: Scale down (0.95x)
- Glow: Teal cyan `drop-shadow(0 0 6px rgba(57,230,207,0.6))` on hover
- Special: Refresh icon rotates 360° on click

**Activation Button**
- Background: Gradient `#4a90e2` to `#357abd`
- Radius: 8px
- Padding: 15px
- Shadow: `0 2px 8px rgba(74,144,226,0.2)`
- Hover: Gradient shifts darker, elevation with double shadow
- Active: Scale down (0.98)
- Disabled: Gray `#555` with grayscale filter

### Cards & Containers
- Background: `#1a1d2e` (elevated surface)
- Border: `1px solid #2a2d3e` (subtle division)
- Radius: 8px (interface items), 12px (activation card)
- Shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Hover: Shadow intensifies, slight elevation
- Padding: 15px (compact for information density)

### Inputs & Forms
- Background: `#0E1122` (deep canvas)
- Border: `2px solid #4a90e2` (activation input)
- Text: `#ffffff`, 16px
- Padding: 15px vertical
- Radius: 8px
- Focus: Border glow `0 0 0 3px rgba(74,144,226,0.1)`
- Placeholder: `#8a8d9e`

### Status Badges
- Radius: 12px (pill shape for small badges)
- Padding: 2px 8px (compact)
- Font: 11px weight 500
- Color pairs: Background + text color for semantic meaning
- Examples:
  - Enabled: `#d4edda` bg / `#155724` text
  - Disabled: `#f8d7da` bg / `#721c24` text
  - Connected: `#d1ecf1` bg / `#0c5460` text

### Dividers
- Color: `#2a2d3e`
- Height: 1px
- Margin: 0 20px horizontal
- Purpose: Section separation without visual weight

### Active Indicator Bar
- Position: Top of button, 4px height
- Gradient: `linear-gradient(90deg, #00ff00, #00cc00, #00ff00)`
- Animation: 2s ease-in-out infinite glow cycle
- Glow: `box-shadow: 0 0 8px rgba(0,255,0,0.6)`
- Purpose: Shows currently active network mode

## 5. Layout Principles

### Spacing System
- Base unit: 4px
- Scale: 6px, 8px, 10px, 12px, 15px, 16px, 20px
- Generous padding in activation screen (40px)
- Compact spacing in main interface (10-20px) for density

### Container Structure
- Main container: Full viewport height, flex column
- Sections: Quick switch (top), interface list (flexible), status bar (bottom)
- Max-width: Auto (full-width desktop app)
- Activation screen: Centered 400px card

### Component Spacing
- Button gaps: 15px vertical stack
- Section margins: 20px padding
- Status bar: 10px padding, compact footprint

### Visual Hierarchy
1. **Top priority**: Quick switch buttons (large, prominent)
2. **Secondary**: Network interface list (scrollable, detailed)
3. **Tertiary**: Status bar (minimal, informational)

### Dark Surface Layering
- Base layer: `#0E1122` (body background)
- Elevated layer: `#1a1d2e` (cards, containers)
- Border layer: `#2a2d3e` (divisions)
- Creates 3-level depth system

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base (Level 0) | No elevation | Body background |
| Raised (Level 1) | Subtle shadow `0 2px 8px rgba(0,0,0,0.1)` | Interface cards |
| Elevated (Level 2) | Intensified shadow on hover | Hover states |
| High (Level 3) | Heavy shadow `0 8px 32px rgba(0,0,0,0.3)` | Activation modal |
| Glow (Level 4) | Colored glow effects | Active indicators, focused inputs |

**Shadow Philosophy**: EasyCut uses dark-optimized shadows with low opacity (0.1-0.3) to create subtle depth without harsh contrast. Hover states intensify shadows to indicate interactivity. Colored glows (teal, green) provide feedback for active states.

### Special Effects
- **Teal glow**: Interactive highlights, hover states
- **Green indicator bar**: Animated gradient for active modes
- **White ripple**: Click feedback on buttons
- **Icon rotation**: Refresh button animation

## 7. Accessibility & States

### Focus System
- Focus ring: `0 0 0 3px rgba(74,144,226,0.1)` for inputs
- Visual feedback: Scale changes and shadow intensification
- High contrast: White text on dark backgrounds exceeds WCAG AA

### Interactive States
- **Default**: Standard appearance with subtle shadows
- **Hover**: Scale up (1.01-1.1x), shadow intensification, elevation
- **Active/Pressed**: Scale down (0.95-0.98x), shadow reduction
- **Disabled**: Opacity 0.5, grayscale filter, cursor: not-allowed
- **Focus**: Visible ring or glow effect

### Color Contrast
- Primary text (#ffffff) on #0E1122: ~18:1 ratio (AAA)
- Secondary text (#e0e6ed) on #0E1122: ~15:1 ratio (AAA)
- Muted text (#8a8d9e) on #0E1122: ~8:1 ratio (AAA)
- Badge text on colored backgrounds: 4.5:1+ ratio (AA)

### Motion Preferences
- All animations respect `prefers-reduced-motion`
- Transitions use smooth cubic-bezier curves
- No jarring movements or rapid flashes

## 8. Responsive Behavior

### Breakpoints
- Desktop fixed width (Electron app)
- No responsive breakpoints needed
- Optimized for standard desktop/laptop screens (1280px+)

### Touch Targets
- Buttons: Minimum 34px × 34px (icon buttons)
- Primary buttons: Full-width with 20px padding (easy to tap)
- Control buttons: 12px padding (compact but accessible)

### Scroll Behavior
- Interface list: Vertical scroll with hidden scrollbar
- Smooth scrolling enabled
- Scrollbar hidden for clean aesthetic

### Window States
- Fixed viewport (Electron desktop app)
- No mobile/tablet variants
- Always fullscreen or user-resized window

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary background: Deep Navy Black `#0E1122`
- Elevated surface: Dark Surface `#1a1d2e`
- Accent color: Teal Cyan `#39e6cf`
- Button gradient: `linear-gradient(135deg, #4a90e2, #357abd)`
- Success: `#28a745`
- Danger: `#dc3545`
- Text primary: `#ffffff`
- Text secondary: `#e0e6ed`
- Text muted: `#8a8d9e`

### Example Component Prompts

**Primary Action Button**
```
Create a full-width action button with 20px padding, 10px border radius, background #1D2A55, white text at 16px weight 600. Hover state: translateY(-3px) scale(1.01), shadow intensifies to 0 6px 20px rgba(0,0,0,0.25). Active state: scale(0.98). Include click glow animation.
```

**Network Interface Card**
```
Design a card with background #1a1d2e, 1px solid #2a2d3e border, 8px radius, 15px padding. Include status badge (12px radius, 2px 8px padding, 11px text) with semantic colors. Add control buttons (6px 12px padding, 5px radius) in green (#28a745) or red (#dc3545) with hover elevation.
```

**Teal Accent Element**
```
Create an interactive element using teal-cyan #39e6cf as the primary accent color. On hover, brighten to #5ff5e0 and add drop-shadow(0 0 6px rgba(57,230,207,0.6)) glow effect. Apply scale(1.08) on hover and scale(0.95) on active.
```

**Status Badge**
```
Design a pill-shaped badge (radius 12px, padding 2px 8px, font 11px weight 500). For enabled state: background #d4edda, text #155724. For disabled: background #f8d7da, text #721c24. Ensure 4.5:1 contrast ratio.
```

**Dark Theme Input**
```
Create an input field with background #0E1122, 2px solid #4a90e2 border, 8px radius, 15px vertical padding. Text color #ffffff at 16px. Placeholder color #8a8d9e. Focus state: border glow with 0 0 0 3px rgba(74,144,226,0.1).
```

### Iteration Guide
1. Always use dark-optimized shadows (low opacity: 0.1-0.3)
2. Primary accent is teal-cyan (#39e6cf), used sparingly for maximum impact
3. Text hierarchy through color: #ffffff (primary) → #e0e6ed (secondary) → #8a8d9e (muted)
4. Buttons use scale transforms (1.01-1.1x hover, 0.95-0.98x active) for tactile feedback
5. All transitions use cubic-bezier(0.4, 0, 0.2, 1) for natural motion
6. Card elevation: #1a1d2e over #0E1122 creates visual hierarchy
7. Status colors are semantic: green (success), red (danger), orange (warning)
8. Chinese typography optimized with Microsoft YaHei font stack
9. Hover states include both elevation and shadow intensification
10. Glow effects use element-specific colors (teal for accents, green for active states)

## 10. Icon & Imagery Guidelines

### Icon Style
- Flat, minimal icons (20px × 20px standard)
- SVG format preferred for scalability
- Color: Inherits from parent or uses accent color
- Hover: Glow effects via drop-shadow filter

### Decorative Elements
- Background texture: `offline_chat_bg.png` (subtle, non-intrusive)
- QR code image: 240px width, 8px radius, shadow for depth
- Logo: 60px circle with gradient background

### Image Treatment
- QR codes: White background with shadow `0 10px 30px rgba(0,0,0,0.35)`
- Product screenshots: Not applicable (no screenshots in current UI)
- Icons: Inline SVG or PNG with transparent backgrounds

## 11. Animation & Motion

### Timing Functions
- Standard: `cubic-bezier(0.4, 0, 0.2, 1)` - Natural, smooth motion
- Fast: `0.1s ease` - Quick feedback for active states
- Slow: `0.3s` - Hover transitions, gentle movements

### Key Animations
- **Button elevation**: `translateY(-3px)` over 0.3s
- **Scale effects**: `scale(1.01-1.1)` on hover, `scale(0.95-0.98)` on active
- **Glow pulse**: 2s infinite ease-in-out for active indicators
- **Icon rotation**: 360° rotation over 0.4s for refresh button
- **Ripple expansion**: Radial expansion to 100-300px on click

### Motion Principles
- **Subtle over dramatic**: Animations enhance, don't distract
- **Functional feedback**: Motion indicates state changes
- **Performance-first**: CSS transforms for smooth 60fps animations
- **Accessibility**: Respect reduced motion preferences

---

**Design System Version**: 1.0
**Last Updated**: 2025-01-10
**Maintained for**: EasyCut Network Management Tool (Electron Desktop App)
