/**
 * Just Slip - Settings Module
 * Handles gesture configuration persistence and management
 */

const { app, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const CONFIG_FILE = path.join(app.getPath('userData'), 'config.json');

// Default settings
const DEFAULT_SETTINGS = {
  gesture: {
    type: 'vertical',           // 'vertical', 'horizontal', 'diagonal', 'any'
    sensitivity: 30,            // pixels to trigger gesture
    maxAngle: 45,               // degrees from primary axis for diagonal
  },
  brightness: {
    step: 5,                    // brightness change per gesture
    min: 0,
    max: 100,
  },
  ui: {
    showNotification: true,
    notificationPosition: 'top', // 'top', 'bottom', 'center'
    animDuration: 200,          // ms
  },
  shortcuts: {
    increase: 'Command+Option+ArrowUp',
    decrease: 'Command+Option+ArrowDown',
  },
  advanced: {
    enableGesturePrediction: false,
    debounceMs: 100,
  }
};

class SettingsManager {
  constructor() {
    this.settings = this.load();
  }

  load() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        const loaded = JSON.parse(data);
        return this.mergeDefaults(loaded);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  save() {
    try {
      const dir = path.dirname(CONFIG_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.settings, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  mergeDefaults(loaded) {
    const merged = { ...DEFAULT_SETTINGS, ...loaded };
    
    // Deep merge gesture settings
    if (loaded.gesture) {
      merged.gesture = { ...DEFAULT_SETTINGS.gesture, ...loaded.gesture };
    }
    if (loaded.brightness) {
      merged.brightness = { ...DEFAULT_SETTINGS.brightness, ...loaded.brightness };
    }
    if (loaded.ui) {
      merged.ui = { ...DEFAULT_SETTINGS.ui, ...loaded.ui };
    }
    if (loaded.shortcuts) {
      merged.shortcuts = { ...DEFAULT_SETTINGS.shortcuts, ...loaded.shortcuts };
    }
    if (loaded.advanced) {
      merged.advanced = { ...DEFAULT_SETTINGS.advanced, ...loaded.advanced };
    }
    
    return merged;
  }

  get(key) {
    if (key) {
      return key.split('.').reduce((obj, k) => obj?.[k], this.settings);
    }
    return this.settings;
  }

  set(key, value) {
    const keys = key.split('.');
    let obj = this.settings;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this.save();
    return this.settings;
  }

  reset() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.save();
    return this.settings;
  }

  exportConfig() {
    return JSON.stringify(this.settings, null, 2);
  }

  importConfig(json) {
    try {
      const parsed = JSON.parse(json);
      this.settings = this.mergeDefaults(parsed);
      this.save();
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }
}

// Export singleton
const settingsManager = new SettingsManager();

// IPC handlers
function setupSettingsHandlers() {
  // Get all settings
  ipcMain.handle('settings:get', () => settingsManager.get());

  // Get specific setting
  ipcMain.handle('settings:get', (_, key) => settingsManager.get(key));

  // Set specific setting
  ipcMain.handle('settings:set', (_, key, value) => {
    return settingsManager.set(key, value);
  });

  // Reset to defaults
  ipcMain.handle('settings:reset', () => {
    return settingsManager.reset();
  });

  // Export config
  ipcMain.handle('settings:export', () => {
    return settingsManager.exportConfig();
  });

  // Import config
  ipcMain.handle('settings:import', (_, json) => {
    return settingsManager.importConfig(json);
  });

  // Open settings file location
  ipcMain.handle('settings:openLocation', () => {
    dialog.showOpenDialog({
      title: 'Open Config Location',
      defaultPath: path.dirname(CONFIG_FILE),
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
      }
      return null;
    }).catch(err => console.error(err));
  });

  // Get config file path
  ipcMain.handle('settings:getPath', () => CONFIG_FILE);
}

module.exports = {
  settingsManager,
  DEFAULT_SETTINGS,
  setupSettingsHandlers,
  CONFIG_FILE
};
