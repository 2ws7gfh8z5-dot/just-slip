/**
 * Just Slip v3.0.0 - Preload script
 * Exposes safe APIs to the renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Mode switching
  getMode: () => ipcRenderer.invoke('mode:get'),
  switchMode: (mode) => ipcRenderer.invoke('mode:switch', mode),
  
  // Control (brightness/volume)
  increaseControl: () => ipcRenderer.invoke('control:increase'),
  decreaseControl: () => ipcRenderer.invoke('control:decrease'),
  setControl: (value) => ipcRenderer.invoke('control:set', value),
  getControlValue: () => ipcRenderer.invoke('control:get'),
  
  // Settings APIs
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:set', 'gesture.type', settings.gesture?.type).then(() => settings),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  
  // Gesture learning
  learnGesture: (data) => ipcRenderer.invoke('gesture:learn', data),
  getLearnedGesture: () => ipcRenderer.invoke('gesture:getLearned'),
  
  // Config management
  exportConfig: () => ipcRenderer.invoke('settings:export'),
  importConfig: (json) => ipcRenderer.invoke('settings:import', json),
  getConfigPath: () => ipcRenderer.invoke('settings:getPath'),
  openConfigLocation: () => ipcRenderer.invoke('settings:openLocation'),
  
  // Window controls
  closeWindow: () => ipcRenderer.send('window:close'),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  
  // Platform info
  getPlatform: () => Promise.resolve(process.platform),
});
