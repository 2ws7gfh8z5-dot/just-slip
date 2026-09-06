# 🌐 Sprachauswahl | Language Selection | 言語選択

<div align="center">

| 🇺🇸 English | 🇨🇳 简体中文 | 🇹🇼 繁體中文 | 🇯🇵 日本語 | 🇰🇷 한국어 |
|:---:|:---:|:---:|:---:|:---:|
| [English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) |

| 🇪🇸 Español | 🇫🇷 Français | 🇩🇪 Deutsch | 🇷🇺 Русский | 🇧🇷 Português |
|:---:|:---:|:---:|:---:|:---:|
| [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md) | [Русский](README_ru.md) | [Português](README_pt-BR.md) |

| 🇮🇹 Italiano | 🇹🇷 Türkçe | 🇸🇦 العربية | 🇮🇳 हिन्दী | 🇻🇳 Tiếng Việt |
|:---:|:---:|:---:|:---:|:---:|
| [Italiano](README_it.md) | [Türkçe](README_tr.md) | [العربية](README_ar.md) | [हिन्दී](README_hi.md) | [Tiếng Việt](README_vi.md) |

</div>

---

<a id="german"></a>

# Just Slip

[![Neueste Version](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Downloads](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Plattform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Lizenz](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Steuern Sie die Bildschirmhelligkeit mit Trackpad-Gesten. Eine minimalistische plattformübergreifende Electron-Anwendung.

## ✨ Funktionen

- **Trackpad-Gesten**: Swipe nach oben für mehr Helligkeit, swipe nach unten für weniger
- **Tastenkombinationen**: 
  - macOS: `Cmd+Opt+↑/↓` oder `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` oder `Ctrl+Shift+↑/↓`
- **Plattformübergreifend**: Funktioniert auf macOS, Linux und Windows
- **System Tray**: Läuft unauffällig im Hintergrund
- **Minimalistische UI**: Sauberer, unauffälliger Helligkeitsindikator

## 📦 Installation

### Vorgebaute Releases herunterladen

Besuchen Sie die [Releases-Seite](https://github.com/2ws7gfh8z5-dot/just-slip/releases), um das passende Paket herunterzuladen:

| Plattform | Dateiformat | Architektur |
|-----------|-------------|-------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Aus dem Quellcode installieren

```bash
# Repository klonen
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Abhängigkeiten installieren
npm install

# Bauen
npm run build

# Starten
npm start
```

### Für die Verbreitung bauen

```bash
# Für alle Plattformen bauen
npm run package:all

# Oder einzeln bauen
npm run package:mac    # macOS DMG
npm run package:win    # Windows-Installer
npm run package:linux  # Linux AppImage
```

## 🚀 Verwendung

1. **Starten** Sie Just Slip aus Ihrem Applications-Ordner (macOS) oder Startmenü (Windows/Linux)
2. **Erster Start**: Erteilen Sie Zugänglichkeitsberechtigungen wenn aufgefordert
   - macOS: `Systemeinstellungen → Datenschutz & Sicherheit → Zugänglichkeit`
   - Windows: Keine zusätzlichen Berechtigungen erforderlich
   - Linux: Vielleicht sudo für Zugriff auf `/sys/class/backlight` benötigt
3. **Helligkeit anpassen**:
   - Trackpad: Hoch/runter swipen
   - Tastatur: Die oben genannten Kurzbefehle verwenden
   - System Tray: Auf das Symbol klicken → Helligkeits-Untermenü

## 🐛 Fehlerbehebung

### macOS-Probleme

- **Helligkeit ändert sich nicht**: Stellen Sie sicher, dass Just Slip in den Zugänglichkeitsberechtigungen ist
- **Quartz-Framework nicht gefunden**: Stellen Sie sicher, dass Sie Xcode Command Line Tools installiert haben:
  ```bash
  xcode-select --install
  ```

### Linux-Probleme

- **Berechtigung verweigert**: Fügen Sie Ihren Benutzer der entsprechenden Gruppe hinzu oder verwenden Sie `sudo`
- **xrandr funktioniert nicht**: Installieren Sie es:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windows-Probleme

- **Administratorrechte erforderlich**: Als Administrator ausführen für WMI-Zugriff
- **DDC/CI-Unterstützung**: Installieren Sie [ddcutil](https://github.com/binhex/ddcutil) für externe Monitorsteuerung

## 📄 Lizenz

MIT-Lizenz - siehe [LICENSE](LICENSE) für Details

## 🙏 Dank

- [Electron](https://www.electronjs.org/) für das plattformübergreifende Framework
- [pyobjc](https://pyobjc.readthedocs.io/) für macOS Quartz-Bindings
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) für Linux-Bildschirmsteuerung

---

**Gebaut mit ❤️ von [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
