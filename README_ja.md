# 🌐 言語選択 | Language Selection | 言語選択

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

<a id="japanese"></a>

# Just Slip

[![最新バージョン](https://img.shields.io/github/v/release/2ws7gfh8z5-dot/just-slip)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![ダウンロード数](https://img.shields.io/github/downloads/2ws7gfh8z5-dot/just-slip/total)](https://github.com/2ws7gfh8z5-dot/just-slip/releases)
[![プラットフォーム](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](#)
[![ライセンス](https://img.shields.io/github/license/2ws7gfh8z5-dot/just-slip)](LICENSE)

トラックパッドジェスチャで画面の明るさを制御する、ミニマルなクロスプラットフォームElectronアプリケーション。

## ✨ 機能

- **トラックパッドジェスチャ**: 上にスワイプで明るく、下にスワイプで暗く
- **キーボードショートカット**: 
  - macOS: `Cmd+Opt+↑/↓` または `Cmd+Shift+↑/↓`
  - Windows/Linux: `Ctrl+Alt+↑/↓` または `Ctrl+Shift+↑/↓`
- **クロスプラットフォーム対応**: macOS、Linux、Windowsで動作
- **システムトレイ**: バックグラウンドで控えめに動作
- **ミニマルUI**: すっきりとした明るさインジケータ

## 📦 インストール

### プリビルドリリースをダウンロード

[Releasesページ](https://github.com/2ws7gfh8z5-dot/just-slip/releases)から適切なパッケージをダウンロード：

| プラットフォーム | ファイル形式 | アーキテクチャ |
|------------------|--------------|----------------|
| macOS | `.dmg` | Intel (x64) & Apple Silicon (arm64) |
| Windows | `.exe` | x64 |
| Linux | `.AppImage` | x64 |

### ソースからインストール

```bash
# リポジトリをクローン
git clone https://github.com/2ws7gfh8z5-dot/just-slip.git
cd just-slip

# 依存関係をインストール
npm install

# ビルド
npm run build

# 実行
npm start
```

### ディストリビューション用にビルド

```bash
# すべてのプラットフォームをビルド
npm run package:all

# または個別にビルド
npm run package:mac    # macOS DMG
npm run package:win    # Windowsインストーラー
npm run package:linux  # Linux AppImage
```

## 🚀 使用方法

1. **起動**: Just Slipをアプリケーションフォルダ（macOS）またはスタートメニュー（Windows/Linux）から起動
2. **初回実行**: プロンプトが表示されたらアクセシビリティ権限を付与
   - macOS: `システム設定 → プライバシーとセキュリティ → アクセシビリティ`
   - Windows: 追加権限は不要
   - Linux: `/sys/class/backlight`アクセスにsudoが必要かも
3. **明るさを調整**:
   - トラックパッド: 上下スワイプ
   - キーボード: 上記のショートカットを使用
   - システムトレイ: アイコンをクリック → 明るさサブメニュー

## 🐛 トラブルシューティング

### macOSの問題

- **明るさが変わらない**: Just Slipがアクセシビリティ権限にあることを確認
- **Quartzフレームワークが見つからない**: Xcode Command Line Toolsがインストールされていることを確認：
  ```bash
  xcode-select --install
  ```

### Linuxの問題

- **権限が拒否された**: ユーザーを適切なグループに追加するか`sudo`を使用
- **xrandrが動作しない**: インストール：
  ```bash
  # Ubuntu/Debian
  sudo apt install xrandr
  
  # Fedora
  sudo dnf install xrandr
  
  # Arch
  sudo pacman -S xorg-xrandr
  ```

### Windowsの問題

- **管理者権限が必要**: WMIアクセスには管理者権限で実行
- **DDC/CIサポート**: 外部モニター制御には[ddcutil](https://github.com/binhex/ddcutil)をインストール

## 📄 ライセンス

MITライセンス - 詳細は[LICENSE](LICENSE)を参照

## 🙏 謝辞

- [Electron](https://www.electronjs.org/) クロスプラットフォームフレームワーク
- [pyobjc](https://pyobjc.readthedocs.io/) macOS Quartzバインディング
- [xrandr](https://www.x.org/releases/X11R7.6/doc/man/man1/xrandr.1.xhtml) Linuxディスプレイ制御

---

**[Huaziyi](https://github.com/2ws7gfh8z5-dot) による ❤️ 製**
