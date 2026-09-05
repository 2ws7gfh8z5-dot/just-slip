# Just Slip

Control screen brightness with trackpad gestures. A minimal, cross-platform Electron application.

## Features

- **Trackpad Gestures**: Swipe up to increase brightness, swipe down to decrease
- **Cross-Platform**: Works on macOS, Linux, and Windows
- **System Tray**: Runs unobtrusively in the background
- **Keyboard Shortcuts**: `Ctrl+Opt+↑/↓` or `Ctrl+Shift+↑/↓` as fallback
- **Minimal UI**: Clean, unobtrusive brightness indicator

## Installation

```bash
cd /Users/huaziyi/projects/just-slip
npm install
```

## Running

```bash
npm start
```

## Development

```bash
npm run dev
```

## Building

```bash
npm run build
```

## macOS 26 Note

macOS 26.6.2+ restricts display brightness control via AppleScript/System Events. The app runs in "simulated mode" - it updates local state but cannot change actual display brightness. This is a system-level restriction that requires researching new macOS 26 APIs to resolve.

## License

MIT
