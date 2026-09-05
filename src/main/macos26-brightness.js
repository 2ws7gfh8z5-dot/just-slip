/**
 * macOS 26+ Display Brightness Controller
 * Uses CAWindowServerDisplay for actual brightness control
 */

const { CAWindowServerDisplay, CGMainDisplayID } = require('quartz');

class Macos26BrightnessController {
  constructor() {
    this.currentBrightness = 50;
    this.minimumBrightness = 0;
    this.maximumBrightness = 100;
    this.step = 5;
    this.display = null;
    this.initDisplay();
  }

  initDisplay() {
    try {
      const displayId = CGMainDisplayID();
      this.display = CAWindowServerDisplay.alloc().init();
      console.log(`Display controller initialized for display ID: ${displayId}`);
    } catch (error) {
      console.error('Failed to initialize display controller:', error.message);
    }
  }

  getBrightness() {
    return this.currentBrightness;
  }

  setBrightness(value) {
    if (!this.display) {
      console.warn('Display controller not initialized');
      return false;
    }

    try {
      const normalized = Math.max(this.minimumBrightness, Math.min(this.maximumBrightness, value)) / 100;
      
      // Use SDR brightness control
      this.display.setSDRBrightness_(normalized);
      
      // Commit the change
      this.display.commitBrightness_(null);
      
      this.currentBrightness = value;
      console.log(`Set brightness to ${value}%`);
      return true;
    } catch (error) {
      console.error('Failed to set brightness:', error.message);
      return false;
    }
  }

  increase() {
    const newValue = Math.min(this.maximumBrightness, this.currentBrightness + this.step);
    this.setBrightness(newValue);
    return newValue;
  }

  decrease() {
    const newValue = Math.max(this.minimumBrightness, this.currentBrightness - this.step);
    this.setBrightness(newValue);
    return newValue;
  }
}

module.exports = { Macos26BrightnessController };
