/**
 * Just Slip — Eye Tracking runtime (renderer)
 *
 * Loads MediaPipe FaceMesh (offline WASM), drives the webcam, tracks the 5
 * eye-space points, and emits motion deltas to the main process via
 * electronAPI.eyeAdjust({ axis, delta }).
 *
 * Mapping (parallel to trackpad gestures):
 *   vertical   eye motion -> screen brightness (up = brighter, down = darker)
 *   horizontal eye motion -> system volume     (left = louder, right = quieter)
 *
 * All frames + calibration stay LOCAL. Nothing leaves the device.
 */

// 5 user-facing points from the 478-landmark FaceMesh output
const IDX: { [k: string]: number[] } = {
  inner: [133, 362],
  outer: [33, 263],
  top: [159, 386],
  bottom: [145, 374],
  pupil: [474, 462]
};

const MP_VERSION = '0.4.1650410162';
const MP_LANDMARKER_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${MP_VERSION}/face_mesh.js`;

type Pt = { x: number; y: number; z: number };
type Five = { inner: Pt; outer: Pt; top: Pt; bottom: Pt; pupil: Pt };
type Delta = { axis: 'vertical' | 'horizontal'; delta: number };

function merge(landmarks: any[], idxs: number[]): Pt | null {
  const pts = idxs.map(i => landmarks[i]).filter(Boolean);
  if (!pts.length) return null;
  const s = { x: 0, y: 0, z: 0 };
  for (const p of pts) { s.x += p.x; s.y += p.y; s.z += (p.z || 0); }
  return { x: s.x / pts.length, y: s.y / pts.length, z: s.z / pts.length };
}

function fivePoints(landmarks: any[] | undefined): Five | null {
  if (!landmarks || landmarks.length < 478) return null;
  const out: any = {};
  for (const k of Object.keys(IDX)) out[k] = merge(landmarks, IDX[k]);
  return Object.values(out).every(Boolean) ? out as Five : null;
}

function loadScript(src: string): Promise<void> {
  if ((document as any).querySelector(`script[data-eye="${src}"]`)) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src;
    s.setAttribute('data-eye', src);
    s.onload = () => res();
    s.onerror = () => rej(new Error('failed to load ' + src));
    document.head.appendChild(s);
  });
}

interface EyeCallbacks {
  onDelta?: (d: Delta) => void;
  onStatus?: (s: string) => void;
  onFrame?: (pts: Five) => void;
}

/**
 * EyeTracker — owns the webcam + FaceMesh loop.
 * Motion is measured against a personal baseline (this user's neutral face),
 * so it works regardless of face size / camera angle.
 */
class EyeTracker {
  video: HTMLVideoElement | null = null;
  mesh: any = null;
  stream: MediaStream | null = null;
  raf: number | null = null;
  running = false;
  prev: Five | null = null;
  baseline: Five | null = null;
  sensitivity = 0.04;   // normalized units of pupil travel == full range
  hysteresis = 0.02;    // dead zone
  axes = { vertical: true, horizontal: true };

  private cb: EyeCallbacks;
  private api: any;

  constructor(api: any, cb: EyeCallbacks = {}) {
    this.api = api;
    this.cb = cb;
  }

  private status(s: string) { if (this.cb.onStatus) this.cb.onStatus(s); }
  private frame(pts: Five) { if (this.cb.onFrame) this.cb.onFrame(pts); }
  private delta(d: Delta) { if (this.cb.onDelta) this.cb.onDelta(d); }

  /** Request camera permission + load MediaPipe + start the loop. */
  async start(): Promise<void> {
    if (this.running) return;
    this.status('requesting-camera');

    this.stream = await (navigator as any).mediaDevices.getUserMedia({
      video: { width: 320, height: 240 },
      audio: false
    });

    if (!this.video) {
      this.video = document.createElement('video');
      this.video.muted = true;
      this.video.setAttribute('playsinline', 'true');
      this.video.srcObject = this.stream;
      await this.video.play().catch(() => {});
    } else {
      this.video.srcObject = this.stream;
    }

    if (!this.mesh) {
      this.status('loading-model');
      await loadScript(MP_LANDMARKER_URL);
      const conf = {
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${MP_VERSION}/${file}`
      };
      this.mesh = new (window as any).FaceMesh(conf);
      this.mesh.setOptions({
        refineLandmarks: true,
        minFaceDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      this.mesh.onResults((res: any) => this.handleResults(res));
      this.status('model-ready');
    }

    this.running = true;
    this.prev = null;
    this.status('running');
    this.pump();
  }

  private pump() {
    if (!this.running) return;
    this.raf = requestAnimationFrame(() => this.pump());
    if (this.video && this.video.readyState >= 2) {
      this.mesh.send({ image: this.video });
    }
  }

  private handleResults(res: any) {
    if (!this.running) return;
    const landmarks = res && res.multiFaceLandmarks && res.multiFaceLandmarks[0];
    const pts = fivePoints(landmarks);
    if (!pts) { this.prev = null; this.status('no-face'); return; }

    this.status('tracking');
    this.frame(pts);

    if (!this.prev) {
      this.prev = pts;
      if (!this.baseline) this.setBaseline(pts);
      return;
    }
    this.emitDeltas(this.prev, pts);
    this.prev = pts;
  }

  private emitDeltas(prev: Five, cur: Five) {
    const base = this.baseline || prev;
    // vertical: pupil Y (up = brighter); horizontal: pupil X (left = louder)
    const dv = (base.pupil.y - cur.pupil.y) / this.sensitivity;
    const dh = (base.pupil.x - cur.pupil.x) / this.sensitivity;

    if (this.axes.vertical) {
      const d = Math.max(-1, Math.min(1, dv));
      if (Math.abs(d) >= this.hysteresis) this.delta({ axis: 'vertical', delta: d });
    }
    if (this.axes.horizontal) {
      const d = Math.max(-1, Math.min(1, dh));
      if (Math.abs(d) >= this.hysteresis) this.delta({ axis: 'horizontal', delta: d });
    }
  }

  setBaseline(points: Five) {
    this.baseline = points;
    if (this.api && this.api.eyeCalibrate) this.api.eyeCalibrate(points);
  }

  /** Average captured frames into a personal baseline; persist locally. */
  collectCalibration(frames: { points: Five }[]): Five | null {
    const keys = ['inner', 'outer', 'top', 'bottom', 'pupil'];
    const avg: any = {};
    let ok = false;
    for (const k of keys) {
      const s = { x: 0, y: 0, z: 0 };
      let c = 0;
      for (const f of frames) {
        if (f.points && f.points[k]) {
          s.x += f.points[k].x; s.y += f.points[k].y; s.z += (f.points[k].z || 0); c++;
        }
      }
      avg[k] = c ? { x: s.x / c, y: s.y / c, z: s.z / c } : null;
      if (c) ok = true;
    }
    if (!ok) return null;
    const baseline = avg as Five;
    this.setBaseline(baseline);
    if (this.api && this.api.eyeSaveCalibration) {
      this.api.eyeSaveCalibration({ version: 1, frames: frames.length, points: baseline });
    }
    return baseline;
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.status('stopped');
  }
}

// Expose to the classic <script> load path used by index.html.
(window as any).EyeTracker = EyeTracker;
