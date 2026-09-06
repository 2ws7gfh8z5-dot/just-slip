# 🌐 Selezione lingua | Language Selection | 言語選択

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

<a id="italian"></a>

# Just Slip

[![Ultima versione](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Download](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Piattaforma](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Licenza](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Controlla la luminosità dello schermo con i gesti del trackpad. Un'applicazione Electron minimalista e multipiattaforma.

## ✨ Funzionalità

- **Gesti del trackpad**: Scorri verso l'alto per aumentare la luminosità, verso il basso per diminuire
- **Scorciatoie da tastiera**: 
  - macOS: `Cmd+Opt+↑/↓` oppure `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` oppure `Ctrl+Shift+↑/↓`
- **Multipiattaforma**: Funziona su macOS, Linux e Windows
- **Vassoio di sistema**: Esegue discretamente in background
- **UI minimalista**: Indicatore di luminosità pulito e discreto

## 📦 Installazione

### Scarica le versioni preconfezionate

Visita la [pagina dei Release](https://github.com/2ws7gfh8z5-dot/just-slip/releases) per scaricare il pacchetto adatto:

| Piattaforma | Formato file | Architettura |
|-------------|--------------|--------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Installa dal codice sorgente

```bash
# Clona il repository
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Installa le dipendenze
npm install

# Compila
npm run build

# Avvia
npm start
```

### Compila per la distribuzione

```bash
# Compila per tutte le piattaforme
npm run package:all

# Oppure compila per piattaforme specifiche
npm run package:mac    # macOS DMG
npm run package:win    # Installatore Windows
npm run package:linux  # Linux AppImage
```

## 🚀 Utilizzo

1. **Avvia** Just Slip dalla cartella Applicazioni (macOS) o Menu Start (Windows/Linux)
2. **Primo avvio**: Concedi i permessi di accessibilità quando richiesto
   - macOS: `Impostazioni di sistema → Privacy e sicurezza → Accessibilità`
   - Windows: Nessun permesso aggiuntivo richiesto
   - Linux: Potrebbe servire sudo per accedere a `/sys/class/backlight`
3. **Regola la luminosità**:
   - Trackpad: Scorri su/giù
   - Tastiera: Usa le scorciatoie indicate
   - Vassoio di sistema: Clicca sull'icona → Sottomenu luminosità

## 🐛 Risoluzione problemi

### Problemi macOS

- **La luminosità non cambia**: Assicurati che Just Slip sia nei permessi di accessibilità
- **Framework Quartz non trovato**: Assicurati di avere installati Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### Problemi Linux

- **Permesso negato**: Aggiungi il tuo utente al gruppo appropriato o usa `sudo`
- **xrandr non funziona**: Installalo:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Problemi Windows

- **Diritti di amministratore richiesti**: Esegui come amministratore per l'accesso WMI
- **Supporto DDC/CI**: Installa [ddcutil](https://github.com/binhex/ddcutil) per il controllo dei monitor esterni

## 📄 Licenza

Licenza MIT - vedi [LICENSE](LICENSE) per i dettagli

## 🙏 Ringraziamenti

- [Electron](https://www.electronjs.org/) per il framework multipiattaforma
- [pyobjc](https://pyobjc.readthedocs.io/) per i binding Quartz per macOS
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) per il controllo schermo Linux

---

**Costruito con ❤️ da [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
