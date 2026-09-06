# Changelog

All notable changes to Just Slip will be documented in this file.

## [v2.0.0] - 2026-09-06

### Added
- 🌐 **Cross-Platform Support**: Full support for macOS, Windows, and Linux
- 🔧 **Python Brightness Bridge**: New `brightness.py` script for unified brightness control
- ⌨️ **Platform-Specific Shortcuts**:
  - macOS: `Cmd+Opt+↑↓`, `Cmd+Shift+↑↓`
  - Windows/Linux: `Ctrl+Alt+↑↓`, `Ctrl+Shift+↑↓`
- 📦 **Multi-Platform Packaging**:
  - macOS: DMG (Intel & Apple Silicon)
  - Windows: NSIS Installer (x64)
  - Linux: AppImage (x64)
- 📖 **Comprehensive Documentation**: README with installation guides and troubleshooting
- 📝 **License**: MIT License included

### Changed
- Refactored brightness control to use Python bridge instead of direct API calls
- Updated keyboard shortcuts for better cross-platform compatibility
- Improved error handling and fallback mechanisms

### Technical Details
- **macOS**: Uses `CAWindowServerDisplay` via Python's Quartz bindings
- **Windows**: Uses PowerShell WMI (`Get-WmiObject WmiMonitorBrightness`)
- **Linux**: Uses `/sys/class/backlight` or `xrandr` as fallback

---

## [v1.1.0] - 2026-09-05

### Fixed
- 🔧 **Real Brightness Control**: Resolved macOS 26 brightness restriction by using `CAWindowServerDisplay` API
- ✅ **Removed Simulation Mode**: App now actually controls display brightness

### Technical Details
- Discovered that `CAWindowServerDisplay.setSDRBrightness_()` works on macOS 26+
- Bypassed AppleScript/System Events restrictions that were blocked by new privacy model

---

## [v1.0.0] - 2026-09-05

### Added
- 🎯 **Initial Release**: Trackpad brightness control for macOS
- 👆 **Touch Gestures**: Swipe up/down on trackpad to adjust brightness
- ⌨️ **Keyboard Shortcuts**: `Ctrl+Opt+↑↓`, `Ctrl+Shift+↑↓`
- 📊 **Floating UI**: Minimal, always-on-top brightness indicator
- 🔔 **System Tray**: Background icon with quick access menu
- 🔔 **Notifications**: Optional brightness change notifications

### Features
- Cross-platform architecture (macOS, Linux, Windows)
- Clean, minimal design with pulse animation
- Single instance lock to prevent multiple launches

---

## Version History Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| v2.0.0 | 2026-09-06 | Cross-platform support, Python bridge |
| v1.1.0 | 2026-09-05 | Real brightness control (macOS 26) |
| v1.0.0 | 2026-09-05 | Initial release |

---

## Download Links

- [v2.0.0 - Latest](https://github.com/2ws7gfh8z5-dot/just-slip/releases/tag/v2.0.0)
- [v1.1.0](https://github.com/2ws7gfh8z5-dot/just-slip/releases/tag/v1.1.0)
- [v1.0.0](https://github.com/2ws7gfh8z5-dot/just-slip/releases/tag/v1.0.0)
