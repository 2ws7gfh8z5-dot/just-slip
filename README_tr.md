# 🌐 Dilim seçimi | Language Selection | 言語選択

<div align="center">

| 🇺🇸 English | 🇨🇳 简体中文 | 🇹🇼 繁體中文 | 🇯🇵 日本語 | 🇰🇷 한국어 |
|:---:|:---:|:---:|:---:|:---:|
| [English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) |

| 🇪🇸 Español | 🇫🇷 Français | 🇩🇪 Deutsch | 🇷🇺 Русский | 🇧🇷 Português |
|:---:|:---:|:---:|:---:|:---:|
| [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md) | [Русский](README_ru.md) | [Português](README_pt-BR.md) |

| 🇮🇹 Italiano | 🇹🇷 Türkçe | 🇸🇦 العربية | 🇮🇳 हिंदी | 🇻🇳 Tiếng Việt |
|:---:|:---:|:---:|:---:|:---:|
| [Italiano](README_it.md) | [Türkçe](README_tr.md) | [العربية](README_ar.md) | [हिंदी](README_hi.md) | [Tiếng Việt](README_vi.md) |

</div>

---

<a id="turkish"></a>

# Just Slip

[![Son Sürüm](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![İndirmeler](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Lisans](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Trackpad hareketleriyle ekran parlaklığını kontrol edin. Minimalist, çapraz platformlu bir Electron uygulaması.

## ✨ Özellikler

- **Trackpad Hareketleri**: Parlaklığı artırmak için yukarı, azaltmak için aşağı kaydırın
- **Klavye Kısayolları**: 
  - macOS: `Cmd+Opt+↑/↓` veya `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` veya `Ctrl+Shift+↑/↓`
- **Çapraz Platform Desteği**: macOS, Linux ve Windows'ta çalışır
- **Sistem Tepsisi**: Arka planda sessizce çalışır
- **Minimalist UI**: Temiz, dikkat çekmeyen parlaklık göstergesi

## 📦 Yükleme

### Önceden Derlenmiş Sürümleri İndirin

Uygun paketi indirmek için [Releases sayfasına](https://github.com/2ws7gfh8z5-dot/just-slip/releases) gidin:

| Platform | Dosya Formatı | Mimari |
|----------|---------------|--------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Kaynak Kodundan Yükleme

```bash
# Deposu klonlayın
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Bağımlılıkları yükleyin
npm install

# Derleyin
npm run build

# Çalıştırın
npm start
```

### Dağıtım İçin Derleme

```bash
# Tüm platformlar için derleyin
npm run package:all

# Veya tek tek derleyin
npm run package:mac    # macOS DMG
npm run package:win    # Windows Yükleyicisi
npm run package:linux  # Linux AppImage
```

## 🚀 Kullanım

1. **Başlat** Just Slip'i Uygulamalar klasöründen (macOS) veya Başlat menüsünden (Windows/Linux)
2. **İlk çalışma**: İstendiğinde erişilebilirlik izinlerini verin
   - macOS: `Sistem Ayarları → Gizlilik ve Güvenlik → Erişilebilirlik`
   - Windows: Ek izin gerekmez
   - Linux: `/sys/class/backlight` erişimi için sudo gerekebilir
3. **Parlaklığı ayarlayın**:
   - Trackpad: Yukarı/aşağı kaydırma
   - Klavye: Yukarıda belirtilen kısayolları kullanın
   - Sistem tepsisi: Simgeye tıklayın → Parlaklık alt menüsü

## 🐛 Sorun Giderme

### macOS Sorunları

- **Parlaklık değişmiyor**: Just Slip'in erişilebilirlik izinlerinde olduğundan emin olun
- **Quartz framework bulunamadı**: Xcode Command Line Tools'un yüklü olduğundan emin olun:
  ```bash
  xcode-select --install
  ```

### Linux Sorunları

- **İzin reddedildi**: Kullanıcınızı uygun gruba ekleyin veya `sudo` kullanın
- **xrandr çalışmıyor**: Yükleyin:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windows Sorunları

- **Yönetici hakları gerekli**: WMI erişimi için yönetici olarak çalıştırın
- **DDC/CI Desteği**: Harici monitör kontrolü için [ddcutil](https://github.com/binhex/ddcutil) yükleyin

## 📄 Lisans

MIT Lisansı - detaylar için [LICENSE](LICENSE) bakın

## 🙏 Teşekkürler

- [Electron](https://www.electronjs.org/) çapraz platform çerçevesi için
- [pyobjc](https://pyobjc.readthedocs.io/) macOS Quartz bağlamaları için
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) Linux ekran kontrolü için

---

**[Huaziyi](https://github.com/2ws7gfh8z5-dot) tarafından ❤️ ile yapıldı**
