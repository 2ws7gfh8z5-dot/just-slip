# CHANGELOG

## [v2.1.0] - 2026-09-06

### ✨ Added
- **Customizable gesture directions**: Choose from Vertical (↑↓), Horizontal (←→), Diagonal (↗↙), or Any direction
- **Adjustable sensitivity**: Configure how much movement is needed to trigger a gesture (10-80px)
- **Configurable brightness step**: Set custom step sizes (1-20%) for finer control
- **Min/Max brightness limits**: Prevent brightness from going too low or high
- **Settings panel UI**: Built-in settings dialog accessible via gear icon
- **Live preview**: Real-time brightness preview while swiping
- **Toast notifications**: Visual feedback when settings are saved
- **Cross-platform builds**: macOS DMG, Windows EXE, Linux AppImage

### 🌐 Platforms Supported
- **macOS**: DMG installer (Intel & Apple Silicon) - 357 MB
- **Windows**: Portable EXE (x64) - 66 MB
- **Linux**: AppImage (x64) - 99 MB

### 🔧 Changed
- Improved gesture detection engine with support for multiple directions
- Settings persisted to disk and loaded on startup
- Enhanced renderer with full settings management
- Better TypeScript configuration

### 📦 Files
- Added `src/main/settings.js` - Settings manager
- Added `src/main/gesture-engine.js` - Gesture detection logic
- Updated `src/renderer/index.html` - Settings panel UI
- Updated `src/renderer/renderer.ts` - Gesture handling with settings
- Updated `src/main/main.js` - Integration with settings
- Updated `src/main/preload.js` - Exposed settings APIs
- Updated `package.json` - Version bump to 2.1.0

---

## [v2.0.0] - 2026-09-05

### ✨ Added
- **Cross-platform support**: macOS, Windows, Linux
- **Python brightness bridge**: Platform-specific brightness control scripts
- **Real brightness control**: Uses CAWindowServerDisplay on macOS 26+
- **System tray integration**: Runs in background
- **Keyboard shortcuts**: Cmd+Opt+↑/↓ on macOS, Ctrl+Alt+↑/↓ on Windows/Linux
- **Multi-language README**: 15 language variants

### 🐛 Fixed
- macOS 26 brightness API permission issues
- Removed deprecated brightness APIs

---

## [v1.1.0] - 2026-09-05

### 🐛 Fixed
- Fixed brightness not changing on macOS 26 by using CAWindowServerDisplay API
- Resolved Quartz framework permission denied errors

---

## [v1.0.0] - 2026-09-05

### ✨ Added
- Initial release
- Trackpad swipe gestures for brightness control
- Minimal floating window UI
- System tray support
- Keyboard shortcuts
