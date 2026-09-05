/**
 * Just Slip - Renderer process
 * Handles UI updates, keyboard shortcuts, and touch/swipe detection
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
}

// Extend window with electron API
declare const electronAPI: ElectronAPI;

const brightnessValueEl = document.getElementById('brightnessValue') as HTMLElement;
const progressFillEl = document.getElementById('progressFill') as HTMLElement;
const swipeIndicatorEl = document.getElementById('swipeIndicator') as HTMLElement;
const containerEl = document.querySelector('.container') as HTMLElement;

let currentBrightness = 50;

// Initialize
async function init() {
  try {
    currentBrightness = await electronAPI.getCurrentBrightness();
    updateDisplay(currentBrightness);
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
  void containerEl.offsetWidth; // force reflow
  containerEl.classList.add('pulse');
  setTimeout(() => containerEl.classList.remove('pulse'), 200);
}

function showSwipeIndicator(direction: 'up' | 'down') {
  swipeIndicatorEl.textContent = direction === 'up' ? '↑' : '↓';
  swipeIndicatorEl.classList.add('visible');
  setTimeout(() => swipeIndicatorEl.classList.remove('visible'), 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', async (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    const newValue = await electronAPI.increaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('up');
  } else if (event.key === 'ArrowDown' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    const newValue = await electronAPI.decreaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('down');
  }
});

// Touch/swipe detection on the floating window
let touchStartY = 0;
let touchStartTime = 0;
let isTouchActive = false;

document.addEventListener('touchstart', (event: TouchEvent) => {
  if (event.touches.length === 1) {
    touchStartY = event.touches[0].clientY;
    touchStartTime = Date.now();
    isTouchActive = true;
  }
}, { passive: true });

document.addEventListener('touchmove', (event: TouchEvent) => {
  if (!isTouchActive || event.touches.length !== 1) return;
  // Live preview of brightness change during swipe
  const deltaY = event.touches[0].clientY - touchStartY;
  const rawBrightness = currentBrightness - Math.round(deltaY * 0.3);
  const clamped = Math.max(0, Math.min(100, rawBrightness));
  brightnessValueEl.textContent = `${clamped}%`;
  progressFillEl.style.width = `${clamped}%`;
}, { passive: true });

document.addEventListener('touchend', async (event: TouchEvent) => {
  if (!isTouchActive) return;
  isTouchActive = false;

  const deltaY = event.changedTouches[0].clientY - touchStartY;
  const deltaTime = Date.now() - touchStartTime;

  if (Math.abs(deltaY) < 15) {
    // Reset to actual brightness on tap/small movement
    const actual = await electronAPI.getCurrentBrightness();
    updateDisplay(actual);
    return;
  }
  if (deltaTime > 600) return;

  if (deltaY < 0) {
    const newValue = await electronAPI.increaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('up');
  } else {
    const newValue = await electronAPI.decreaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('down');
  }
}, { passive: true });

init();
