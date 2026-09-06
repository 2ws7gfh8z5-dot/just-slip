# 🌐 Chọn ngôn ngữ | Language Selection | 言語選択

<div align="center">

| 🇺🇸 English | 🇨🇳 简体中文 | 🇹🇼 繁體中文 | 🇯🇵 日本語 | 🇰🇷 한국어 |
|:---:|:---:|:---:|:---:|:---:|
| [English](README.md) | [简体中文](README_zh-CN.md) | [繁体中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) |

| 🇪🇸 Español | 🇫🇷 Français | 🇩🇪 Deutsch | 🇷🇺 Русский | 🇧🇷 Português |
|:---:|:---:|:---:|:---:|:---:|
| [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md) | [Русский](README_ru.md) | [Português](README_pt-BR.md) |

| 🇮🇹 Italiano | 🇹🇷 Türkçe | 🇸🇦 العربية | 🇮🇳 हिन्दी | 🇻🇳 Tiếng Việt |
|:---:|:---:|:---:|:---:|:---:|
| [Italiano](README_it.md) | [Türkçe](README_tr.md) | [العربية](README_ar.md) | [हिन्दी](README_hi.md) | [Tiếng Việt](README_vi.md) |

</div>

---

<a id="vietnamese"></a>

# Just Slip

[![Phiên bản mới nhất](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Tải xuống](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Nền tảng](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Giấy phép](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Điều chỉnh độ sáng màn hình bằng cử chỉ touchpad. Một ứng dụng Electron đa nền tảng tối giản.

## ✨ Tính năng

- **Cử chỉ touchpad**: Vuốt lên để tăng độ sáng, vuốt xuống để giảm
- **Phím tắt bàn phím**: 
  - macOS: `Cmd+Opt+↑/↓` hoặc `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` hoặc `Ctrl+Shift+↑/↓`
- **Đa nền tảng**: Hoạt động trên macOS, Linux và Windows
- **System tray**: Chạy tĩnh lặng ở chế độ nền
- **Giao diện tối giản**: Hiển thị độ sáng gọn gàng, không gây chú ý

## 📦 Cài đặt

### Tải bản dựng sẵn

Truy cập [trang Releases](https://github.com/2ws7gfh8z5-dot/just-slip/releases) để tải gói phù hợp:

| Nền tảng | Định dạng file | Kiến trúc |
|----------|----------------|-----------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Cài đặt từ mã nguồn

```bash
# Sao chép repository
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Cài đặt dependencies
npm install

# Build
npm run build

# Chạy
npm start
```

### Build để phân phối

```bash
# Build cho tất cả nền tảng
npm run package:all

# Hoặc build cho từng nền tảng
npm run package:mac    # macOS DMG
npm run package:win    # Windows Installer
npm run package:linux  # Linux AppImage
```

## 🚀 Sử dụng

1. **Khởi động** Just Slip từ thư mục Applications (macOS) hoặc Start Menu (Windows/Linux)
2. **Lần chạy đầu tiên**: Cấp quyền accessibility khi được yêu cầu
   - macOS: `System Settings → Privacy & Security → Accessibility`
   - Windows: Không cần quyền bổ sung
   - Linux: Có thể cần sudo để truy cập `/sys/class/backlight`
3. **Điều chỉnh độ sáng**:
   - Touchpad: Vuốt lên/xuống
   - Bàn phím: Sử dụng các phím tắt được liệt kê
   - System tray: Nhấp vào biểu tượng → Menu phụ độ sáng

## 🐛 Khắc phục sự cố

### Vấn đề macOS

- **Độ sáng không thay đổi**: Đảm bảo Just Slip đã có trong quyền accessibility
- **Không tìm thấy framework Quartz**: Đảm bảo đã cài đặt Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### Vấn đề Linux

- **Bị từ chối quyền**: Thêm người dùng vào nhóm phù hợp hoặc dùng `sudo`
- **xrandr không hoạt động**: Cài đặt nó:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Vấn đề Windows

- **Yêu cầu quyền admin**: Chạy dưới quyền admin để truy cập WMI
- **Hỗ trợ DDC/CI**: Cài đặt [ddcutil](https://github.com/binhex/ddcutil) để điều khiển màn hình ngoài

## 📄 Giấy phép

Giấy phép MIT - xem [LICENSE](LICENSE) để biết chi tiết

## 🙏 Lời cảm ơn

- [Electron](https://www.electronjs.org/) cho framework đa nền tảng
- [pyobjc](https://pyobjc.readthedocs.io/) cho bindings Quartz macOS
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) cho điều khiển màn hình Linux

---

**Được xây dựng bằng ❤️ bởi [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
