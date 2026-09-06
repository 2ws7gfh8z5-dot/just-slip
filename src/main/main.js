/**
 * Just Slip - Cross-Platform Brightness Control
 * Uses Python brightness.py script for actual control (macOS/Windows/Linux)
 */

const { BrowserWindow, app, Tray, Menu, ipcMain, Notification, nativeImage, globalShortcut } = require('electron');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Get the path to the brightness control script
const BRIGHTNESS_SCRIPT = path.join(__dirname, 'brightness.py');

// Platform-specific brightness control
class BrightnessController {
  constructor() {
    this.currentBrightness = 50;
    this.minBrightness = 0;
    this.maxBrightness = 100;
    this.step = 5;
    this.showNotification = false;
    this.platform = os.platform();
  }

  increase() {
    this.currentBrightness = Math.min(this.maxBrightness, this.currentBrightness + this.step);
    this.set(this.currentBrightness);
    return this.currentBrightness;
  }

  decrease() {
    this.currentBrightness = Math.max(this.minBrightness, this.currentBrightness - this.step);
    this.set(this.currentBrightness);
    return this.currentBrightness;
  }

  set(value) {
    this.currentBrightness = Math.max(this.minBrightness, Math.min(this.maxBrightness, value));
    this.adjustBrightness(this.currentBrightness);
    if (this.showNotification) {
      this.showNotificationUI(this.currentBrightness);
    }
    return this.currentBrightness;
  }

  getCurrent() {
    return this.currentBrightness;
  }

  getDisplayList() {
    return ['Main Display'];
  }

  adjustBrightness(value) {
    // Use Python script for cross-platform control
    try {
      const result = execSync(`python3 "${BRIGHTNESS_SCRIPT}" set ${value}`, { 
        timeout: 10000 
      }).toString().trim();
      if (result === 'OK') {
        console.log(`Set brightness to ${value}%`);
      } else {
        console.warn('Brightness control returned:', result);
      }
    } catch (error) {
      console.error('Failed to adjust brightness:', error.message);
      // Update local state anyway
      this.currentBrightness = value;
    }
  }

  showNotificationUI(value) {
    new Notification({
      title: 'Just Slip',
      body: `Brightness: ${value}%`,
      subtitle: value > (this.currentBrightness - this.step) ? '↑ Brighter' : '↓ Dimmer'
    }).show();
  }
}

// macOS-specific controller with additional Quartz support
class DarwinBrightnessController extends BrightnessController {
  constructor() {
    super();
    this.step = 10;
    this.displays = ['Built-in Display'];
  }

  adjustBrightness(value) {
    try {
      const result = execSync(`python3 "${BRIGHTNESS_SCRIPT}" set ${value}`, { 
        timeout: 10000 
      }).toString().trim();
      if (result === 'OK') {
        console.log(`Set macOS brightness to ${value}%`);
      }
      this.currentBrightness = value;
    } catch (error) {
      console.error('Failed to adjust macOS brightness:', error.message);
      this.currentBrightness = value; // Update local state
    }
  }
}

// Linux-specific controller
class LinuxBrightnessController extends BrightnessController {
  constructor() {
    super();
    this.displays = this._detectDisplays();
    this.useDdcutil = this._checkDdcutil();
  }

  _detectDisplays() {
    try {
      const output = execSync('xrandr --query').toString();
      const displays = [];
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes(' connected')) {
          const match = line.match(/^(\S+)/);
          if (match) displays.push(match[1]);
        }
      }
      return displays.length > 0 ? displays : ['default'];
    } catch {
      return ['default'];
    }
  }

  _checkDdcutil() {
    try {
      execSync('ddcutil detect', { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  adjustBrightness(value) {
    try {
      const result = execSync(`python3 "${BRIGHTNESS_SCRIPT}" set ${value}`, {
        timeout: 10000
      }).toString().trim();
      if (result === 'OK') {
        this.currentBrightness = value;
      }
    } catch (error) {
      console.error('Failed to adjust Linux brightness:', error.message);
      this.currentBrightness = value;
    }
  }

  showNotificationUI(value) {
    try {
      execSync(`notify-send "Just Slip" "Brightness: ${value}%"`);
    } catch {
      // Silent fallback
    }
  }
}

// Windows-specific controller
class WindowsBrightnessController extends BrightnessController {
  constructor() {
    super();
    this.displays = ['Primary Display'];
  }

  adjustBrightness(value) {
    try {
      const scriptPath = BRIGHTNESS_SCRIPT.replace(/\\/g, '/');
      const result = execSync(`python "${scriptPath}" set ${value}`, {
        timeout: 10000
      }).toString().trim();
      if (result === 'OK') {
        this.currentBrightness = value;
      }
    } catch (error) {
      console.error('Failed to adjust Windows brightness:', error.message);
      this.currentBrightness = value;
    }
  }
}

// Factory function
function createBrightnessController() {
  const platform = os.platform();
  if (platform === 'darwin') return new DarwinBrightnessController();
  if (platform === 'linux') return new LinuxBrightnessController();
  if (platform === 'win32') return new WindowsBrightnessController();
  return new BrightnessController();
}

// Main process
let mainWindow = null;
let tray = null;
let brightnessController = null;
let isRunning = false;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    backgroundColor: '#1e1e1e',
    hasShadow: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
}

function createTray() {
  let icon;
  try {
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) throw new Error('Empty icon');
  } catch {
    icon = nativeImage.createEmpty();
  }

  const resizedIcon = icon.resize({ width: 16, height: 16 });

  tray = new Tray(resizedIcon);
  tray.setToolTip('Just Slip - Trackpad Brightness Control');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Brightness',
      submenu: [
        { label: 'Increase Brightness', click: () => brightnessController?.increase() },
        { label: 'Decrease Brightness', click: () => brightnessController?.decrease() },
        { type: 'separator' },
        { label: 'Reset to 50%', click: () => brightnessController?.set(50) }
      ]
    },
    { type: 'separator' },
    {
      label: 'Preferences',
      submenu: [
        {
          type: 'checkbox',
          label: 'Show notification on change',
          checked: false,
          click: (item) => {
            if (brightnessController) {
              brightnessController.showNotification = item.checked;
            }
          }
        },
        {
          type: 'checkbox',
          label: 'Show on all workspaces',
          checked: true,
          click: (item) => {
            if (mainWindow) {
              mainWindow.setVisibleOnAllWorkspaces(item.checked, { visibleOnFullScreen: true });
            }
          }
        }
      ]
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
}

function setupGlobalShortcuts() {
  // macOS uses Cmd+Opt arrows, Windows/Linux uses Ctrl+Alt arrows
  if (os.platform() === 'darwin') {
    globalShortcut.register('Command+Option+Up', () => {
      brightnessController?.increase();
    });
    globalShortcut.register('Command+Option+Down', () => {
      brightnessController?.decrease();
    });
    globalShortcut.register('Command+Shift+Up', () => {
      brightnessController?.increase();
    });
    globalShortcut.register('Command+Shift+Down', () => {
      brightnessController?.decrease();
    });
  } else {
    // Windows/Linux
    globalShortcut.register('Control+Alt+Up', () => {
      brightnessController?.increase();
    });
    globalShortcut.register('Control+Alt+Down', () => {
      brightnessController?.decrease();
    });
    globalShortcut.register('Control+Shift+Up', () => {
      brightnessController?.increase();
    });
    globalShortcut.register('Control+Shift+Down', () => {
      brightnessController?.decrease();
    });
  }
}

function teardownGlobalShortcuts() {
  globalShortcut.unregisterAll();
}

function setupIpcHandlers() {
  ipcMain.handle('brightness:increase', () => brightnessController?.increase());
  ipcMain.handle('brightness:decrease', () => brightnessController?.decrease());
  ipcMain.handle('brightness:set', (_, value) => brightnessController?.set(value));
  ipcMain.handle('brightness:get', () => brightnessController?.getCurrent() || 50);
  ipcMain.handle('displays:get', () => brightnessController?.getDisplayList() || []);
  ipcMain.on('window:close', () => mainWindow?.close());
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
}

// Touch/gesture handling
let touchStartY = null;
let touchStartTime = null;

function setupGestureHandling() {
  ipcMain.on('touch:start', (_, data) => {
    touchStartY = data.y;
    touchStartTime = data.time;
  });

  ipcMain.on('touch:end', (_, data) => {
    if (touchStartY === null || touchStartTime === null) return;

    const deltaY = data.y - touchStartY;
    const deltaTime = data.time - touchStartTime;

    touchStartY = null;
    touchStartTime = null;

    if (Math.abs(deltaY) < 10) return;
    if (deltaTime > 500) return;

    if (deltaY < 0) {
      brightnessController?.increase();
    } else if (deltaY > 0) {
      brightnessController?.decrease();
    }
  });
}

// Energy saver override for macOS
function setupEnergySaverOverride() {
  if (os.platform() === 'darwin') {
    try {
      execSync('caffeinate -dims -w $$', {
        detached: true,
        stdio: 'ignore'
      });
    } catch (error) {
      console.warn('Could not set energy saver override:', error.message);
    }
  }
}

// Single instance lock
let gotTheLock = false;
if (typeof app !== 'undefined' && typeof app.requestSingleInstanceLock === 'function') {
  gotTheLock = app.requestSingleInstanceLock();
}
if (!gotTheLock) {
  console.log('Another instance is running, exiting.');
  if (typeof app !== 'undefined') app.quit();
  process.exit(0);
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  brightnessController = createBrightnessController();
  setupIpcHandlers();
  setupGestureHandling();
  setupGlobalShortcuts();
  setupEnergySaverOverride();
  createMainWindow();
  createTray();
  isRunning = true;

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  teardownGlobalShortcuts();
  isRunning = false;
});

console.log('Just Slip started on', os.platform());
