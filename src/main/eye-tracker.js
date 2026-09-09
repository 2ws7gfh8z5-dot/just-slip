/**
 * Just Slip — Eye Tracking System ("eye searching system")
 *
 * Captures the user's face via webcam and tracks 5 eye-space landmarks:
 *   inner corner, outer corner, top of eye, bottom of eye, pupil center.
 *
 * Mapping (parallel to the existing trackpad gestures, independent):
 *   - VERTICAL eye motion (top<->bottom) -> screen BRIGHTNESS
 *       eyes UP   -> brighter (bright to dark, top to bottom)
 *       eyes DOWN -> darker
 *   - HORIZONTAL eye motion (inner<->outer) -> system VOLUME
 *       eyes LEFT  -> louder
 *       eyes RIGHT -> quieter
 *
 * All personal eye data is kept LOCAL ONLY (config.json), never uploaded.
 * Uses MediaPipe FaceMesh running in the renderer (offline, no API).
 */

const path = require('path');
const fs = require('fs');

// MediaPipe FaceMesh landmark indices (478-landmark model)
const LANDMARKS = {
  innerLeft: 133,   // inner corner of left eye (user's left)
  outerLeft: 33,    // outer corner of left eye
  topLeft: 159,     // top of left eye
  bottomLeft: 145,  // bottom of left eye
  pupilLeft: 474,   // iris center of left eye
  innerRight: 362,  // inner corner of right eye
  outerRight: 263,  // outer corner of right eye
  topRight: 386,    // top of right eye
  bottomRight: 374, // bottom of right eye
  pupilRight: 462   // iris center of right eye
};

// Five user-facing points, merged from both eyes (averaged for robustness)
const FIVE_POINTS = {
  inner: [LANDMARKS.innerLeft, LANDMARKS.innerRight],
  outer: [LANDMARKS.outerLeft, LANDMARKS.outerRight],
  top: [LANDMARKS.topLeft, LANDMARKS.topRight],
  bottom: [LANDMARKS.bottomLeft, LANDMARKS.bottomRight],
  pupil: [LANDMARKS.pupilLeft, LANDMARKS.pupilRight]
};

function normalize(v) {
  if (!v) return null;
  return {
    x: Math.round(v.x * 1e4) / 1e4,
    y: Math.round(v.y * 1e4) / 1e4,
    z: Math.round((v.z || 0) * 1e4) / 1e4
  };
}

function lerp(a, b, t) {
  if (a == null) return b;
  if (b == null) return a;
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: (a.z || 0) + ((b.z || 0) - (a.z || 0)) * t
  };
}

/**
 * Extract the 5 user-facing points from a FaceMesh landmarks array.
 * Each value: { x, y, z } in normalized image coordinates (0..1).
 */
function extractFivePoints(landmarks) {
  if (!landmarks || landmarks.length < 478) return null;

  const merge = (idxs) => {
    const pts = idxs.map(i => landmarks[i]).filter(Boolean);
    if (!pts.length) return null;
    const acc = { x: 0, y: 0, z: 0 };
    for (const p of pts) {
      acc.x += p.x; acc.y += p.y; acc.z += (p.z || 0);
    }
    return normalize({ x: acc.x / pts.length, y: acc.y / pts.length, z: acc.z / pts.length });
  };

  const points = {};
  let found = 0;
  for (const key of Object.keys(FIVE_POINTS)) {
    points[key] = merge(FIVE_POINTS[key]);
    if (points[key]) found++;
  }
  // Need all 5 points to trust a frame
  return found === 5 ? points : null;
}

/**
 * Derive the two motion vectors the mapping uses, from the 5 points:
 *   vertical:   top -> bottom  (dy drives brightness)
 *   horizontal: inner -> outer (dx drives volume)
 */
function deriveVectors(points) {
  const v = {};
  const vert = lerp(points.top, points.bottom, 1);
  v.vertical = {
    dx: vert ? vert.x - points.top.x : 0,
    dy: vert ? vert.y - points.top.y : 0,
    from: points.top,
    to: points.bottom
  };
  const horz = lerp(points.inner, points.outer, 1);
  v.horizontal = {
    dx: horz ? horz.x - points.inner.x : 0,
    dy: horz ? horz.y - points.inner.y : 0,
    from: points.inner,
    to: points.outer
  };
  // Pupil center (the reference point for the "eye search")
  v.pupil = points.pupil;
  return v;
}

/**
 * Map eye motion to a control delta.
 *   axis: 'vertical' (brightness) or 'horizontal' (volume)
 *   Returns signed delta in [-1, 1]; >0 = increase, <0 = decrease.
 *
 * Brightness: up -> + (brighter), down -> - (darker)
 * Volume:     left -> + (louder), right -> - (quieter)
 */
function mapToDelta(vectors, axis, sensitivity = 0.05, hysteresis = 0.015) {
  const vec = axis === 'vertical' ? vectors.vertical : vectors.horizontal;
  if (!vec) return 0;

  let raw;
  if (axis === 'vertical') {
    // top.y < bottom.y always (image y grows downward). Looking up shrinks the
    // eye opening / raises the whole eye box -> detect via pupil & top vs baseline.
    raw = -vec.dy; // dy>0 means bottom is lower than top by default; we track CHANGE
  } else {
    raw = vec.dx; // dx>0 means outer corner is right of inner (default); track CHANGE
  }

  // Convert raw to a normalized delta with a dead zone
  const scaled = raw / sensitivity;
  const clamped = Math.max(-1, Math.min(1, scaled));
  if (Math.abs(clamped) < hysteresis) return 0;
  return clamped;
}

/**
 * Calibrate a user's personal baseline (first-run "eye searching system"
 * training). Stores the neutral 5-point positions so later motion is
 * measured relative to THIS user, not absolute image coords.
 */
function buildCalibration(frames) {
  if (!frames || !frames.length) return null;
  const n = frames.length;
  const keys = ['inner', 'outer', 'top', 'bottom', 'pupil'];
  const avg = {};
  for (const k of keys) {
    const sum = { x: 0, y: 0, z: 0 };
    let count = 0;
    for (const f of frames) {
      if (f.points && f.points[k]) {
        sum.x += f.points[k].x; sum.y += f.points[k].y; sum.z += (f.points[k].z || 0);
        count++;
      }
    }
    avg[k] = count ? normalize({ x: sum.x / count, y: sum.y / count, z: sum.z / count }) : null;
  }
  return {
    version: 1,
    timestamp: Date.now(),
    frames: n,
    points: avg
  };
}

/**
 * Persist calibration + training frames to local config (never uploaded).
 */
function persistEyeData(calibration, frames, outDir) {
  const dir = outDir || path.join(process.env.HOME || '.', '.just-slip-eye');
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const payload = {
      savedAt: new Date().toISOString(),
      note: 'Personal eye-tracking calibration. LOCAL ONLY. Not uploaded.',
      calibration,
      frames
    };
    fs.writeFileSync(path.join(dir, 'eye-calibration.json'), JSON.stringify(payload, null, 2), 'utf8');
    return path.join(dir, 'eye-calibration.json');
  } catch (e) {
    console.error('Failed to persist eye data:', e.message);
    return null;
  }
}

// ---- Pure helpers exposed for unit testing ----
module.exports = {
  LANDMARKS,
  FIVE_POINTS,
  extractFivePoints,
  deriveVectors,
  mapToDelta,
  buildCalibration,
  persistEyeData,
  normalize
};
