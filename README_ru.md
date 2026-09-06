# 🌐 Выбор языка | Language Selection | 言語選択

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

<a id="russian"></a>

# Just Slip

[![Последняя версия](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Загрузки](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![Платформа](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![Лицензия](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

Управление яркостью экрана жестами тачпада. Минималистичное кроссплатформенное приложение на Electron.

## ✨ Особенности

- **Жесты тачпада**: Проведите вверх для увеличения яркости, вниз для уменьшения
- **Горячие клавиши**: 
  - macOS: `Cmd+Opt+↑/↓` или `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` или `Ctrl+Shift+↑/↓`
- **Кроссплатформенность**: Работает на macOS, Linux и Windows
- **Системный трей**: Работает незаметно в фоне
- **Минималистичный UI**: Чистый, ненавязчивый индикатор яркости

## 📦 Установка

### Скачать готовые релизы

Посетите [страницу релизов](https://github.com/2ws7gfh8z5-dot/just-slip/releases) для загрузки подходящего пакета:

| Платформа | Формат файла | Архитектура |
|-----------|--------------|-------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### Установка из исходного кода

```bash
# Клонируйте репозиторий
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# Установите зависимости
npm install

# Соберите
npm run build

# Запустите
npm start
```

### Сборка для распространения

```bash
# Собрать для всех платформ
npm run package:all

# Или собрать для конкретных платформ
npm run package:mac    # macOS DMG
npm run package:win    # Установщик Windows
npm run package:linux  # Linux AppImage
```

## 🚀 Использование

1. **Запустите** Just Slip из папки Приложения (macOS) или Меню Пуск (Windows/Linux)
2. **Первый запуск**: Предоставьте разрешения на доступность при запросе
   - macOS: `Системные настройки → Конфиденциальность и безопасность → Доступность`
   - Windows: Дополнительные разрешения не требуются
   - Linux: Может потребоваться sudo для доступа к `/sys/class/backlight`
3. **Регулировка яркости**:
   - Тачпад: Проведите вверх/вниз
   - Клавиатура: Используйте указанные горячие клавиши
   - Системный трей: Щелкните на значок → Подменю яркости

## 🐛 Устранение неисправностей

### Проблемы macOS

- **Яркость не меняется**: Убедитесь, что Just Slip добавлен в разрешения доступности
- **Фреймворк Quartz не найден**: Убедитесь, что установлены Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### Проблемы Linux

- **Отказано в доступе**: Добавьте пользователя в соответствующую группу или используйте `sudo`
- **xrandr не работает**: Установите его:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Проблемы Windows

- **Требуется права администратора**: Запустите от имени администратора для доступа к WMI
- **Поддержка DDC/CI**: Установите [ddcutil](https://github.com/binhex/ddcutil) для управления внешними мониторами

## 📄 Лицензия

Лицензия MIT - см. [LICENSE](LICENSE) для подробностей

## 🙏 Благодарности

- [Electron](https://www.electronjs.org/) за кроссплатформенный фреймворк
- [pyobjc](https://pyobjc.readthedocs.io/) за привязки Quartz для macOS
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) за управление экраном Linux

---

**Создано с ❤️ [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
