/**
 * Just Slip v3.0.0 - Renderer (JavaScript with Three.js)
 * 3D UI, Dual Mode (Brightness/Volume), Gesture Learning, Themes
 */

// Electron API
const { ipcRenderer } = require('electron');
const electronAPI = {
  getMode: () => ipcRenderer.invoke('mode:get'),
  switchMode: (mode) => ipcRenderer.invoke('mode:switch', mode),
  increaseControl: () => ipcRenderer.invoke('control:increase'),
  decreaseControl: () => ipcRenderer.invoke('control:decrease'),
  setControl: (value) => ipcRenderer.invoke('control:set', value),
  getControlValue: () => ipcRenderer.invoke('control:get'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:set', 'gesture.type', settings.gesture?.type).then(() => settings),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  learnGesture: (data) => ipcRenderer.invoke('gesture:learn', data),
  getLearnedGesture: () => ipcRenderer.invoke('gesture:getLearned'),
  closeWindow: () => ipcRenderer.send('window:close'),
};

// State
let currentValue = 50;
let settings = null;
let currentMode = 'brightness';
let isSettingsOpen = false;
let isLearningMode = false;
let touchStartPos = { x: 0, y: 0 };
let touchStartTime = 0;
let isTouchActive = false;

// Three.js variables
let scene, camera, renderer, mainMesh, glowMesh, particles;
let animationId;

// Themes
const THEMES = {
  ocean: { primary: '#667eea', secondary: '#764ba2', bg: '#0a1628', accent: '#00d4ff' },
  sunset: { primary: '#f093fb', secondary: '#f5576c', bg: '#1a0a0a', accent: '#ff6b6b' },
  forest: { primary: '#11998e', secondary: '#38ef7d', bg: '#0a1a0a', accent: '#00ff88' },
  midnight: { primary: '#2c3e50', secondary: '#4ca1af', bg: '#0d1117', accent: '#00ffcc' },
  neon: { primary: '#ff00ff', secondary: '#00ffff', bg: '#0a0a0a', accent: '#ffff00' }
};

// Init
async function init() {
  try {
    await initThreeJS();
    await loadSettings();
    updateUI();
    setupEventListeners();
    animate();
  } catch (error) {
    console.error('Init failed:', error);
  }
}

// Three.js Setup
function initThreeJS() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Main sphere
  const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x667eea,
    emissive: 0x667eea,
    emissiveIntensity: 0.3,
    shininess: 100,
    transparent: true,
    opacity: 0.9
  });
  mainMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(mainMesh);

  // Glow
  const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x667eea,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
  });
  glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glowMesh);

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x667eea,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });
  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  const pointLight2 = new THREE.PointLight(0x667eea, 0.5);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (mainMesh) {
    mainMesh.rotation.x += 0.005;
    mainMesh.rotation.y += 0.01;
  }
  if (glowMesh) {
    glowMesh.rotation.x -= 0.003;
    glowMesh.rotation.y -= 0.005;
  }
  if (particles) {
    particles.rotation.y += 0.001;
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function updateThreeJS(value, theme) {
  if (!mainMesh || !scene) return;
  const primaryColor = new THREE.Color(theme.primary || '#667eea');
  const secondaryColor = new THREE.Color(theme.secondary || '#764ba2');
  mainMesh.material.color.lerpColors(primaryColor, secondaryColor, value / 100);
  mainMesh.material.emissive.copy(primaryColor);
  glowMesh.material.color.copy(primaryColor);
  particles.material.color.copy(primaryColor);
  const scale = 0.8 + (value / 100) * 0.6;
  mainMesh.scale.set(scale, scale, scale);
  glowMesh.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
  
  const circle = document.getElementById('progressCircle');
  if (circle) {
    const circumference = 502.65;
    const offset = circumference - (value / 100) * circumference;
    circle.style.strokeDashoffset = offset.toString();
  }
}

// UI Functions
async function loadSettings() {
  try {
    settings = await electronAPI.getSettings();
    currentMode = await electronAPI.getMode();
    currentValue = await electronAPI.getControlValue();
    applyTheme(settings.ui?.theme || 'ocean');
    updateUI();
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

function updateUI() {
  if (!settings) return;
  const modeIcon = document.getElementById('modeIcon');
  const modeText = document.getElementById('modeText');
  const valueLabel = document.getElementById('valueLabel');
  if (currentMode === 'brightness') {
    if (modeIcon) modeIcon.textContent = '☀️';
    if (modeText) modeText.textContent = 'Brightness';
    if (valueLabel) valueLabel.textContent = 'Screen Brightness';
  } else {
    if (modeIcon) modeIcon.textContent = '🔊';
    if (modeText) modeText.textContent = 'Volume';
    if (valueLabel) valueLabel.textContent = 'System Volume';
  }
  const valueDisplay = document.getElementById('valueDisplay');
  if (valueDisplay) valueDisplay.textContent = currentValue + '%';
  loadSettingsToUI();
  const theme = THEMES[settings.ui?.theme] || THEMES.ocean;
  updateThreeJS(currentValue, theme);
}

function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES.ocean;
  document.documentElement.style.setProperty('--primary', theme.primary);
  document.documentElement.style.setProperty('--secondary', theme.secondary);
  document.documentElement.style.setProperty('--bg', theme.bg);
  document.documentElement.style.setProperty('--accent', theme.accent);
}

function loadSettingsToUI() {
  if (!settings) return;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = String(val);
  };
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };

  setVal('gestureType', settings.gesture?.type || 'vertical');
  setVal('sensitivity', settings.gesture?.sensitivity || 30);
  setTxt('sensitivityValue', (settings.gesture?.sensitivity || 30) + 'px');
  setVal('stepSize', settings.brightness?.step || 5);
  setTxt('stepSizeValue', (settings.brightness?.step || 5) + '%');
  setVal('minBrightness', settings.brightness?.min || 0);
  setTxt('minBrightnessValue', (settings.brightness?.min || 0) + '%');
  setVal('maxBrightness', settings.brightness?.max || 100);
  setTxt('maxBrightnessValue', (settings.brightness?.max || 100) + '%');
  setVal('volumeStep', settings.volume?.step || 5);
  setTxt('volumeStepValue', (settings.volume?.step || 5) + '%');
  setVal('volumeMin', settings.volume?.min || 0);
  setTxt('volumeMinValue', (settings.volume?.min || 0) + '%');
  setVal('volumeMax', settings.volume?.max || 100);
  setTxt('volumeMaxValue', (settings.volume?.max || 100) + '%');

  const learnToggle = document.getElementById('toggleLearn');
  if (learnToggle) {
    learnToggle.classList.toggle('active', !!settings.gesture?.learnFromFirstSwipe);
  }

  const activeTheme = settings.ui?.theme || 'ocean';
  document.querySelectorAll('.theme-option').forEach(el => {
    el.classList.toggle('active', el.dataset.theme === activeTheme);
  });

  updateGesturePreview();
}

function updateGesturePreview() {
  const preview = document.getElementById('gesturePreview');
  const hint = document.getElementById('gestureHint');
  if (!preview || !hint) return;
  const learned = settings?.gesture?.learnedPattern;
  if (learned) {
    preview.classList.add('learned');
    preview.textContent = getGestureEmoji(learned.direction);
    hint.textContent = 'Learned: ' + learned.direction;
  } else {
    preview.classList.remove('learned');
    hint.textContent = isLearningMode ? 'Swipe to learn your gesture...' : 'Swipe to learn your gesture';
  }
}

function getGestureEmoji(direction) {
  const emojis = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
  return emojis[direction] || '👆';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }
}

function getSettingsFromUI() {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : null;
  };
  const getNum = (id, def) => {
    const v = getVal(id);
    return v ? parseInt(v) : def;
  };
  const getBool = (id) => {
    const el = document.getElementById(id);
    return el ? el.classList.contains('active') : false;
  };

  return {
    gesture: {
      type: getVal('gestureType') || 'vertical',
      sensitivity: getNum('sensitivity', 30),
      learnFromFirstSwipe: getBool('toggleLearn'),
    },
    brightness: {
      step: getNum('stepSize', 5),
      min: getNum('minBrightness', 0),
      max: getNum('maxBrightness', 100),
    },
    volume: {
      step: getNum('volumeStep', 5),
      min: getNum('volumeMin', 0),
      max: getNum('volumeMax', 100),
    },
    ui: {
      theme: document.querySelector('.theme-option.active')?.dataset.theme || 'ocean',
    }
  };
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    isSettingsOpen = true;
    document.getElementById('settingsPanel')?.classList.add('open');
  });

  document.getElementById('closeSettings')?.addEventListener('click', () => {
    isSettingsOpen = false;
    document.getElementById('settingsPanel')?.classList.remove('open');
  });

  document.getElementById('saveBtn')?.addEventListener('click', async () => {
    const newSettings = getSettingsFromUI();
    try {
      await electronAPI.saveSettings(newSettings);
      settings = newSettings;
      applyTheme(newSettings.ui?.theme || 'ocean');
      updateUI();
      showToast('Settings saved ✓');
      isSettingsOpen = false;
      document.getElementById('settingsPanel')?.classList.remove('open');
    } catch (error) {
      showToast('Failed to save settings');
    }
  });

  document.getElementById('resetBtn')?.addEventListener('click', async () => {
    try {
      settings = await electronAPI.resetSettings();
      loadSettingsToUI();
      updateUI();
      showToast('Settings reset');
    } catch (error) {
      showToast('Failed to reset settings');
    }
  });

  document.querySelectorAll('.theme-option').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.theme-option').forEach(e => e.classList.remove('active'));
      el.classList.add('active');
    });
  });

  document.querySelectorAll('.mode-btn').forEach(el => {
    el.addEventListener('click', async () => {
      const mode = el.dataset.mode;
      if (mode && mode !== currentMode) {
        currentMode = await electronAPI.switchMode(mode);
        document.querySelectorAll('.mode-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.mode === currentMode);
        });
        updateUI();
      }
    });
  });

  // Range inputs
  const rangeIds = ['sensitivity', 'stepSize', 'minBrightness', 'maxBrightness', 'volumeStep', 'volumeMin', 'volumeMax'];
  rangeIds.forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      const txtId = id + 'Value';
      const txtEl = document.getElementById(txtId);
      if (txtEl) {
        const suffix = id === 'sensitivity' ? 'px' : '%';
        txtEl.textContent = e.target.value + suffix;
      }
    });
  });

  // Keyboard
  document.addEventListener('keydown', async (event) => {
    if (isSettingsOpen) return;
    if (event.key === 'ArrowUp' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      const newValue = await electronAPI.increaseControl();
      updateValueDisplay(newValue);
      showSwipeIndicator('up');
    } else if (event.key === 'ArrowDown' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      const newValue = await electronAPI.decreaseControl();
      updateValueDisplay(newValue);
      showSwipeIndicator('down');
    }
  });

  // Touch
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      touchStartPos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      touchStartTime = Date.now();
      isTouchActive = true;
      if (settings?.gesture?.learnFromFirstSwipe && !settings.gesture.learnedPattern) {
        isLearningMode = true;
        updateGesturePreview();
      }
    }
  }, { passive: true });

  document.addEventListener('touchmove', (event) => {
    if (!isTouchActive || event.touches.length !== 1 || isSettingsOpen) return;
    const deltaX = event.touches[0].clientX - touchStartPos.x;
    const deltaY = event.touches[0].clientY - touchStartPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const step = settings?.brightness?.step || 5;
    const sensitivity = settings?.gesture?.sensitivity || 30;
    let rawValue = currentValue;
    const gestureType = settings?.gesture?.type || 'vertical';
    if (gestureType === 'vertical') rawValue = currentValue - Math.round(deltaY * 0.3);
    else if (gestureType === 'horizontal') rawValue = currentValue + Math.round(deltaX * 0.3);
    else if (gestureType === 'diagonal') rawValue = currentValue - Math.round((deltaY - deltaX) * 0.15);
    else {
      if (Math.abs(deltaX) > Math.abs(deltaY)) rawValue = currentValue + Math.round(deltaX * 0.3);
      else rawValue = currentValue - Math.round(deltaY * 0.3);
    }
    const clamped = Math.max(0, Math.min(100, rawValue));
    const valueDisplay = document.getElementById('valueDisplay');
    if (valueDisplay) valueDisplay.textContent = clamped + '%';
  }, { passive: true });

  document.addEventListener('touchend', async (event) => {
    if (!isTouchActive || isSettingsOpen) return;
    isTouchActive = false;
    const deltaX = event.changedTouches[0].clientX - touchStartPos.x;
    const deltaY = event.changedTouches[0].clientY - touchStartPos.y;
    const deltaTime = Date.now() - touchStartTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const sensitivity = settings?.gesture?.sensitivity || 30;

    // Learn gesture
    if (isLearningMode && distance >= sensitivity) {
      await electronAPI.learnGesture({
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
        startX: touchStartPos.x,
        startY: touchStartPos.y,
        time: Date.now()
      });
      settings = await electronAPI.getSettings();
      isLearningMode = false;
      updateGesturePreview();
      showToast('Gesture learned! ✓');
    }

    if (distance < sensitivity) {
      const actual = await electronAPI.getControlValue();
      updateValueDisplay(actual);
      return;
    }
    if (deltaTime > 600) return;

    const gestureType = settings?.gesture?.type || 'vertical';
    let action = null;
    let direction = 'unknown';

    if (gestureType === 'vertical') {
      if (deltaY < -sensitivity) { direction = 'up'; action = 'increase'; }
      else if (deltaY > sensitivity) { direction = 'down'; action = 'decrease'; }
    } else if (gestureType === 'horizontal') {
      if (deltaX > sensitivity) { direction = 'right'; action = 'increase'; }
      else if (deltaX < -sensitivity) { direction = 'left'; action = 'decrease'; }
    } else if (gestureType === 'diagonal') {
      if (deltaY < -sensitivity && deltaX > sensitivity) { direction = 'up'; action = 'increase'; }
      else if (deltaY > sensitivity && deltaX < -sensitivity) { direction = 'down'; action = 'decrease'; }
      else if (deltaY < -sensitivity) { direction = 'up'; action = 'increase'; }
      else if (deltaY > sensitivity) { direction = 'down'; action = 'decrease'; }
    } else {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) { direction = 'right'; action = 'increase'; }
        else { direction = 'left'; action = 'decrease'; }
      } else {
        if (deltaY < 0) { direction = 'up'; action = 'increase'; }
        else { direction = 'down'; action = 'decrease'; }
      }
    }

    if (action === 'increase') {
      const newValue = await electronAPI.increaseControl();
      updateValueDisplay(newValue);
    } else if (action === 'decrease') {
      const newValue = await electronAPI.decreaseControl();
      updateValueDisplay(newValue);
    } else {
      const actual = await electronAPI.getControlValue();
      updateValueDisplay(actual);
    }
    if (direction !== 'unknown') showSwipeIndicator(direction);
  }, { passive: true });
}

function updateValueDisplay(value) {
  currentValue = value;
  const valueDisplay = document.getElementById('valueDisplay');
  if (valueDisplay) valueDisplay.textContent = value + '%';
  const theme = THEMES[settings?.ui?.theme] || THEMES.ocean;
  updateThreeJS(value, theme);
  const display = document.getElementById('valueDisplay');
  if (display) {
    display.style.transform = 'scale(1.1)';
    setTimeout(() => display.style.transform = 'scale(1)', 150);
  }
}

function showSwipeIndicator(direction) {
  const indicator = document.getElementById('swipeIndicator');
  if (!indicator) return;
  const arrows = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
  indicator.textContent = arrows[direction] || '↕';
  indicator.classList.add('visible');
  setTimeout(() => indicator.classList.remove('visible'), 400);
}

// Start
init();
