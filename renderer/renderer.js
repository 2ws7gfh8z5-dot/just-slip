/**
 * Just Slip - Renderer process
 * Minimal UI for brightness control
 */

const brightnessValueEl = document.getElementById('brightnessValue');
const progressFillEl = document.getElementById('progressFill');
const swipeIndicatorEl = document.getElementById('swipeIndicator');
const containerEl = document.querySelector('.container');

let currentBrightness = 50;

// Initialize
async function init() {
  try {
    currentBrightness = await window.electronAPI.getCurrentBrightness();
    updateDisplay(currentBrightness);
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

function updateDisplay(value) {
  currentBrightness = value;
  brightnessValueEl.textContent = `${value}%`;
  progressFillEl.style.width = `${value}%`;

  // Add pulse animation
  containerEl.classList.add('pulse');
  setTimeout(() => containerEl.classList.remove('pulse'), 200);
}

function showSwipeIndicator(direction) {
  swipeIndicatorEl.textContent = direction === 'up' ? '↑' : '↓';
  swipeIndicatorEl.classList.add('visible');
  setTimeout(() => swipeIndicatorEl.classList.remove('visible'), 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', async (event) => {
  if (event.key === 'ArrowUp' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    const newValue = await window.electronAPI.increaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('up');
  } else if (event.key === 'ArrowDown' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    const newValue = await window.electronAPI.decreaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('down');
  }
});

// Touch/swipe detection
let touchStartY = null;
let touchStartTime = null;

document.addEventListener('touchstart', (event) => {
  if (event.touches.length === 1) {
    touchStartY = event.touches[0].clientY;
    touchStartTime = Date.now();
  }
}, { passive: true });

document.addEventListener('touchend', async (event) => {
  if (!touchStartY || !touchStartTime) return;

  const deltaY = event.changedTouches[0].clientY - touchStartY;
  const deltaTime = Date.now() - touchStartTime;

  touchStartY = null;
  touchStartTime = null;

  if (Math.abs(deltaY) < 20) return;
  if (deltaTime > 500) return;

  if (deltaY < 0) {
    const newValue = await window.electronAPI.increaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('up');
  } else if (deltaY > 0) {
    const newValue = await window.electronAPI.decreaseBrightness();
    updateDisplay(newValue);
    showSwipeIndicator('down');
  }
}, { passive: true });

init();
