# 🌐 Choix de langue | Language Selection | 言語選択

<div align="center">

| 🇺🇸 English | 🇨🇳 简体中文 | 🇹🇼 繁體中文 | 🇯🇵 日本語 | 🇰🇷 한국어 |
|:---:|:---:|:---:|:---:|:---:|
| [English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) |

| 🇪🇸 Español | 🇫🇷 Français | 🇩🇪 Deutsch | 🇷🇺 Русский | 🇧🇷 Português |
|:---:|:---:|:---:|:---:|:---:|
| [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md) | [Русский](README_ru.md) | [Português](README_pt-BR.md) |

| 🇮🇹 Italiano | 🇹🇷 Türkçe | 🇸🇦 العربية | 🇮🇳 हिन्दী | 🇻🇳 Tiếng Việt |
|:---:|:---:|:---:|:---:|:---:|
| [Italiano](README_it.md) | [Türkçe](README_tr.md) | [العربية](README_ar.md) | [हिन्दୀ](README_hi.md) | [Tiếng Việt](README_vi.md) |

</div>

---

<a id="french"></a>

# Just Slip

[![Dernière version](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Téléchargements](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Plateforme](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Licence](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Contrôlez la luminosité de l'écran avec des gestes du pavé tactile. Une application Electron minimaliste et multiplateforme.

## ✨ Fonctionnalités

- **Gestes du pavé tactile** : Glissez vers le haut pour augmenter la luminosité, vers le bas pour diminuer
- **Raccourcis clavier** : 
  - macOS : `Cmd+Opt+↑/↓` ou `Cmd+Shift+↑/↓`
  - Windows/Linux : `Ctrl+Alt+↑/↓` ou `Ctrl+Shift+↑/↓`
- **Multiplateforme** : Fonctionne sur macOS, Linux et Windows
- **Barre de système** : S'exécute discrètement en arrière-plan
- **Interface minimaliste** : Indicateur de luminosité propre et discret

## 📦 Installation

### Télécharger les versions préconstruites

Visitez la [page des Releases](https://github.com/2ws7gfh8z5-dot/just-slip/releases) pour télécharger le package approprié :

| Plateforme | Format de fichier | Architecture |
|------------|-------------------|--------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Installer depuis les sources

```bash
# Cloner le dépôt
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Installer les dépendances
npm install

# Compiler
npm run build

# Exécuter
npm start
```

### Compiler pour la distribution

```bash
# Compiler pour toutes les plateformes
npm run package:all

# Ou compiler pour des plateformes spécifiques
npm run package:mac    # macOS DMG
npm run package:win    # Installateur Windows
npm run package:linux  # Linux AppImage
```

## 🚀 Utilisation

1. **Lancer** Just Slip depuis votre dossier Applications (macOS) ou Menu Démarrer (Windows/Linux)
2. **Premier lancement** : Accordez les permissions d'accessibilité lorsque demandé
   - macOS : `Réglages système → Confidentialité et sécurité → Accessibilité`
   - Windows : Aucune permission supplémentaire requise
   - Linux : Peut nécessiter sudo pour accéder à `/sys/class/backlight`
3. **Ajuster la luminosité** :
   - Pavé tactile : Glisser haut/bas
   - Clavier : Utiliser les raccourcis mentionnés
   - Barre de système : Cliquer sur l'icône → Sous-menu luminosité

## 🐛 Dépannage

### Problèmes macOS

- **La luminosité ne change pas** : Assurez-vous que Just Slip est dans les permissions d'accessibilité
- **Framework Quartz introuvable** : Assurez-vous d'avoir installé les Xcode Command Line Tools :
  ```bash
  xcode-select --install
  ```

### Problèmes Linux

- **Permission refusée** : Ajoutez votre utilisateur au groupe approprié ou utilisez `sudo`
- **xrandr ne fonctionne pas** : Installez-le :
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Problèmes Windows

- **Droits administrateur requis** : Exécutez en tant qu'administrateur pour accéder à WMI
- **Support DDC/CI** : Installez [ddcutil](https://github.com/binhex/ddcutil) pour contrôler les moniteurs externes

## 📄 Licence

Licence MIT - voir [LICENSE](LICENSE) pour plus de détails

## 🙏 Remerciements

- [Electron](https://www.electronjs.org/) pour le framework multiplateforme
- [pyobjc](https://pyobjc.readthedocs.io/) pour les liaisons Quartz macOS
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) pour le contrôle d'écran Linux

---

**Construit avec ❤️ par [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
