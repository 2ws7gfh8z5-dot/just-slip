# Just Slip v3.0.0

[![Latest Version](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Downloads](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![License](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)
[![Three.js](https://img.shields.io/badge/3D-Three.js-green)](https://threejs.org/)

**Control screen brightness AND volume with customizable trackpad gestures. Features a stunning Three.js 3D interface with learning capabilities.**

## ✨ What's New in v3.0.0

### 🎮 Three.js 3D Interface
- Interactive 3D sphere that responds to your actions
- Dynamic particle effects and lighting
- Smooth animations and transitions
- Beautiful gradient colors that change with value

### 🎛️ Dual Mode Control
- **Brightness Mode**: Control screen brightness (0-100%)
- **Volume Mode**: Control system volume (0-100%)
- One-click switching between modes

### 🧠 Smart Gesture Learning
- **Auto-Learn**: Just swipe once and the app learns your gesture pattern
- **Direction Aware**: Works with any swipe direction
- **Distance Based**: Larger swipes = bigger changes
- **Memory**: Remembers your learned gestures forever

### 🎨 5 Beautiful Themes
- **Ocean** - Blue-purple gradient (default)
- **Sunset** - Pink-orange gradient
- **Forest** - Green-cyan gradient
- **Midnight** - Deep blue gradient
- **Neon** - Cyberpunk pink-cyan

## 📦 Installation

### Download Pre-built Releases

| Platform | File | Size | Download |
|----------|------|------|----------|
| **macOS** | `.dmg` | 450 MB | [Download](https://github.com/2ws7gfh8z5-dot/just-slip/releases/download/v3.0.0/Just-Slip-v3.0.0-mac.dmg) |
| **Windows** | `.exe` | 80 MB | [Download](https://github.com/2ws7gfh8z5-dot/just-slip/releases/download/v3.0.0/Just-Slip-3.0.0-windows-x64.exe) |
| **Linux** | `.AppImage` | 120 MB | [Download](https://github.com/2ws7gfh8z5-dot/just-slip/releases/download/v3.0.0/Just-Slip-3.0.0-linux-x64.AppImage) |

### Install from Source

```bash
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip
npm install
npm run build
npm start
```

## 🚀 Usage

### Basic Controls
1. **Launch** Just Slip from Applications (macOS) or Start Menu (Windows/Linux)
2. **First run**: Grant accessibility permissions when prompted
3. **Adjust**: Swipe on trackpad or use keyboard shortcuts

### Keyboard Shortcuts
- **Increase**: `Cmd+Opt+↑` (macOS) / `Ctrl+Alt+↑` (Windows/Linux)
- **Decrease**: `Cmd+Opt+↓` (macOS) / `Ctrl+Alt+↓` (Windows/Linux)

### Gesture Learning
1. Open **Settings** (gear icon)
2. Enable **"Learn from First Swipe"**
3. Perform your desired swipe gesture
4. The app remembers this gesture pattern forever

### Switching Modes
- Click **☀️ Brightness** or **🔊 Volume** button in top-left
- Each mode has independent settings

### Changing Themes
1. Open Settings
2. Click any theme color square
3. Changes apply immediately

## 📁 Settings

### Gesture Settings
- **Direction**: Vertical / Horizontal / Diagonal / Any
- **Sensitivity**: 10-80px threshold
- **Learn Mode**: Auto-detect and remember your gestures

### Brightness Settings
- **Step Size**: 1-20% per gesture
- **Min/Max**: Set brightness limits

### Volume Settings
- **Step Size**: 1-20% per gesture
- **Min/Max**: Set volume limits

### Theme Options
- 5 pre-configured color schemes
- Apply instantly without restart

## 🐛 Troubleshooting

### macOS Issues
- **Volume not working**: Ensure Just Slip is in Accessibility permissions
- **3D not rendering**: Ensure Metal is enabled (default on modern Macs)
- **Quartz errors**: Make sure Xcode Command Line Tools are installed:
  ```bash
  xcode-select --install
  ```

### Windows Issues
- **Volume not working**: Run as administrator for WMI access
- **DDC/CI support**: Install [ddcutil](https://github.com/binhex/ddcutil) for external monitor control

### Linux Issues
- **Permissions denied**: Add user to appropriate group or use `sudo`
- **Volume control**: May need `amixer` or `pactl` depending on audio system

## 🔧 Technical Details

### Architecture
- **Main Process**: Electron + Node.js
- **Renderer**: TypeScript + Three.js r128
- **Backend**: Python brightness.py bridge
- **Storage**: JSON config in `~/Library/Application Support/Just Slip/`

### Dependencies
- Electron 28.x
- Three.js 0.160.0
- Python 3.x with pyobjc (macOS)

### File Structure
```
just-slip/
├── src/
│   ├── main/
│   │   ├── main.js          # Main process entry
│   │   ├── settings.js      # Settings manager
│   │   ├── gesture-engine.js # Gesture detection & learning
│   │   ├── brightness.py    # Cross-platform brightness control
│   │   └── preload.js       # IPC bridge
│   └── renderer/
│       ├── index.html       # 3D UI template
│       └── renderer.ts      # Three.js + UI logic
├── dist/                    # Compiled output
└── release/                 # Built packages
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/) for cross-platform framework
- [Three.js](https://threejs.org/) for 3D rendering
- [pyobjc](https://pyobjc.readthedocs.io/) for macOS Quartz bindings
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) for Linux display control

---

**Built with ❤️ and Three.js by [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
