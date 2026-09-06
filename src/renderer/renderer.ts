/**
 * Just Slip - Renderer process
 * Handles UI updates, keyboard shortcuts, touch/swipe detection, and settings
 */

interface ElectronAPI {
  increaseBrightness(): Promise<number>;
  decreaseBrightness(): Promise<number>;
  setBrightness(value: number): Promise<number>;
  getCurrentBrightness(): Promise<number>;
  getPlatform(): Promise<string>;
  getDisplays(): Promise<string[]>;
  closeWindow(): void;
  minimizeWindow(): void;
  // Settings APIs
  getSettings(): Promise<any>;
  saveSettings(settings: any): Promise<void>;
  resetSettings(): Promise<any>;
}

// Extend window with electron API
declare const electronAPI: ElectronAPI;

const brightnessValueEl = document.getElementById('brightnessValue') as HTMLElement;
const progressFillEl = document.getElementById('progressFill') as HTMLElement;
const swipeIndicatorEl = document.getElementById('swipeIndicator') as HTMLElement;
const containerEl = document.querySelector('.container') as HTMLElement;
const gestureHintEl = document.getElementById('gestureHint') as HTMLElement;

// Settings elements
const settingsBtn = document.getElementById('settingsBtn') as HTMLElement;
const settingsPanel = document.getElementById('settingsPanel') as HTMLElement;
const closeSettings = document.getElementById('closeSettings') as HTMLElement;
const gestureType = document.getElementById('gestureType') as HTMLSelectElement;
const sensitivity = document.getElementById('sensitivity') as HTMLInputElement;
const sensitivityValue = document.getElementById('sensitivityValue') as HTMLElement;
const stepSize = document.getElementById('stepSize') as HTMLInputElement;
const stepSizeValue = document.getElementById('stepSizeValue') as HTMLElement;
const minBrightness = document.getElementById('minBrightness') as HTMLInputElement;
const minBrightnessValue = document.getElementById('minBrightnessValue') as HTMLElement;
const maxBrightness = document.getElementById('maxBrightness') as HTMLInputElement;
const maxBrightnessValue = document.getElementById('maxBrightnessValue') as HTMLElement;
const toggleNotification = document.getElementById('toggleNotification') as HTMLElement;
const notifPosition = document.getElementById('notifPosition') as HTMLSelectElement;
const resetBtn = document.getElementById('resetBtn') as HTMLElement;
const saveBtn = document.getElementById('saveBtn') as HTMLElement;
const toast = document.getElementById('toast') as HTMLElement;

let currentBrightness = 50;
let settings: any = null;

// Initialize
async function init() {
  try {
    currentBrightness = await electronAPI.getCurrentBrightness();
    settings = await electronAPI.getSettings();
    updateDisplay(currentBrightness);
    loadSettingsToUI();
    updateGestureHint();
  } catch (error) {
    console.error('Failed to initialize:', error);
    currentBrightness = 50;
    updateDisplay(currentBrightness);
  }
}

function updateDisplay(value: number) {
  currentBrightness = value;
  brightnessValueEl.textContent = `${value}%`;
  progressFillEl.style.width = `${value}%`;

  // Add pulse animation
  containerEl.classList.remove('pulse');
  void containerEl.offsetWidth;
  containerEl.classList.add('pulse');
  setTimeout(() => containerEl.classList.remove('pulse'), 200);
}

function showSwipeIndicator(direction: 'up' | 'down' | 'left' | 'right') {
  const arrows: Record<string, string> = { up: '↑', down: '↓', left: '←', right: '→' };
  swipeIndicatorEl.textContent = arrows[direction] || '↕';
  swipeIndicatorEl.classList.add('visible');
  setTimeout(() => swipeIndicatorEl.classList.remove('visible'), 300);
}

function showToast(message: string) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Gesture hint update
function updateGestureHint() {
  const type = settings?.gesture?.type || 'vertical';
  const hints: Record<string, string> = {
    vertical: 'Swipe ↑↓ on trackpad',
    horizontal: 'Swipe ←→ on trackpad',
    diagonal: 'Swipe ↗↙ on trackpad',
    any: 'Swipe in any direction'
  };
  if (gestureHintEl) {
    gestureHintEl.textContent = hints[type] || hints.vertical;
  }
}

// Settings UI functions
function loadSettingsToUI() {
  if (!settings) return;

  gestureType.value = settings.gesture?.type || 'vertical';
  sensitivity.value = String(settings.gesture?.sensitivity || 30);
  sensitivityValue.textContent = `${settings.gesture?.sensitivity || 30}px`;
  stepSize.value = String(settings.brightness?.step || 5);
  stepSizeValue.textContent = `${settings.brightness?.step || 5}%`;
  minBrightness.value = String(settings.brightness?.min || 0);
  minBrightnessValue.textContent = `${settings.brightness?.min || 0}%`;
  maxBrightness.value = String(settings.brightness?.max || 100);
  maxBrightnessValue.textContent = `${settings.brightness?.max || 100}%`;
  
  if (settings.ui?.showNotification) {
    toggleNotification.classList.add('active');
  } else {
    toggleNotification.classList.remove('active');
  }
  
  notifPosition.value = settings.ui?.notificationPosition || 'top';
}

function getSettingsFromUI() {
  return {
    gesture: {
      type: gestureType.value,
      sensitivity: parseInt(sensitivity.value),
    },
    brightness: {
      step: parseInt(stepSize.value),
      min: parseInt(minBrightness.value),
      max: parseInt(maxBrightness.value),
    },
    ui: {
      showNotification: toggleNotification.classList.contains('active'),
      notificationPosition: notifPosition.value,
    }
  };
}

// Event listeners for settings controls
gestureType.addEventListener('change', () => {
  updateGestureHint();
});

sensitivity.addEventListener('input', () => {
  sensitivityValue.textContent = `${sensitivity.value}px`;
});

stepSize.addEventListener('input', () => {
  stepSizeValue.textContent = `${stepSize.value}%`;
});

minBrightness.addEventListener('input', () => {
  minBrightnessValue.textContent = `${minBrightness.value}%`;
});

maxBrightness.addEventListener('input', () => {
  maxBrightnessValue.textContent = `${maxBrightness.value}%`;
});

toggleNotification.addEventListener('click', () => {
  toggleNotification.classList.toggle('active');
});

// Open/Close settings
settingsBtn.addEventListener('click', () => {
  settingsPanel.classList.add('open');
});

closeSettings.addEventListener('click', () => {
  settingsPanel.classList.remove('open');
});

// Save settings
saveBtn.addEventListener('click', async () => {
  const newSettings = getSettingsFromUI();
  try {
    await electronAPI.saveSettings(newSettings);
    settings = newSettings;
    updateGestureHint();
    showToast('Settings saved ✓');
    settingsPanel.classList.remove('open');
  } catch (error) {
    showToast('Failed to save settings');
  }
});

// Reset settings
resetBtn.addEventListener('click', async () => {
  try {
    settings = await electronAPI.resetSettings();
    loadSettingsToUI();
    updateGestureHint();
    showToast('Settings reset');
  } catch (error) {
    showToast('Failed to reset settings');
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', async (event: KeyboardEvent) => {
  // Don't handle if settings panel is open
  if (settingsPanel.classList.contains('open')) return;

  // Increase brightness
  if (event.key === 'ArrowUp' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    const newValue = await electronAPI.increaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('up');
  } 
  // Decrease brightness
  else if (event.key === 'ArrowDown' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    const newValue = await electronAPI.decreaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('down');
  }
});

// Touch/swipe detection on the floating window
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let isTouchActive = false;

document.addEventListener('touchstart', (event: TouchEvent) => {
  if (event.touches.length === 1) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchStartTime = Date.now();
    isTouchActive = true;
  }
}, { passive: true });

document.addEventListener('touchmove', (event: TouchEvent) => {
  if (!isTouchActive || event.touches.length !== 1) return;
  
  const deltaX = event.touches[0].clientX - touchStartX;
  const deltaY = event.touches[0].clientY - touchStartY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Live preview based on distance
  const step = settings?.brightness?.step || 5;
  const sensitivity = settings?.gesture?.sensitivity || 30;
  const change = Math.round((distance / sensitivity) * step);
  
  let rawBrightness = currentBrightness;
  const gestureType = settings?.gesture?.type || 'vertical';
  
  if (gestureType === 'vertical') {
    rawBrightness = currentBrightness - Math.round(deltaY * 0.3);
  } else if (gestureType === 'horizontal') {
    rawBrightness = currentBrightness + Math.round(deltaX * 0.3);
  } else if (gestureType === 'diagonal') {
    rawBrightness = currentBrightness - Math.round((deltaY - deltaX) * 0.15);
  } else {
    // Any direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      rawBrightness = currentBrightness + Math.round(deltaX * 0.3);
    } else {
      rawBrightness = currentBrightness - Math.round(deltaY * 0.3);
    }
  }
  
  const clamped = Math.max(0, Math.min(100, rawBrightness));
  brightnessValueEl.textContent = `${clamped}%`;
  progressFillEl.style.width = `${clamped}%`;
}, { passive: true });

document.addEventListener('touchend', async (event: TouchEvent) => {
  if (!isTouchActive) return;
  isTouchActive = false;

  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;
  const deltaTime = Date.now() - touchStartTime;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  const sensitivity = settings?.gesture?.sensitivity || 30;
  const gestureType = settings?.gesture?.type || 'vertical';

  if (distance < sensitivity) {
    // Reset to actual brightness on small movement
    const actual = await electronAPI.getCurrentBrightness();
    updateDisplay(actual);
    return;
  }
  if (deltaTime > 600) return;

  let direction: 'up' | 'down' | 'left' | 'right' | null = null;
  let action: 'increase' | 'decrease' | null = null;

  switch (gestureType) {
    case 'vertical':
      if (deltaY < -sensitivity) { direction = 'up'; action = 'increase'; }
      else if (deltaY > sensitivity) { direction = 'down'; action = 'decrease'; }
      break;
    case 'horizontal':
      if (deltaX > sensitivity) { direction = 'right'; action = 'increase'; }
      else if (deltaX < -sensitivity) { direction = 'left'; action = 'decrease'; }
      break;
    case 'diagonal':
      if (deltaY < -sensitivity && deltaX > sensitivity) { direction = 'up'; action = 'increase'; }
      else if (deltaY > sensitivity && deltaX < -sensitivity) { direction = 'down'; action = 'decrease'; }
      else if (deltaY < -sensitivity) { direction = 'up'; action = 'increase'; }
      else if (deltaY > sensitivity) { direction = 'down'; action = 'decrease'; }
      break;
    case 'any':
    default:
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) { direction = 'right'; action = 'increase'; }
        else { direction = 'left'; action = 'decrease'; }
      } else {
        if (deltaY < 0) { direction = 'up'; action = 'increase'; }
        else { direction = 'down'; action = 'decrease'; }
      }
  }

  if (action === 'increase') {
    const newValue = await electronAPI.increaseBrightness();
    updateDisplay(newValue);
  } else if (action === 'decrease') {
    const newValue = await electronAPI.decreaseBrightness();
    updateDisplay(newValue);
  } else {
    const actual = await electronAPI.getCurrentBrightness();
    updateDisplay(actual);
  }

  if (direction) {
    showSwipeIndicator(direction);
  }
}, { passive: true });

init();
