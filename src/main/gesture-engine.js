/**
 * Just Slip - Gesture Engine
 * Handles different gesture types and directions
 */

class GestureEngine {
  constructor(settings) {
    this.settings = settings;
    this.touchStart = null;
    this.touchStartTime = null;
    this.lastGestureTime = 0;
    this.isProcessing = false;
  }

  /**
   * Start tracking a touch/gesture
   */
  start(x, y, timestamp) {
    this.touchStart = { x, y };
    this.touchStartTime = timestamp || Date.now();
    this.isProcessing = false;
  }

  /**
   * Get current gesture direction estimate
   */
  estimateDirection(x, y) {
    if (!this.touchStart) return null;

    const deltaX = x - this.touchStart.x;
    const deltaY = y - this.touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    return {
      deltaX,
      deltaY,
      distance,
      angle,
      direction: this.getDirection(angle, distance)
    };
  }

  /**
   * Determine gesture direction based on settings
   */
  getDirection(angle, distance) {
    const minDistance = this.settings.gesture.sensitivity;
    
    if (distance < minDistance) return null;

    const type = this.settings.gesture.type;

    switch (type) {
      case 'vertical':
        return angle > -45 && angle <= 45 ? 'right' :
               angle > 45 && angle <= 135 ? 'down' :
               angle > -135 && angle <= -45 ? 'up' : 'left';
      
      case 'horizontal':
        if (angle > -22.5 && angle <= 22.5) return 'right';
        if (angle > 22.5 && angle <= 67.5) return 'down-right';
        if (angle > 67.5 && angle <= 112.5) return 'down';
        if (angle > 112.5 && angle <= 157.5) return 'down-left';
        if (angle > 157.5 || angle <= -157.5) return 'left';
        if (angle > -157.5 && angle <= -112.5) return 'up-left';
        if (angle > -112.5 && angle <= -67.5) return 'up';
        if (angle > -67.5 && angle <= -22.5) return 'up-right';
        return null;
      
      case 'diagonal':
        // Allow 45° tolerance from diagonal directions
        const normalizedAngle = ((angle % 360) + 360) % 360;
        if (normalizedAngle >= 315 || normalizedAngle < 45) return 'right';
        if (normalizedAngle >= 45 && normalizedAngle < 135) return 'down';
        if (normalizedAngle >= 135 && normalizedAngle < 225) return 'left';
        return 'up';
      
      case 'any':
      default:
        // Map to cardinal directions
        if (angle > -45 && angle <= 45) return 'right';
        if (angle > 45 && angle <= 135) return 'down';
        if (angle > -135 && angle <= -45) return 'up';
        return 'left';
    }
  }

  /**
   * End gesture and determine action
   */
  end(x, y, timestamp) {
    if (!this.touchStart) return null;

    const endTime = timestamp || Date.now();
    const deltaTime = endTime - this.touchStartTime;
    
    // Debounce check
    if (endTime - this.lastGestureTime < this.settings.advanced.debounceMs) {
      this.touchStart = null;
      return null;
    }

    const estimate = this.estimateDirection(x, y);
    if (!estimate) {
      this.touchStart = null;
      return null;
    }

    this.touchStart = null;
    this.lastGestureTime = endTime;

    return {
      direction: estimate.direction,
      distance: estimate.distance,
      angle: estimate.angle,
      deltaTime
    };
  }

  /**
   * Get gesture action based on direction
   */
  getAction(gestureResult) {
    if (!gestureResult) return null;

    const { direction } = gestureResult;
    const type = this.settings.gesture.type;

    switch (type) {
      case 'vertical':
        if (direction === 'up') return 'increase';
        if (direction === 'down') return 'decrease';
        return null;
      
      case 'horizontal':
        if (direction === 'right') return 'increase';
        if (direction === 'left') return 'decrease';
        return null;
      
      case 'diagonal':
        // Top-left to bottom-right = increase
        // Top-right to bottom-left = decrease
        if (direction === 'down' || direction === 'right') return 'increase';
        if (direction === 'up' || direction === 'left') return 'decrease';
        return null;
      
      case 'any':
      default:
        if (direction === 'up' || direction === 'right') return 'increase';
        if (direction === 'down' || direction === 'left') return 'decrease';
        return null;
    }
  }

  /**
   * Calculate brightness change amount
   */
  calculateBrightnessChange(gestureResult) {
    if (!gestureResult) return this.settings.brightness.step;
    
    // Scale with distance but cap at step * 3
    const distanceFactor = Math.min(gestureResult.distance / this.settings.gesture.sensitivity, 3);
    return Math.round(this.settings.brightness.step * distanceFactor);
  }

  /**
   * Reset state
   */
  reset() {
    this.touchStart = null;
    this.touchStartTime = null;
    this.isProcessing = false;
  }

  /**
   * Update settings
   */
  updateSettings(newSettings) {
    this.settings = newSettings;
  }
}

module.exports = GestureEngine;
