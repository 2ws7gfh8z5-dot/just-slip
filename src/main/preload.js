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
  saveSettings: (settings) => ipcRenderer.invoke('settings:set', 'gesture.type', settings.gesture?.type)
    .then(() => {
      // Persist eye-system UI sub-fields (baseline/calibration use their own
      // dedicated eye:* IPC channels and are NOT part of settings.eye here).
      const e = settings.eye;
      if (e && typeof e === 'object') {
        let p = Promise.resolve();
        const pairs = [
          ['eye.enabled', e.enabled],
          ['eye.vertical', e.vertical],
          ['eye.horizontal', e.horizontal],
          ['eye.sensitivity', e.sensitivity],
          ['eye.hysteresis', e.hysteresis]
        ];
        for (const [k, v] of pairs) {
          if (v !== undefined) p = p.then(() => ipcRenderer.invoke('settings:set', k, v));
        }
        return p.then(() => settings);
      }
      return settings;
    }),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  
  // Gesture learning
  learnGesture: (data) => ipcRenderer.invoke('gesture:learn', data),
  getLearnedGesture: () => ipcRenderer.invoke('gesture:getLearned'),

  // Eye tracking (eye searching system)
  eyeAdjust: (payload) => ipcRenderer.invoke('eye:adjust', payload),
  eyeCalibrate: (baseline) => ipcRenderer.invoke('eye:calibrate', baseline),
  eyeSaveCalibration: (cal) => ipcRenderer.invoke('eye:saveCalibration', cal),
  eyeGetCalibration: () => ipcRenderer.invoke('eye:getCalibration'),
  eyeSetEnabled: (enabled) => ipcRenderer.invoke('eye:setEnabled', enabled),
  eyeStatus: () => ipcRenderer.invoke('eye:status'),

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
