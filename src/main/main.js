const { BrowserWindow, app, Tray, Menu, ipcMain, Notification, nativeImage, globalShortcut } = require('electron');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Platform-specific brightness control
class BrightnessController {
  constructor() {
    this.currentBrightness = 50;
    this.minBrightness = 0;
    this.maxBrightness = 100;
    this.step = 5;
    this.showNotification = false;
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
    throw new Error('Must be implemented by subclass');
  }

  showNotificationUI(value) {
    // Implemented by platform-specific subclasses
  }
}

class DarwinBrightnessController extends BrightnessController {
  constructor() {
    super();
    this.step = 10;
    this.displays = this._detectDisplays();
  }

  _detectDisplays() {
    try {
      const script = `tell application "System Events"
        set displayNames to {}
        repeat with d in displays
          set end of displayNames to description of d
        end repeat
        return displayNames as string
      end tell`;
      const tmpPath = require('os').tmpdir() + '/jsl-display-' + Date.now() + '.scpt';
      require('fs').writeFileSync(tmpPath, script);
      const result = execSync('osascript "' + tmpPath + '"', { timeout: 5000 }).toString().trim();
      require('fs').unlinkSync(tmpPath);
      return result.split(',').map(d => d.trim());
    } catch (err) {
      console.warn('_detectDisplays failed:', err.message);
      return ['Built-in Display'];
    }
  }

  adjustBrightness(value) {
    try {
      const normalized = value / 100;
      const script = `tell application "System Events"
        set brightness of first display to ${normalized}
      end tell`;
      const tmpPath = require('os').tmpdir() + '/jsl-bright-' + Date.now() + '.scpt';
      require('fs').writeFileSync(tmpPath, script);
      execSync('osascript "' + tmpPath + '"', { timeout: 5000 });
      require('fs').unlinkSync(tmpPath);
    } catch (error) {
      // macOS 26+ restricts display brightness via AppleScript
      // Fall back to simulation (update local state only)
      console.warn('AppleScript brightness control unavailable (macOS 26+ restriction). Using simulated mode.');
      // Simulate success by updating local state
      this.currentBrightness = Math.max(this.minBrightness, Math.min(this.maxBrightness, value));
      if (this.showNotification) {
        this.showNotificationUI(this.currentBrightness);
      }
    }
  }

  showNotificationUI(value) {
    new Notification({
      title: 'Just Slip',
      body: `Brightness: ${value}%`,
      subtitle: value > this.currentBrightness ? '↑ Brighter' : '↓ Dimmer'
    }).show();
  }

  getDisplayList() {
    return this.displays;
  }
}

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
    if (this.useDdcutil && this.displays.length > 0) {
      this._setBrightnessDdcutil(value);
    } else {
      this._setBrightnessXrandr(value);
    }
  }

  _setBrightnessXrandr(value) {
    try {
      const normalized = value / 100;
      const display = this.displays[0] || 'default';
      execSync(`xrandr --output ${display} --brightness ${normalized}`, { timeout: 5000 });
    } catch (error) {
      console.error('xrandr failed:', error.message);
      this._setBrightnessProc(value);
    }
  }

  _setBrightnessProc(value) {
    try {
      const fs = require('fs');
      const backlightPath = '/sys/class/backlight';
      if (fs.existsSync(backlightPath)) {
        const devices = fs.readdirSync(backlightPath);
        if (devices.length > 0) {
          const maxBrightness = parseInt(
            fs.readFileSync(path.join(backlightPath, devices[0], 'max_brightness'), 'utf8')
          );
          const newBrightness = Math.round((value / 100) * maxBrightness);
          fs.writeFileSync(
            path.join(backlightPath, devices[0], 'brightness'),
            newBrightness.toString()
          );
          return;
        }
      }
    } catch (error) {
      console.error('sysfs failed:', error.message);
    }
    console.warn('Could not adjust brightness. Try: xrandr --output <display> --brightness <value>');
  }

  _setBrightnessDdcutil(value) {
    try {
      execSync(`ddcutil setvcp 10 ${Math.round(value)}`, { timeout: 5000 });
    } catch (error) {
      console.error('ddcutil failed:', error.message);
      this._setBrightnessXrandr(value);
    }
  }

  showNotificationUI(value) {
    try {
      execSync(`notify-send "Just Slip" "Brightness: ${value}%"`);
    } catch {
      // Silent fallback
    }
  }

  getDisplayList() {
    return this.displays;
  }
}

class WindowsBrightnessController extends BrightnessController {
  constructor() {
    super();
    this.displays = ['Primary Display'];
    this.useDdcutil = this._checkDdcutil();
  }

  _checkDdcutil() {
    try {
      execSync('ddcutil --version', { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  adjustBrightness(value) {
    if (this.useDdcutil) {
      this._setBrightnessDdcutil(value);
    } else {
      this._setBrightnessNative(value);
    }
  }

  _setBrightnessNative(value) {
    try {
      const script = `
        const brightness = ${value};
        const param = {
          Namespace: "root\\wmi",
          Class: "WmiMonitorBrightness",
          Filter: "IsInstance = 1"
        };
        const device = Get-WmiObject -Query "SELECT * FROM WmiMonitorBrightness WHERE IsInstance = 1";
        if (device) {
          device.SetBrightness(brightness);
        } else {
          const methods = Get-WmiObject -Query "SELECT * FROM WmiMonitorBrightnessMethods WHERE IsInstance = 1";
          methods.WmiSetBrightness(1, $brightness);
        }
      `;
      execSync(`powershell -ExecutionPolicy Bypass -Command ${JSON.stringify(script)}`, { timeout: 10000 });
    } catch (error) {
      console.error('Windows native brightness adjustment failed:', error.message);
    }
  }

  _setBrightnessDdcutil(value) {
    try {
      execSync(`ddcutil setvcp 10 ${Math.round(value)}`, { timeout: 5000 });
    } catch (error) {
      console.error('ddcutil on Windows failed:', error.message);
      this._setBrightnessNative(value);
    }
  }

  showNotificationUI(value) {
    try {
      const script = `[System.Windows.Forms.ToolTip]::new().Text = 'Just Slip - Brightness: ${value}%'`;
      execSync(`powershell -Command ${JSON.stringify(script)}`, { timeout: 5000 });
    } catch {
      // Silent fallback
    }
  }

  getDisplayList() {
    return this.displays;
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
  globalShortcut.register('Control+Option+Up', () => {
    brightnessController?.increase();
  });
  globalShortcut.register('Control+Option+Down', () => {
    brightnessController?.decrease();
  });
  globalShortcut.register('Control+Shift+Up', () => {
    brightnessController?.increase();
  });
  globalShortcut.register('Control+Shift+Down', () => {
    brightnessController?.decrease();
  });
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

console.log('Just Slip started');
