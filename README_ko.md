# 🌐 언어 선택 | Language Selection | 言語選択

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

<a id="korean"></a>

# Just Slip

[![최신 버전](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![다운로드 수](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![플랫폼](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![라이선스](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

트랙패드 제스처로 화면 밝기를 조절하는 최소한의 크로스 플랫폼 Electron 애플리케이션.

## ✨ 기능

- **트랙패드 제스처**: 위로	swipe	밝게, 아래로 sw	p어 어둡게
- **키보드 단축키**: 
  - macOS: `Cmd+Opt+↑/↓` 또는 `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` 또는 `Ctrl+Shift+↑/↓`
- **크로스 플랫폼 지원**: macOS, Linux, Windows에서 작동
- **시스템 트레이**: 백그라운드에서 조용히 실행
- **미니멀 UI**: 깔끔하고 눈에 띄지 않는 밝기 표시기

## 📦 설치

### 사전 빌드 릴리스 다운로드

[Releases 페이지](https://github.com/2ws7gfh8z5-dot/just-slip/releases)에서 적합한 패키지를 다운로드:

| 플랫폼 | 파일 형식 | 아키텍처 |
|--------|-----------|----------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### 소스에서 설치

```bash
# 저장소 클론
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# 의존성 설치
npm install

# 빌드
npm run build

# 실행
npm start
```

### 배포용으로 빌드

```bash
# 모든 플랫폼 빌드
npm run package:all

# 또는 개별 빌드
npm run package:mac    # macOS DMG
npm run package:win    # Windows 설치 프로그램
npm run package:linux  # Linux AppImage
```

## 🚀 사용 방법

1. **실행**:applications 폴더(macOS) 또는 시작 메뉴(Windows/Linux)에서 Just Slip 실행
2. **최초 실행**: 프롬프트가 나타나면 접근성 권한 허용
   - macOS: `시스템 설정 → 개인 정보 및 보안 → 접근성`
   - Windows: 추가 권한 불필요
   - Linux: `/sys/class/backlight` 접근에 sudo 필요할 수 있음
3. **밝기 조절**:
   - 트랙패드: 위아래_swipe
   - 키보드: 위의 단축키 사용
   - 시스템 트레이: 아이콘 클릭 → 밝기 서브 메뉴

## 🐛 문제 해결

### macOS 문제

- **밝기가 변경되지 않음**: Just Slip이 접근성 권한에 있는지 확인
- **Quartz 프레임워크 없음**: Xcode Command Line Tools가 설치되어 있는지 확인:
  ```bash
  xcode-select --install
  ```

### Linux 문제

- **권한 거부됨**: 사용자를 적절한 그룹에 추가하거나 `sudo` 사용
- **xrandr 작동 안 함**: 설치:
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windows 문제

- **관리자 권한 필요**: WMI 접근에는 관리자 권한으로 실행
- **DDC/CI 지원**: 외부 모니터 제어에는 [ddcutil](https://github.com/binhex/ddcutil) 설치

## 📄 라이선스

MIT 라이선스 - 자세한 내용은 [LICENSE](LICENSE) 참조

## 🙏 감사의 말

- [Electron](https://www.electronjs.org/) 크로스 플랫폼 프레임워크
- [pyobjc](https://pyobjc.readthedocs.io/) macOS Quartz 바인딩
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) Linux 디스플레이 제어

---

**[Huaziyi](https://github.com/2ws7gfh8z5-dot)가 ❤️로 만듦**
