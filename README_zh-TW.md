# 🌐 語言選擇 | Language Selection | 言語選択

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

<a id="chinese-traditional"></a>

# Just Slip

[![最新版本](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![下載量](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![平台](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![許可證](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

使用觸控板手勢控制螢幕亮度。一個極簡的跨平台 Electron 應用。

## ✨ 功能特性

- **觸控板手勢**：上滑增加亮度，下滑降低亮度
- **鍵盤快捷鍵**：
  - macOS: `Cmd+Opt+↑/↓` 或 `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` 或 `Ctrl+Shift+↑/↓`
- **跨平台支援**：支援 macOS、Linux 和 Windows
- **系統托盤**：在背景安靜運行
- **極簡介面**：乾淨、不顯眼的亮度指示器

## 📦 安裝

### 下載預建構版本

訪問 [Releases 頁面](https://github.com/2ws7gfh8z5-dot/just-slip/releases) 下載適合的包：

| 平台 | 檔案格式 | 架構 |
|------|----------|------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### 從原始碼安裝

```bash
# 克隆倉庫
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# 安裝依賴
npm install

# 建構
npm run build

# 執行
npm start
```

### 建構發布包

```bash
# 建構所有平台
npm run package:all

# 或單獨建構
npm run package:mac    # macOS DMG
npm run package:win    # Windows 安裝程式
npm run package:linux  # Linux AppImage
```

## 🚀 使用方法

1. **啟動** Just Slip（macOS 從應用程式資料夾，Windows/Linux 從開始選單）
2. **首次執行**：根據提示授予輔助功能權限
   - macOS: `系統設定 → 隱私與安全性 → 輔助功能`
   - Windows: 無需額外權限
   - Linux: 可能需要 sudo 訪問 `/sys/class/backlight`
3. **調節亮度**：
   - 觸控板：上下滑動
   - 鍵盤：使用上述快捷鍵
   - 系統托盤：點擊圖示 → 亮度子選單

## 🐛 故障排除

### macOS 問題

- **亮度未變化**：確保 Just Slip 已在輔助功能權限中
- **Quartz 框架未找到**：確保已安裝 Xcode Command Line Tools：
  ```bash
  xcode-select --install
  ```

### Linux 問題

- **權限被拒絕**：將使用者新增到適當的群組或使用 `sudo`
- **xrandr 不可用**：安裝它：
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windows 問題

- **需要管理員權限**：以管理員身分執行以訪問 WMI
- **DDC/CI 支援**：安裝 [ddcutil](https://github.com/binhex/ddcutil) 控制外接顯示器

## 📄 許可證

MIT 許可證 - 詳見 [LICENSE](LICENSE)

## 🙏 致謝

- [Electron](https://www.electronjs.org/) 跨平台框架
- [pyobjc](https://pyobjc.readthedocs.io/) macOS Quartz 綁定
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) Linux 顯示控制

---

**由 [Huaziyi](https://github.com/2ws7gfh8z5-dot) 用 ❤️ 建構**
