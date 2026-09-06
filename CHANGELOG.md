# CHANGELOG

## [v3.0.0] - 2026-09-06

### 🚀 Major Features (首次重大更新)

#### 1️⃣ Three.js 3D UI 大幅升级
- **实时 3D 渲染**: 使用 Three.js 创建交互式 3D 球体界面
- **动态效果**: 球体旋转、脉动、颜色渐变响应亮度/音量变化
- **粒子系统**: 100+ 粒子环绕效果，增强视觉体验
- **光照系统**: 多点光源照明，产生真实感阴影和高光
- **透明背景**: 无边框设计，完美融合桌面环境

#### 2️⃣ 双模式支持 (亮度 + 音量)
- **亮度模式**: 控制屏幕亮度 (0-100%)
- **音量模式**: 控制系统音量 (0-100%)
- **一键切换**: 左上角按钮快速切换模式
- **独立配置**: 每种模式有独立的灵敏度、步进、上下限设置
- **macOS 原生控制**: 使用 osascript 控制系统音量

#### 3️⃣ 完全自定义手势学习系统
- **智能学习**: 用户只需划过一次触控板，软件自动学习手势模式
- **方向识别**: 支持上/下/左/右/对角线任意方向
- **距离感知**: 根据滑动距离智能调整变化幅度
- **防误触**: 500ms 超时过滤，避免误操作
- **模式记忆**: 学习到的手势持久保存到配置
- **预览反馈**: 设置面板实时显示已学习的手势方向

#### 4️⃣ 5 种精美配色主题
- **Ocean**: 蓝紫渐变，专业沉稳
- **Sunset**: 粉橙渐变，温暖活力
- **Forest**: 绿青渐变，自然清新
- **Midnight**: 深蓝渐变，夜间舒适
- **Neon**: 粉青霓虹，科技前卫

### ✨ Added
- Three.js 3D 渲染引擎集成
- 双模式架构 (Brightness/Volume)
- 手势学习算法
- 多主题系统
- 粒子特效系统
- 动态光照效果

### 🔧 Changed
- 全新的 UI 设计 (3D 球体 + 进度环)
- 设置面板重构 (更直观的布局)
- 手势检测引擎升级 (支持任意方向学习)
- IPC 通信优化 (新增 mode/control 接口)
- TypeScript 配置完善 (添加 THREE 类型)

### 📦 Files Added/Modified
```
新增:
- src/main/main.js (v3.0.0 重构)
- src/main/gesture-engine.js (新增学习功能)
- src/renderer/renderer.ts (Three.js 集成)
- src/renderer/index.html (新 UI 模板)
- package.json (添加 three@0.160.0)

更新:
- src/main/settings.js (扩展配置结构)
- src/main/preload.js (新增 API)
- tsconfig.renderer.json (添加 THREE 类型)
```

### 🌐 Cross-Platform Support
- **macOS**: DMG installer (Intel & Apple Silicon)
- **Windows**: Portable EXE (x64)
- **Linux**: AppImage (x64)

---

## [v2.1.0] - 2026-09-06

### ✨ Added Features
- Customizable Gesture Directions
- Adjustable Sensitivity
- Configurable Brightness Step
- Min/Max Brightness Limits
- Settings Panel UI
- Live Preview
- Toast Notifications
- Cross-platform builds

---

## [v2.0.0] - 2026-09-05

### ✨ Added
- Cross-platform support
- Python brightness bridge
- Real brightness control
- System tray integration
- Keyboard shortcuts
- Multi-language README

---

## [v1.1.0] - 2026-09-05

### 🐛 Fixed
- Fixed brightness not changing on macOS 26
- Resolved Quartz framework errors

---

## [v1.0.0] - 2026-09-05

### ✨ Added
- Initial release
- Trackpad swipe gestures
- Minimal floating window UI
- System tray support
- Keyboard shortcuts
