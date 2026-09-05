const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Brightness control
  increaseBrightness: () => ipcRenderer.invoke('brightness:increase'),
  decreaseBrightness: () => ipcRenderer.invoke('brightness:decrease'),
  setBrightness: (value) => ipcRenderer.invoke('brightness:set', value),
  getCurrentBrightness: () => ipcRenderer.invoke('brightness:get'),

  // System info
  getPlatform: () => process.platform,
  getDisplays: () => ipcRenderer.invoke('displays:get'),

  // Window controls
  closeWindow: () => ipcRenderer.send('window:close'),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),

  // Event listeners
  onBrightnessChanged: (callback) => {
    ipcRenderer.on('brightness:changed', (_event, value) => callback(value));
  }
});
