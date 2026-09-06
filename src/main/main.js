/**
 * Just Slip v3.0.0 - 3D UI with Three.js
 * Advanced gesture learning, multi-mode (brightness/volume), themes
 */

const { BrowserWindow, app, Tray, Menu, ipcMain, Notification, nativeImage, globalShortcut } = require('electron');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Import modules
const { settingsManager, setupSettingsHandlers, DEFAULT_SETTINGS } = require('./settings');
const GestureEngine = require('./gesture-engine');

// Get the path to the brightness control script
const BRIGHTNESS_SCRIPT = path.join(__dirname, 'brightness.py');

// ========== MODE TYPES ==========
const MODES = {
  BRIGHTNESS: 'brightness',
  VOLUME: 'volume'
};

// ========== THEME CONFIGS ==========
const THEMES = {
  ocean: {
    name: 'Ocean',
    primary: '#667eea',
    secondary: '#764ba2',
    bg: '#0a1628',
    accent: '#00d4ff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  sunset: {
    name: 'Sunset',
    primary: '#f093fb',
    secondary: '#f5576c',
    bg: '#1a0a0a',
    accent: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  forest: {
    name: 'Forest',
    primary: '#11998e',
    secondary: '#38ef7d',
    bg: '#0a1a0a',
    accent: '#00ff88',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  },
  midnight: {
    name: 'Midnight',
    primary: '#2c3e50',
    secondary: '#4ca1af',
    bg: '#0d1117',
    accent: '#00ffcc',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)'
  },
  neon: {
    name: 'Neon',
    primary: '#ff00ff',
    secondary: '#00ffff',
    bg: '#0a0a0a',
    accent: '#ffff00',
    gradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)'
  }
};

// ========== MODE-SPECIFIC CONTROLLERS ==========

class BrightnessController {
  constructor() {
    this.currentValue = 50;
    this.minValue = 0;
    this.maxValue = 100;
    this.step = 5;
    this.showNotification = false;
    this.platform = os.platform();
  }

  increase() {
    const step = settingsManager.get('brightness.step') || this.step;
    this.currentValue = Math.min(this.maxValue, this.currentValue + step);
    this.set(this.currentValue);
    return this.currentValue;
  }

  decrease() {
    const step = settingsManager.get('brightness.step') || this.step;
    this.currentValue = Math.max(this.minValue, this.currentValue - step);
    this.set(this.currentValue);
    return this.currentValue;
  }

  set(value) {
    const min = settingsManager.get('brightness.min') || this.minValue;
    const max = settingsManager.get('brightness.max') || this.maxValue;
    this.currentValue = Math.max(min, Math.min(max, value));
    this.adjustBrightness(this.currentValue);
    if (this.showNotification) {
      this.showNotificationUI(this.currentValue);
    }
    return this.currentValue;
  }

  getCurrent() {
    return this.currentValue;
  }

  adjustBrightness(value) {
    try {
      const result = execSync(`python3 "${BRIGHTNESS_SCRIPT}" set ${value}`, { timeout: 10000 }).toString().trim();
      if (result === 'OK') {
        console.log(`Set brightness to ${value}%`);
      }
    } catch (error) {
      console.error('Failed to adjust brightness:', error.message);
      this.currentValue = value;
    }
  }

  showNotificationUI(value) {
    new Notification({ title: 'Just Slip', body: `Brightness: ${value}%`, subtitle: '☀️' }).show();
  }
}

class VolumeController {
  constructor() {
    this.currentValue = 50;
    this.minValue = 0;
    this.maxValue = 100;
    this.step = 5;
    this.platform = os.platform();
  }

  increase() {
    const step = settingsManager.get('volume.step') || this.step;
    this.currentValue = Math.min(this.maxValue, this.currentValue + step);
    this.set(this.currentValue);
    return this.currentValue;
  }

  decrease() {
    const step = settingsManager.get('volume.step') || this.step;
    this.currentValue = Math.max(this.minValue, this.currentValue - step);
    this.set(this.currentValue);
    return this.currentValue;
  }

  set(value) {
    const min = settingsManager.get('volume.min') || this.minValue;
    const max = settingsManager.get('volume.max') || this.maxValue;
    this.currentValue = Math.max(min, Math.min(max, value));
    this.adjustVolume(this.currentValue);
    return this.currentValue;
  }

  getCurrent() {
    return this.currentValue;
  }

  adjustVolume(value) {
    try {
      // macOS volume control
      const pct = Math.round((value / 100) * 10);
      execSync(`osascript -e 'set volume output volume ${pct}'`, { timeout: 5000 });
      console.log(`Set volume to ${value}%`);
    } catch (error) {
      console.error('Failed to adjust volume:', error.message);
      this.currentValue = value;
    }
  }
}

// ========== FACTORY ==========
function createModeController(mode) {
  if (mode === MODES.BRIGHTNESS) return new BrightnessController();
  if (mode === MODES.VOLUME) return new VolumeController();
  return new BrightnessController();
}

// ========== MAIN PROCESS ==========
let mainWindow = null;
let tray = null;
let modeController = null;
let currentMode = MODES.BRIGHTNESS;
let isRunning = false;
let gestureEngine = new GestureEngine(settingsManager.get());

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 280,
    height: 280,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    backgroundColor: '#00000000',
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
  tray.setToolTip('Just Slip v3.0 - Trackpad Control');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mode',
      submenu: [
        {
          label: 'Brightness',
          type: 'radio',
          checked: currentMode === MODES.BRIGHTNESS,
          click: () => switchMode(MODES.BRIGHTNESS)
        },
        {
          label: 'Volume',
          type: 'radio',
          checked: currentMode === MODES.VOLUME,
          click: () => switchMode(MODES.VOLUME)
        }
      ]
    },
    { type: 'separator' },
    {
      label: 'Controls',
      submenu: [
        { label: 'Increase', click: () => modeController?.increase() },
        { label: 'Decrease', click: () => modeController?.decrease() },
        { type: 'separator' },
        { label: 'Reset', click: () => modeController?.set(50) }
      ]
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

function switchMode(mode) {
  currentMode = mode;
  modeController = createModeController(mode);
  console.log(`Switched to ${mode} mode`);
}

function setupGlobalShortcuts() {
  const prefix = os.platform() === 'darwin' ? 'Command+Option' : 'Control+Alt';
  
  globalShortcut.register(`${prefix}+Up`, () => modeController?.increase());
  globalShortcut.register(`${prefix}+Down`, () => modeController?.decrease());
  globalShortcut.register(`${prefix}+Shift+Up`, () => modeController?.increase());
  globalShortcut.register(`${prefix}+Shift+Down`, () => modeController?.decrease());
}

function teardownGlobalShortcuts() {
  globalShortcut.unregisterAll();
}

function setupIpcHandlers() {
  // Mode switching
  ipcMain.handle('mode:get', () => currentMode);
  ipcMain.handle('mode:switch', (_, mode) => {
    switchMode(mode);
    return currentMode;
  });

  // Brightness/Volume controls
  ipcMain.handle('control:increase', () => modeController?.increase());
  ipcMain.handle('control:decrease', () => modeController?.decrease());
  ipcMain.handle('control:set', (_, value) => modeController?.set(value));
  ipcMain.handle('control:get', () => modeController?.getCurrent() || 50);

  // Settings
  setupSettingsHandlers();

  // Gesture learning
  ipcMain.handle('gesture:learn', (_, data) => {
    const result = gestureEngine.learnGesture(data);
    settingsManager.set('gesture.learnedPattern', result);
    return result;
  });

  ipcMain.handle('gesture:getLearned', () => settingsManager.get('gesture.learnedPattern'));

  // Window controls
  ipcMain.on('window:close', () => mainWindow?.close());
  ipcMain.on('window:minimize', () => mainWindow?.minimize());
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
  modeController = createModeController(currentMode);
  setupIpcHandlers();
  setupGlobalShortcuts();
  createMainWindow();
  createTray();
  isRunning = true;

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  teardownGlobalShortcuts();
  isRunning = false;
});

console.log('Just Slip v3.0.0 started on', os.platform());
