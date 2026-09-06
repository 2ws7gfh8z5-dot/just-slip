# 🌐 भाषा चयन | Language Selection | 言語選択

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

<a id="hindi"></a>

# Just Slip

[![नवीनतम संस्करण](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![डाउनलोड](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![प्लेटफ़ॉर्म](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![लाइसेंस](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

ट्रैकपैड GESTURES के साथ स्क्रीन की चमक को नियंत्रित करें। एक न्यूनतम क्रॉस-प्लेटफ़ॉर्म Electron एप्लिकेशन।

## ✨ विशेषताएँ

- **ट्रैकपैड GESTURES**: चमक बढ़ाने के लिए ऊपर स्वाइप करें, कम करने के लिए नीचे स्वाइप करें
- **कीबोर्ड शॉर्टकट**: 
  - macOS: `Cmd+Opt+↑/↓` या `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` या `Ctrl+Shift+↑/↓`
- **क्रॉस-प्लेटफ़ॉर्म**: macOS, Linux और Windows पर काम करता है
- **सिस्टम ट्रैय**: बैकग्राउंड में बेआवाज़ चलता है
- **न्यूनतम UI**: साफ, असुविधाजनक चमक इंगितकर्ता

## 📦 इंस्टॉलेशन

### पूर्व-बिल्ड रिलीज़ डाउनलोड करें

उपयुक्त पैकेज डाउनलोड करने के लिए [रिलीज़ पेज](https://github.com/2ws7gfh8z5-dot/just-slip/releases) पर जाएं:

| प्लेटफ़ॉर्म | फ़ाइल प्रारूप | आर्किटेक्चर |
|------------|---------------|-------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### स्रोत कोड से इंस्टॉल करें

```bash
# रिपो क्लोन करें
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# निर्भरताएँ इंस्टॉल करें
npm install

# बिल्ड करें
npm run build

# चलाएं
npm start
```

### वितरण के लिए बिल्ड करें

```bash
# सभी प्लेटफ़ॉर्म के लिए बिल्ड करें
npm run package:all

# या अलग-अलग बिल्ड करें
npm run package:mac    # macOS DMG
npm run package:win    # Windows Installer
npm run package:linux  # Linux AppImage
```

## 🚀 उपयोग

1. **प्रारंभ करें** Just Slip अपने Applications फ़ोल्डर से (macOS) या Start Menu से (Windows/Linux)
2. **पहली बार चलाएं**: अनुरोध करने पर एक्सेसिबिलिटी अनुमतियाँ दें
   - macOS: `सिस्टम सेटिंग्स → गोपनीयता और सुरक्षा → एक्सेसिबिलिटी`
   - Windows: कोई अतिरिक्त अनुमति आवश्यक नहीं
   - Linux: `/sys/class/backlight` तक पहुंच के लिए sudo की आवश्यकता हो सकती है
3. **चमक समायोजित करें**:
   - ट्रैकपैड: ऊपर/नीचे स्वाइप करें
   - कीबोर्ड: उपरोक्त शॉर्टकट का उपयोग करें
   - सिस्टम ट्रैय: आइकन पर क्लिक करें → चमक सबमेनू

## 🐛 त्रुटि निवारण

### macOS समस्याएँ

- **चमक नहीं बदल रही**: सुनिश्चित करें कि Just Slip एक्सेसिबिलिटी अनुमतियों में है
- **Quartz फ्रेमवर्क नहीं मिला**: सुनिश्चित करें कि आपके पास Xcode Command Line Tools इंस्टॉल हैं:
  ```bash
  xcode-select --install
  ```

### Linux समस्याएँ

- **अनुमति अस्वीकृत**: अपने उपयोगकर्ता को उचित समूह में जोड़ें या `sudo` का उपयोग करें
- **xrandr काम नहीं कर रहा**: इसे इंस्टॉल करें:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windows समस्याएँ

- **एडमिनाइस्ट्रेटर अधिकार आवश्यक**: WMI पहुंच के लिए व्यवस्थापक के रूप में चलाएं
- **DDC/CI समर्थन**: बाहरी मॉनिटर नियंत्रण के लिए [ddcutil](https://github.com/binhex/ddcutil) इंस्टॉल करें

## 📄 लाइसेंस

MIT लाइसेंस - विवरण के लिए [LICENSE](LICENSE) देखें

## 🙏 आभार

- [Electron](https://www.electronjs.org/) क्रॉस-प्लेटफ़ॉर्म फ्रेमवर्क के लिए
- [pyobjc](https://pyobjc.readthedocs.io/) macOS Quartz बंधनों के लिए
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) Linux स्क्रीन नियंत्रण के लिए

---

**[Huaziyi](https://github.com/2ws7gfh8z5-dot) द्वारा ❤️ से बनाया**
