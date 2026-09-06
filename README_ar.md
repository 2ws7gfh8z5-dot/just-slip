# 🌐 اختيار اللغة | Language Selection | 言語選択

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

<a id="arabic"></a>

# Just Slip

[![أحدث إصدار](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![التحميلات](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![المنصة](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![الترخيص](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

تحكم في سطوع الشاشة بحركات لوحة اللمس. تطبيق Electron متعدد المنصات وبسيط.

## ✨ الميزات

- **حركات لوحة اللمس**: مرر لأعلى لزيادة السطوع، ومرر لأسفل لتقليله
- **اختصارات لوحة المفاتيح**: 
  - macOS: `Cmd+Opt+↑/↓` أو `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` أو `Ctrl+Shift+↑/↓`
- **متعدد المنصات**: يعمل على macOS و Linux و Windows
- **شريط النظام**: يعمل بهدوء في الخلفية
- **واجهة بسيطة**: مؤشر سطوع نظيف وغير مزعج

## 📦 التثبيت

### تحميل الإصدارات الجاهزة

قم بزيارة [صفحة الإصدارات](https://github.com/2ws7gfh8z5-dot/just-slip/releases) لتحميل الحزمة المناسبة:

| المنصة | تنسيق الملف | البنية |
|--------|------------|--------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### التثبيت من الكود المصدري

```bash
# انسخ المستودع
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# ثبت التبعيات
npm install

# ابنِ
npm run build

# شغّل
npm start
```

### البناء للتوزيع

```bash
# ابنِ لكل المنصات
npm run package:all

# أو ابنِ لمنصات محددة
npm run package:mac    # macOS DMG
npm run package:win    # مثبت Windows
npm run package:linux  # Linux AppImage
```

## 🚀 الاستخدام

1. **تشغيل** Just Slip من مجلد التطبيقات (macOS) أو قائمة ابدأ (Windows/Linux)
2. **أول تشغيل**: امنح أذونات الوصول عند الطلب
   - macOS: `الإعدادات → الخصوصية والأمان → الوصول`
   - Windows: لا تحتاج إلى أذونات إضافية
   - Linux: قد تحتاج sudo للوصول إلى `/sys/class/backlight`
3. **ضبط السطوع**:
   - لوحة اللمس: تمرير لأعلى/لأسفل
   - لوحة المفاتيح: استخدم الاختصارات المذكورة
   - شريط النظام: انقر على الأيقونة → قائمة السطوع الفرعية

## 🐛 استكشاف الأخطاء وإصلاحها

### مشاكل macOS

- **السطوع لا يتغير**: تأكد من أن Just Slip موجود في أذونات الوصول
- **لم يتم العثور على إطار عمل Quartz**: تأكد من تثبيت أدوات Xcode Command Line:
  ```bash
  xcode-select --install
  ```

### مشاكل Linux

- **تم رفض الإذن**: أضف مستخدمك إلى المجموعة المناسبة أو استخدم `sudo`
- **xrandr لا يعمل**: قم بتثبيته:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### مشاكل Windows

- **مطلوب صلاحيات المسؤول**: شغل كمسؤول للوصول إلى WMI
- **دعم DDC/CI**: قم بتثبيت [ddcutil](https://github.com/binhex/ddcutil) للتحكم في الشاشات الخارجية

## 📄 الترخيص

ترخيص MIT - انظر [LICENSE](LICENSE) للتفاصيل

## 🙏 شكرًا

- [Electron](https://www.electronjs.org/) لإطار العمل متعدد المنصات
- [pyobjc](https://pyobjc.readthedocs.io/) لربطات Quartz لنظام macOS
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) للتحكم في شاشة Linux

---

**صُنع بـ ❤️ بواسطة [Huaziyi](https://github.com/2ws7gfh8z5-dot)**
