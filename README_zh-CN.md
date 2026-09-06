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

<a id="chinese-simplified"></a>

# Just Slip

[![最新版本](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![下载量](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![平台](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![许可证](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

使用触控板手势控制屏幕亮度。一个极简的跨平台 Electron 应用。

## ✨ 功能特性

- **触控板手势**：上滑增加亮度，下滑降低亮度
- **键盘快捷键**：
  - macOS: `Cmd+Opt+↑/↓` 或 `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` 或 `Ctrl+Shift+↑/↓`
- **跨平台支持**：支持 macOS、Linux 和 Windows
- **系统托盘**：在后台安静运行
- **极简界面**：干净、不显眼的亮度指示器

## 📦 安装

### 下载预构建版本

访问 [Releases 页面](https://github.com/2ws7gfh8z5-dot/just-slip/releases) 下载适合的包：

| 平台 | 文件格式 | 架构 |
|------|----------|------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### 从源码安装

```bash
# 克隆仓库
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# 安装依赖
npm install

# 构建
npm run build

# 运行
npm start
```

### 构建发布包

```bash
# 构建所有平台
npm run package:all

# 或单独构建
npm run package:mac    # macOS DMG
npm run package:win    # Windows 安装程序
npm run package:linux  # Linux AppImage
```

## 🚀 使用方法

1. **启动** Just Slip（macOS 从应用程序文件夹，Windows/Linux 从开始菜单）
2. **首次运行**：根据提示授予辅助功能权限
   - macOS: `系统设置 → 隐私与安全性 → 辅助功能`
   - Windows: 无需额外权限
   - Linux: 可能需要 sudo 访问 `/sys/class/backlight`
3. **调节亮度**：
   - 触控板：上下滑动
   - 键盘：使用上述快捷键
   - 系统托盘：点击图标 → 亮度子菜单

## 🐛 故障排除

### macOS 问题

- **亮度未变化**：确保 Just Slip 已在辅助功能权限中
- **Quartz 框架未找到**：确保已安装 Xcode Command Line Tools：
  ```bash
  xcode-select --install
  ```

### Linux 问题

- **权限被拒绝**：将用户添加到适当的组或使用 `sudo`
- **xrandr 不可用**：安装它：
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windows 问题

- **需要管理员权限**：以管理员身份运行以访问 WMI
- **DDC/CI 支持**：安装 [ddcutil](https://github.com/binhex/ddcutil) 控制外接显示器

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

## 🙏 致谢

- [Electron](https://www.electronjs.org/) 跨平台框架
- [pyobjc](https://pyobjc.readthedocs.io/) macOS Quartz 绑定
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) Linux 显示控制

---

**由 [Huaziyi](https://github.com/2ws7gfh8z5-dot) 用 ❤️ 构建**
