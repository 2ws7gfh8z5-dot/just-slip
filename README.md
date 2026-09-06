# 🌐 语言选择 | Language Selection | 言語選択

<div align="center">

| 🇺🇸 English | 🇨🇳 简体中文 | 🇹🇼 繁體中文 | 🇯🇵 日本語 | 🇰🇷 한국어 |
|:---:|:---:|:---:|:---:|:---:|
| [English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) |

| 🇪🇸 Español | 🇫🇷 Français | 🇩🇪 Deutsch | 🇷🇺 Русский | 🇧🇷 Português |
|:---:|:---:|:---:|:---:|:---:|
| [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md) | [Русский](README_ru.md) | [Português](README_pt-BR.md) |

| 🇮🇹 Italiano | 🇹🇷 Türkçe | 🇸🇦 العربية | 🇮🇳 हिन्दी | 🇻🇳 Tiếng Việt |
|:---:|:---:|:---:|:---:|:---:|
| [Italiano](README_it.md) | [Türkçe](README_tr.md) | [العربية](README_ar.md) | [हिन्दी](README_hi.md) | [Tiếng Việt](README_vi.md) |

</div>

---

<a id="english"></a>

# Just Slip

[![Latest Version](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Downloads](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![License](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Control screen brightness with trackpad gestures. A minimal, cross-platform Electron application.

## ✨ Features

- **Trackpad Gestures**: Swipe up to increase brightness, swipe down to decrease
- **Keyboard Shortcuts**: 
  - macOS: `Cmd+Opt+↑/↓` or `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` or `Ctrl+Shift+↑/↓`
- **Cross-Platform**: Works on macOS, Linux, and Windows
- **System Tray**: Runs unobtrusively in the background
- **Minimal UI**: Clean, unobtrusive brightness indicator

## 📦 Installation

### Download Pre-built Releases

Visit the [Releases page](https://github.com/2ws7gfh8z5-dot/just-slip/releases) to download the appropriate package:

| Platform | File Format | Architecture |
|----------|-------------|--------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Install from Source

```bash
# Clone the repository
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Install dependencies
npm install

# Build
npm run build

# Run
npm start
```

### Build for Distribution

```bash
# Build for all platforms
npm run package:all

# Or build for specific platform
npm run package:mac    # macOS DMG
npm run package:win    # Windows Installer
npm run package:linux  # Linux AppImage
```

## 🚀 Usage

1. **Launch** Just Slip from your Applications folder (macOS) or Start Menu (Windows/Linux)
2. **First run**: Grant accessibility permissions when prompted
   - macOS: `System Settings → Privacy & Security → Accessibility`
   - Windows: No additional permissions needed
   - Linux: May need sudo for `/sys/class/backlight` access
3. **Adjust brightness** using:
   - Trackpad: Swipe up/down
   - Keyboard: Use the shortcuts listed above
   - System tray: Click the icon → Brightness submenu

## 🐛 Troubleshooting

### macOS Issues

- **Brightness not changing**: Ensure Just Slip is in Accessibility permissions
- **Quartz framework not found**: Make sure you have Xcode Command Line Tools installed:
  ```bash
  xcode-select --install
  ```

### Linux Issues

- **Permissions denied**: Add your user to the appropriate group or use `sudo`
- **xrandr not working**: Install it:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windows Issues

- **Admin rights required**: Run as administrator for WMI access
- **DDC/CI support**: Install [ddcutil](https://github.com/binhex/ddcutil) for external monitor control

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/) for the cross-platform framework
- [pyobjc](https://pyobjc.readthedocs.io/) for macOS Quartz bindings
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) for Linux display control

---

**Built with ❤️ by [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
