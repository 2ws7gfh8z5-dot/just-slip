/**
 * Just Slip v3.0.0 - Gesture Engine with Learning
 * Supports custom gesture patterns and auto-learning
 */

class GestureEngine {
  constructor(settings) {
    this.settings = settings;
    this.touchStart = null;
    this.touchStartTime = null;
    this.lastGestureTime = 0;
    this.gestureHistory = [];
    this.learnedPattern = null;
    this.isLearningMode = false;
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

    return { deltaX, deltaY, distance, angle, direction: this.getDirection(angle, distance) };
  }

  /**
   * Determine gesture direction based on settings
   */
  getDirection(angle, distance) {
    const minDistance = this.settings.gesture?.sensitivity || 30;
    
    if (distance < minDistance) return null;

    const type = this.settings.gesture?.type || 'vertical';

    switch (type) {
      case 'vertical':
        if (angle > -45 && angle <= 45) return 'right';
        if (angle > 45 && angle <= 135) return 'down';
        if (angle > -135 && angle <= -45) return 'up';
        return 'left';
      
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
        const normalizedAngle = ((angle % 360) + 360) % 360;
        if (normalizedAngle >= 315 || normalizedAngle < 45) return 'right';
        if (normalizedAngle >= 45 && normalizedAngle < 135) return 'down';
        if (normalizedAngle >= 135 && normalizedAngle < 225) return 'left';
        return 'up';
      
      case 'any':
      default:
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
    
    // Debounce
    if (endTime - this.lastGestureTime < (this.settings.advanced?.debounceMs || 100)) {
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

    // Save to history
    this.gestureHistory.push({
      direction: estimate.direction,
      angle: estimate.angle,
      distance: estimate.distance,
      time: endTime
    });

    // Keep only last 5 gestures
    if (this.gestureHistory.length > 5) {
      this.gestureHistory.shift();
    }

    return estimate;
  }

  /**
   * Learn from user's gesture pattern
   */
  learnGesture(data) {
    const { x, y, startX, startY, time } = data;
    const deltaX = x - startX;
    const deltaY = y - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Determine direction
    let direction = 'unknown';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    const pattern = {
      direction,
      angle: Math.round(angle),
      distance: Math.round(distance),
      isDiagonal: Math.abs(deltaX) > 20 && Math.abs(deltaY) > 20,
      timestamp: time
    };

    // Store learned pattern
    this.learnedPattern = pattern;
    this.gestureHistory.push(pattern);

    console.log('Learned gesture pattern:', pattern);
    return pattern;
  }

  /**
   * Get action based on gesture result
   */
  getAction(gestureResult) {
    if (!gestureResult) return null;

    const type = this.settings.gesture?.type || 'vertical';

    // If user has learned a custom pattern, use it
    if (this.learnedPattern && this.settings.gesture?.learnFromFirstSwipe) {
      if (this.learnedPattern.direction === 'up' || this.learnedPattern.direction === 'right') {
        return 'increase';
      }
      return 'decrease';
    }

    switch (type) {
      case 'vertical':
        return gestureResult.direction === 'up' ? 'increase' : 
               gestureResult.direction === 'down' ? 'decrease' : null;
      case 'horizontal':
        return gestureResult.direction === 'right' ? 'increase' : 
               gestureResult.direction === 'left' ? 'decrease' : null;
      case 'diagonal':
        return (gestureResult.direction === 'down' || gestureResult.direction === 'right') ? 'increase' : 'decrease';
      case 'any':
      default:
        return (gestureResult.direction === 'up' || gestureResult.direction === 'right') ? 'increase' : 'decrease';
    }
  }

  /**
   * Calculate brightness/volume change amount
   */
  calculateChange(gestureResult) {
    if (!gestureResult) return this.settings.brightness?.step || 5;
    
    const step = this.settings.brightness?.step || 5;
    const distanceFactor = Math.min(gestureResult.distance / (this.settings.gesture?.sensitivity || 30), 3);
    return Math.round(step * distanceFactor);
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
