# 🌐 Seleção de idioma | Language Selection | 言語選択

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

<a id="portuguese"></a>

# Just Slip

[![Última versão](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Downloads](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Plataforma](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Licença](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Controle o brilho da tela com gestos do trackpad. Um aplicativo Electron minimalista e multiplataforma.

## ✨ Recursos

- **Gestos do trackpad**: Deslize para cima para aumentar o brilho, para baixo para diminuir
- **Atalhos de teclado**: 
  - macOS: `Cmd+Opt+↑/↓` ou `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` ou `Ctrl+Shift+↑/↓`
- **Multiplataforma**: Funciona no macOS, Linux e Windows
- **Bandeja do sistema**: Executa discretamente em segundo plano
- **UI minimalista**: Indicador de brilho limpo e discreto

## 📦 Instalação

### Baixar versões pré-compiladas

Visite a [página de Releases](https://github.com/2ws7gfh8z5-dot/just-slip/releases) para baixar o pacote apropriado:

| Plataforma | Formato do arquivo | Arquitetura |
|------------|-------------------|-------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Instalar do código-fonte

```bash
# Clone o repositório
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Instale as dependências
npm install

# Compile
npm run build

# Execute
npm start
```

### Compilar para distribuição

```bash
# Compile para todas as plataformas
npm run package:all

# Ou compile para plataformas específicas
npm run package:mac    # macOS DMG
npm run package:win    # Instalador Windows
npm run package:linux  # Linux AppImage
```

## 🚀 Uso

1. **Inicie** o Just Slip na pasta Aplicações (macOS) ou Menu Iniciar (Windows/Linux)
2. **Primeira execução**: Conceda permissões de acessibilidade quando solicitado
   - macOS: `Configurações do Sistema → Privacidade e Segurança → Acessibilidade`
   - Windows: Nenhuma permissão adicional necessária
   - Linux: Pode precisar de sudo para acessar `/sys/class/backlight`
3. **Ajustar o brilho**:
   - Trackpad: Deslizar para cima/baixo
   - Teclado: Usar os atalhos mencionados
   - Bandeja do sistema: Clicar no ícone → Submenu de brilho

## 🐛 Solução de problemas

### Problemas no macOS

- **Brilho não muda**: Certifique-se de que o Just Slip está nas permissões de acessibilidade
- **Framework Quartz não encontrado**: Certifique-se de ter instalado as Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### Problemas no Linux

- **Permissão negada**: Adicione seu usuário ao grupo apropriado ou use `sudo`
- **xrandr não funciona**: Instale-o:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Problemas no Windows

- **Direitos de administrador necessários**: Execute como administrador para acesso WMI
- **Suporte DDC/CI**: Instale [ddcutil](https://github.com/binhex/ddcutil) para controle de monitores externos

## 📄 Licença

Licença MIT - veja [LICENSE](LICENSE) para detalhes

## 🙏 Agradecimentos

- [Electron](https://www.electronjs.org/) pelo framework multiplataforma
- [pyobjc](https://pyobjc.readthedocs.io/) pelos bindings Quartz para macOS
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) pelo controle de tela Linux

---

**Construído com ❤️ por [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
