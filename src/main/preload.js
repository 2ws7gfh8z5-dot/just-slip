/**
 * Just Slip - Preload script
 * Exposes safe APIs to the renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Brightness controls
  increaseBrightness: () => ipcRenderer.invoke('brightness:increase'),
  decreaseBrightness: () => ipcRenderer.invoke('brightness:decrease'),
  setBrightness: (value) => ipcRenderer.invoke('brightness:set', value),
  getCurrentBrightness: () => ipcRenderer.invoke('brightness:get'),
  getDisplays: () => ipcRenderer.invoke('displays:get'),
  
  // Window controls
  closeWindow: () => ipcRenderer.send('window:close'),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  
  // Platform info
  getPlatform: () => Promise.resolve(process.platform),
  
  // Settings APIs
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:set', 'gesture.type', settings.gesture?.type).then(() => settings),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  
  // Config management
  exportConfig: () => ipcRenderer.invoke('settings:export'),
  importConfig: (json) => ipcRenderer.invoke('settings:import', json),
  getConfigPath: () => ipcRenderer.invoke('settings:getPath'),
  openConfigLocation: () => ipcRenderer.invoke('settings:openLocation'),
});
