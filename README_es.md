# 🌐 Selección de idioma | Language Selection | 言語選択

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

<a id="spanish"></a>

# Just Slip

[![Última versión](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Descargas](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Plataforma](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Licencia](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Controla el brillo de la pantalla con gestos del trackpad. Una aplicación Electron minimalista y multiplataforma.

## ✨ Características

- **Gestos del trackpad**: Desliza hacia arriba para aumentar el brillo, hacia abajo para disminuir
- **Atajos de teclado**: 
  - macOS: `Cmd+Opt+↑/↓` o `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` o `Ctrl+Shift+↑/↓`
- **Multiplataforma**: Funciona en macOS, Linux y Windows
- **Bandeja del sistema**: Se ejecuta discretamente en segundo plano
- **UI minimalista**: Indicador de brillo limpio y discreto

## 📦 Instalación

### Descargar versiones preconstruidas

Visita la [página de Releases](https://github.com/2ws7gfh8z5-dot/just-slip/releases) para descargar el paquete adecuado:

| Plataforma | Formato de archivo | Arquitectura |
|------------|-------------------|--------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Instalar desde el código fuente

```bash
# Clonar el repositorio
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Instalar dependencias
npm install

# Compilar
npm run build

# Ejecutar
npm start
```

### Compilar para distribución

```bash
# Compilar para todas las plataformas
npm run package:all

# O compilar para plataformas específicas
npm run package:mac    # macOS DMG
npm run package:win    # Instalador de Windows
npm run package:linux  # Linux AppImage
```

## 🚀 Uso

1. **Iniciar** Just Slip desde tu carpeta de Aplicaciones (macOS) o Menú Inicio (Windows/Linux)
2. **Primera ejecución**: Concede permisos de accesibilidad cuando se te solicite
   - macOS: `Ajustes del sistema → Privacidad y seguridad → Accesibilidad`
   - Windows: No se necesitan permisos adicionales
   - Linux: Puede necesitar sudo para acceder a `/sys/class/backlight`
3. **Ajustar el brillo**:
   - Trackpad: Desliza arriba/abajo
   - Teclado: Usa los atajos mencionados
   - Bandeja del sistema: Haz clic en el ícono → Submenú de brillo

## 🐛 Solución de problemas

### Problemas en macOS

- **El brillo no cambia**: Asegúrate de que Just Slip esté en los permisos de accesibilidad
- **Framework Quartz no encontrado**: Asegúrate de tener instaladas las Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### Problemas en Linux

- **Permiso denegado**: Agrega tu usuario al grupo correspondiente o usa `sudo`
- **xrandr no funciona**: Instálalo:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Problemas en Windows

- **Se requieren derechos de administrador**: Ejecuta como administrador para acceder a WMI
- **Soporte DDC/CI**: Instala [ddcutil](https://github.com/binhex/ddcutil) para controlar monitores externos

## 📄 Licencia

Licencia MIT - ver [LICENSE](LICENSE) para más detalles

## 🙏 Agradecimientos

- [Electron](https://www.electronjs.org/) por el framework multiplataforma
- [pyobjc](https://pyobjc.readthedocs.io/) por las vinculaciones de Quartz para macOS
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) por el control de pantalla en Linux

---

**Construido con ❤️ por [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
