// ShotSathi Live — pose guide camera.
// Everything runs on-device: MediaPipe Tasks Vision for pose landmarks and subject cut-outs.

import { POSES, poseCanvas } from "./poses.js";

const $ = (id) => document.getElementById(id);
const VISION = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODELS = {
  pose: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
  person: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
  touch: "https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite",
};

/* ---------------- Language ---------------- */
const T = {
  en: {
    lead: "Copy any pose. Line it up on your camera. Get coached until it's perfect.",
    s1: "Pick a photo with a pose you love, or choose one of the built-in poses.",
    s2: "The pose floats over your camera. Drag, pinch and rotate it to fit.",
    s3: "Pose Assist tells your subject how to move. When it turns green, Auto-Capture takes the shot.",
    start: "Open camera",
    fine: "Your photos never leave your phone. The pose AI runs on the device. Tip: add this page to your home screen to use it like an app.",
    loading: "Loading Pose Assist…", pick: "Pick a pose below", noAssist: "Line up with the outline",
    noAssistS: "Pose Assist works with people", enter: "Step into the frame", enterS: "Show head to knees",
    closer: "Step closer", back: "Step back", moveL: "Move ◀", moveR: "Move ▶",
    tiltDown: "Tilt phone down", tiltUp: "Tilt phone up",
    raise: (s) => `Raise the ${s} hand`, lower: (s) => `Lower the ${s} hand`,
    handOut: (s, d) => `Move the ${s} hand ${d}`, foot: (s, d) => `Move the ${s} foot ${d}`,
    head: (d) => `Head ${d}`, chinUp: "Chin up a little", chinDown: "Chin down a little",
    hold: "Hold it…", perfect: "Perfect — hold still", match: "match",
    side: { L: "◀ side", R: "▶ side" },
    dark: "Too dark — face the light", bright: "Too bright", blur: "Hold steady",
    camErr: "Camera blocked. Allow camera access in your browser settings, then reload.",
    camHttps: "Camera needs a secure (https) link.", aiErr: "Pose AI couldn't load. Check your internet; the camera and outlines still work.",
    liftFind: "Finding the person…", liftTap: "Tap the subject you want to copy. Tap again to pick something else.",
    liftNone: "No person found. Tap the subject (pet, object…) to lift it.", liftOk: "Looks good? Use it, or tap to pick a different subject.",
    saved: "Pose saved to your library", savedPhoto: "Photo saved",
    tips: { light: "Too dark: turn the subject towards a window or light.", bright: "Highlights are blown: move out of direct sun or tap the bright area to expose for it.", blur: "A bit blurry: hold with both hands, wipe the lens, tap to focus.", place: "Try putting the subject on a thirds line.", good: "Good light and focus. Nice!" },
  },
  bn: {
    lead: "যেকোনো পোজ কপি করুন। ক্যামেরায় মিলিয়ে নিন। একদম পারফেক্ট না হওয়া পর্যন্ত গাইড পাবেন।",
    s1: "পছন্দের পোজের একটা ছবি বাছুন, অথবা তৈরি পোজ থেকে একটা নিন।",
    s2: "পোজটা ক্যামেরার উপর ভাসবে। টেনে, পিঞ্চ করে, ঘুরিয়ে মিলিয়ে নিন।",
    s3: "পোজ অ্যাসিস্ট বলে দেবে কীভাবে নড়তে হবে। সবুজ হলে অটো-ক্যাপচার নিজেই ছবি তুলবে।",
    start: "ক্যামেরা খুলুন",
    fine: "আপনার ছবি ফোনের বাইরে যায় না। পোজ AI ফোনেই চলে। টিপ: হোম স্ক্রিনে যোগ করলে অ্যাপের মতো চলবে।",
    loading: "পোজ অ্যাসিস্ট লোড হচ্ছে…", pick: "নিচ থেকে একটা পোজ বাছুন", noAssist: "আউটলাইনের সাথে মিলান",
    noAssistS: "পোজ অ্যাসিস্ট মানুষের জন্য", enter: "ফ্রেমে আসুন", enterS: "মাথা থেকে হাঁটু পর্যন্ত দেখান",
    closer: "একটু কাছে আসুন", back: "একটু পিছনে যান", moveL: "◀ দিকে সরুন", moveR: "▶ দিকে সরুন",
    tiltDown: "ফোন একটু নিচে কাত করুন", tiltUp: "ফোন একটু উপরে কাত করুন",
    raise: (s) => `${s}র হাত উপরে তুলুন`, lower: (s) => `${s}র হাত নামান`,
    handOut: (s, d) => `${s}র হাত ${d} সরান`, foot: (s, d) => `${s}র পা ${d} সরান`,
    head: (d) => `মাথা ${d} দিকে`, chinUp: "থুতনি একটু উপরে", chinDown: "থুতনি একটু নিচে",
    hold: "এভাবেই থাকুন…", perfect: "পারফেক্ট — নড়বেন না", match: "মিল",
    side: { L: "◀ পাশে", R: "▶ পাশে" },
    dark: "অন্ধকার — আলোর দিকে মুখ করুন", bright: "আলো বেশি", blur: "ফোন স্থির রাখুন",
    camErr: "ক্যামেরা ব্লক। ব্রাউজার সেটিংসে ক্যামেরা অনুমতি দিন, তারপর রিলোড করুন।",
    camHttps: "ক্যামেরার জন্য https লিংক লাগবে।", aiErr: "পোজ AI লোড হয়নি। ইন্টারনেট চেক করুন; ক্যামেরা আর আউটলাইন চলবে।",
    liftFind: "মানুষ খোঁজা হচ্ছে…", liftTap: "যা কপি করতে চান তার উপর ট্যাপ করুন।",
    liftNone: "কোনো মানুষ পাওয়া যায়নি। বিষয়ের উপর ট্যাপ করুন (পোষা প্রাণী, জিনিস…)।", liftOk: "ঠিক আছে? ব্যবহার করুন, অথবা অন্য কিছুতে ট্যাপ করুন।",
    saved: "পোজ লাইব্রেরিতে সেভ হয়েছে", savedPhoto: "ছবি সেভ হয়েছে",
    tips: { light: "অন্ধকার: জানালা বা আলোর দিকে মুখ করান।", bright: "আলো বেশি: সরাসরি রোদ থেকে সরুন, উজ্জ্বল জায়গায় ট্যাপ করুন।", blur: "একটু ঝাপসা: দুই হাতে ধরুন, লেন্স মুছুন, ফোকাসে ট্যাপ করুন।", place: "বিষয়টাকে গ্রিডের এক-তৃতীয়াংশ লাইনে রাখুন।", good: "আলো আর ফোকাস দারুণ!" },
  },
};
let lang = load("ssl-lang") === "bn" ? "bn" : "en";
const t = (k) => T[lang][k];

/* ---------------- Storage ---------------- */
function load(k) { try { return localStorage.getItem(k); } catch { return null; } }
function save(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } }

/* ---------------- Built-in poses (see poses.js) ---------------- */
const BUILTIN = POSES;
const GHOST_COLORS = { body: "#F2B04C", hair: "#A86A1C", edge: "rgba(70,40,5,.7)", shade: "rgba(90,50,0,.25)" };
const THUMB_COLORS = { body: "#E9D9C4", hair: "#4a3426", edge: "rgba(0,0,0,.45)", shade: "rgba(0,0,0,.2)" };
const CHAIN = ["sh", "el", "wr", "hip", "kn", "an"];
const MP = { nose: 0, sh: [11, 12], el: [13, 14], wr: [15, 16], hip: [23, 24], kn: [25, 26], an: [27, 28] };
const thumbCache = new Map();
function thumbFor(p) {
  if (!thumbCache.has(p.id)) thumbCache.set(p.id, poseCanvas(p, 150, THUMB_COLORS).toDataURL());
  return thumbCache.get(p.id);
}
const mid = (a, b) => (a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a || b || null);

/* ---------------- State ---------------- */
const S = {
  stream: null, track: null, facing: "environment", caps: {},
  ghost: null, ghostImg: null, ghostOutline: null, style: "photo",
  tf: { x: 0, y: 0, s: 1, r: 0, flip: false }, opacity: 0.45,
  grid: load("ssl-grid") !== "0", level: false, timer: 0, auto: load("ssl-auto") !== "0", torch: false, zoom: 1,
  live: null, score: 0, holdStart: 0, cooldown: 0, counting: false, lastLight: null, tilt: 0,
  library: [], lastBlob: null, lastMatch: null,
};
let poseVideo = null, poseImage = null, personSeg = null, touchSeg = null, vision = null, fileset = null, aiFailed = false;

/* ---------------- MediaPipe loading ---------------- */
async function loadVision() {
  if (!vision) {
    vision = await import(`${VISION}/vision_bundle.mjs`);
    fileset = await vision.FilesetResolver.forVisionTasks(`${VISION}/wasm`);
  }
  return vision;
}
async function makeTask(Cls, opts) {
  let err;
  for (const delegate of ["GPU", "CPU"]) {
    try { return await Cls.createFromOptions(fileset, { ...opts, baseOptions: { ...opts.baseOptions, delegate } }); }
    catch (e) { err = e; }
  }
  throw err;
}
async function getPoseVideo() {
  if (!poseVideo) { const v = await loadVision(); poseVideo = await makeTask(v.PoseLandmarker, { baseOptions: { modelAssetPath: MODELS.pose }, runningMode: "VIDEO", numPoses: 1 }); }
  return poseVideo;
}
async function getPoseImage() {
  if (!poseImage) { const v = await loadVision(); poseImage = await makeTask(v.PoseLandmarker, { baseOptions: { modelAssetPath: MODELS.pose }, runningMode: "IMAGE", numPoses: 1 }); }
  return poseImage;
}
async function getPersonSeg() {
  if (!personSeg) { const v = await loadVision(); personSeg = await makeTask(v.ImageSegmenter, { baseOptions: { modelAssetPath: MODELS.person }, runningMode: "IMAGE", outputCategoryMask: true, outputConfidenceMasks: false }); }
  return personSeg;
}
async function getTouchSeg() {
  if (!touchSeg) { const v = await loadVision(); touchSeg = await makeTask(v.InteractiveSegmenter, { baseOptions: { modelAssetPath: MODELS.touch }, outputCategoryMask: true, outputConfidenceMasks: false }); }
  return touchSeg;
}

/* ---------------- Camera ---------------- */
const video = $("video"), ov = $("ov"), ctx = ov.getContext("2d");
let W = 0, H = 0, DPR = 1;

async function startCamera() {
  stopCamera();
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { toast(t("camHttps"), 6000); return false; }
  try {
    S.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: S.facing, width: { ideal: 1920 }, height: { ideal: 1080 } } });
  } catch (e) { toast(t("camErr"), 7000); return false; }
  video.srcObject = S.stream;
  video.classList.toggle("mirror", S.facing === "user");
  await video.play().catch(() => {});
  S.track = S.stream.getVideoTracks()[0];
  S.caps = S.track.getCapabilities ? S.track.getCapabilities() : {};
  $("b-torch").hidden = !S.caps.torch;
  $("b-zoom").hidden = !S.caps.zoom;
  S.zoom = 1; S.torch = false; $("zoom-l").textContent = "1x"; $("b-torch").setAttribute("aria-pressed", "false");
  return true;
}
function stopCamera() { if (S.stream) S.stream.getTracks().forEach((tr) => tr.stop()); S.stream = null; S.track = null; }

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth; H = window.innerHeight;
  ov.width = Math.round(W * DPR); ov.height = Math.round(H * DPR);
  if (!S.tf.x) resetTransform();
}
window.addEventListener("resize", resize);

// Map normalised video coords to stage px (object-fit: cover, mirrored for selfie camera)
function vidToStage(u, v) {
  const vw = video.videoWidth || W, vh = video.videoHeight || H;
  const sc = Math.max(W / vw, H / vh), dx = (W - vw * sc) / 2, dy = (H - vh * sc) / 2;
  let x = u * vw * sc + dx; const y = v * vh * sc + dy;
  if (S.facing === "user") x = W - x;
  return { x, y };
}

/* ---------------- Ghost ---------------- */
function resetTransform() {
  S.tf = { x: W / 2, y: H * 0.43, s: 1, r: 0, flip: S.tf.flip || false };
}
function ghostBase() {
  const a = S.ghost?.aspect || 0.7;
  let bh = H * 0.66, bw = bh * a;
  if (bw > W * 0.92) { bw = W * 0.92; bh = bw / a; }
  return { bw, bh };
}
function ghostPoint(p) {
  const { bw, bh } = ghostBase(), tf = S.tf;
  let x = (p.x - 0.5) * bw, y = (p.y - 0.5) * bh;
  if (tf.flip) x = -x;
  x *= tf.s; y *= tf.s;
  const c = Math.cos(tf.r), s = Math.sin(tf.r);
  return { x: tf.x + x * c - y * s, y: tf.y + x * s + y * c };
}
function mapJoints(j, fn) {
  const o = { nose: j.nose ? fn(j.nose) : null };
  for (const k of CHAIN) o[k] = [j[k][0] ? fn(j[k][0]) : null, j[k][1] ? fn(j[k][1]) : null];
  return o;
}
// Re-order each L/R pair so index 0 is the screen-left one (by shoulders for arms, hips for legs).
function bySide(j) {
  const o = { nose: j.nose };
  const swapArms = j.sh[0] && j.sh[1] && j.sh[0].x > j.sh[1].x;
  const swapLegs = j.hip[0] && j.hip[1] && j.hip[0].x > j.hip[1].x;
  for (const k of ["sh", "el", "wr"]) o[k] = swapArms ? [j[k][1], j[k][0]] : [j[k][0], j[k][1]];
  for (const k of ["hip", "kn", "an"]) o[k] = swapLegs ? [j[k][1], j[k][0]] : [j[k][0], j[k][1]];
  return o;
}
function targetJoints() { return S.ghost?.joints ? bySide(mapJoints(S.ghost.joints, ghostPoint)) : null; }

async function setGhost(g) {
  S.ghost = g; S.ghostImg = null; S.ghostOutline = null;
  if (g?.cut) {
    const img = new Image(); img.src = g.cut;
    await img.decode().catch(() => {});
    S.ghostImg = img; S.ghostOutline = makeOutline(img);
  } else if (g?.builtin) {
    S.ghostImg = poseCanvas(g, 900, GHOST_COLORS); S.ghostOutline = makeOutline(S.ghostImg);
  }
  resetTransform();
  S.score = 0; S.holdStart = 0;
  $("ghostbar").hidden = !g;
  renderTray();
  renderInfo();
  updateAssistIdle();
}
function makeOutline(img) {
  const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, c = document.createElement("canvas");
  c.width = w; c.height = h; const x = c.getContext("2d");
  const r = Math.max(2, Math.round(Math.max(w, h) / 160));
  for (let a = 0; a < 16; a++) x.drawImage(img, Math.cos(a / 16 * 6.283) * r, Math.sin(a / 16 * 6.283) * r);
  x.globalCompositeOperation = "source-in"; x.fillStyle = "#F2B04C"; x.fillRect(0, 0, w, h);
  x.globalCompositeOperation = "destination-out"; x.drawImage(img, 0, 0);
  return c;
}

/* ---------------- Gestures (drag / pinch / rotate ghost) ---------------- */
const pts = new Map(); let gStart = null;
const stage = $("stage");
stage.addEventListener("pointerdown", (e) => { if (!S.ghost) return; stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); gStart = snap(); });
stage.addEventListener("pointermove", (e) => {
  if (!pts.has(e.pointerId) || !gStart) return;
  pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const g = geom();
  if (!g) return;
  S.tf.x = gStart.tf.x + (g.cx - gStart.g.cx); S.tf.y = gStart.tf.y + (g.cy - gStart.g.cy);
  if (g.n === 2 && gStart.g.n === 2) {
    S.tf.s = Math.max(0.25, Math.min(4, gStart.tf.s * g.d / gStart.g.d));
    S.tf.r = gStart.tf.r + (g.a - gStart.g.a);
  }
});
const endPt = (e) => { pts.delete(e.pointerId); gStart = pts.size ? snap() : null; };
stage.addEventListener("pointerup", endPt); stage.addEventListener("pointercancel", endPt);
stage.addEventListener("wheel", (e) => { if (!S.ghost) return; e.preventDefault(); S.tf.s = Math.max(0.25, Math.min(4, S.tf.s * (e.deltaY < 0 ? 1.06 : 0.94))); }, { passive: false });
function geom() {
  const p = [...pts.values()]; if (!p.length) return null;
  if (p.length === 1) return { n: 1, cx: p[0].x, cy: p[0].y };
  const [a, b] = p;
  return { n: 2, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, d: Math.hypot(b.x - a.x, b.y - a.y) || 1, a: Math.atan2(b.y - a.y, b.x - a.x) };
}
function snap() { return { tf: { ...S.tf }, g: geom() }; }

/* ---------------- Pose comparison ---------------- */
const SEGS = [["sh", "el", 1], ["el", "wr", 1], ["hip", "kn", 0.8], ["kn", "an", 0.8]];
function angDiff(a, b) { let d = Math.abs(a - b) % (2 * Math.PI); return d > Math.PI ? 2 * Math.PI - d : d; }
const ang = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);

function compare(L, Tg) {
  const lS = mid(L.sh[0], L.sh[1]), lH = mid(L.hip[0], L.hip[1]);
  const tS = mid(Tg.sh[0], Tg.sh[1]), tH = mid(Tg.hip[0], Tg.hip[1]);
  // Full-body targets are measured by the torso; head-and-shoulders targets by shoulder width.
  const useTorso = !!tH;
  if (!L.sh[0] || !L.sh[1] || (useTorso && !lH)) return { score: 0, hint: t("enter"), sub: useTorso ? t("enterS") : "" };
  const lC = useTorso ? mid(lS, lH) : lS, tC = useTorso ? mid(tS, tH) : tS;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const lLen = useTorso ? dist(lS, lH) : dist(L.sh[0], L.sh[1]);
  const tLen = useTorso ? dist(tS, tH) : dist(Tg.sh[0], Tg.sh[1]);
  const ratio = lLen / (tLen || 1);
  const dx = (lC.x - tC.x) / W, dy = (lC.y - tC.y) / H;

  // limb angles
  let sum = 0, wsum = 0, worst = null;
  for (const i of [0, 1]) for (const [a, b, w] of SEGS) {
    const la = L[a][i], lb = L[b][i], ta = Tg[a][i], tb = Tg[b][i];
    if (!la || !lb || !ta || !tb) continue;
    const d = angDiff(ang(la, lb), ang(ta, tb)) * 180 / Math.PI;
    sum += Math.max(0, 1 - d / 55) * w; wsum += w;
    if (!worst || d * w > worst.d * worst.w) worst = { d, w, i, end: b, live: lb, target: tb, base: L[a][i] };
  }
  // head offset relative to shoulders
  let headD = 0;
  if (L.nose && Tg.nose && lS && tS) {
    const lw = Math.hypot(L.sh[0].x - L.sh[1].x, L.sh[0].y - L.sh[1].y) || 1, tw = Math.hypot(Tg.sh[0].x - Tg.sh[1].x, Tg.sh[0].y - Tg.sh[1].y) || 1;
    const lx = (L.nose.x - lS.x) / lw, tx = (Tg.nose.x - tS.x) / tw, ly = (L.nose.y - lS.y) / lw, ty = (Tg.nose.y - tS.y) / tw;
    headD = Math.hypot(lx - tx, ly - ty);
    sum += Math.max(0, 1 - headD / 0.6) * 0.6; wsum += 0.6;
    if (headD > 0.35 && (!worst || worst.d < 25)) worst = { head: true, hx: tx - lx, hy: ty - ly };
  }
  const limbs = wsum ? sum / wsum : 0.5;
  const posS = Math.max(0, 1 - Math.hypot(dx, dy) / 0.15);
  const scaleS = Math.max(0, 1 - Math.abs(Math.log(ratio)) / 0.45);
  const score = Math.round(100 * (0.62 * limbs + 0.2 * posS + 0.18 * scaleS));

  let hint = null, arrow = null;
  if (ratio < 0.82) hint = t("closer");
  else if (ratio > 1.2) hint = t("back");
  else if (Math.abs(dx) > 0.07) hint = dx > 0 ? t("moveL") : t("moveR");
  else if (Math.abs(dy) > 0.08) hint = dy > 0 ? t("tiltDown") : t("tiltUp");
  else if (worst?.head) {
    hint = Math.abs(worst.hx) > Math.abs(worst.hy) ? t("head")(worst.hx < 0 ? "◀" : "▶") : (worst.hy < 0 ? t("chinUp") : t("chinDown"));
  } else if (worst && worst.d > 22) {
    const side = t("side")[worst.i === 0 ? "L" : "R"];
    const vx = worst.target.x - worst.live.x, vy = worst.target.y - worst.live.y;
    const arm = worst.end === "el" || worst.end === "wr";
    if (arm) hint = Math.abs(vy) >= Math.abs(vx) ? (vy < 0 ? t("raise")(side) : t("lower")(side)) : t("handOut")(side, vx < 0 ? "◀" : "▶");
    else hint = t("foot")(side, vx < 0 ? "◀" : "▶");
    // arrow from where the limb end is to where it should be (same limb length)
    if (worst.base) {
      const len = Math.hypot(worst.live.x - worst.base.x, worst.live.y - worst.base.y);
      const ta = ang(Tg[SEGS.find((s) => s[1] === worst.end)[0]][worst.i], worst.target);
      arrow = { from: worst.live, to: { x: worst.base.x + Math.cos(ta) * len, y: worst.base.y + Math.sin(ta) * len } };
    }
  }
  return { score, hint, arrow };
}

/* ---------------- Light check ---------------- */
const mini = document.createElement("canvas"); mini.width = 64; mini.height = 48;
const mctx = mini.getContext("2d", { willReadFrequently: true });
function quickLight() {
  if (!video.videoWidth) return null;
  mctx.drawImage(video, 0, 0, 64, 48);
  const d = mctx.getImageData(0, 0, 64, 48).data; let s = 0, hi = 0;
  for (let i = 0; i < d.length; i += 4) { const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; s += y; if (y > 248) hi++; }
  return { mean: s / (d.length / 4), hi: hi / (d.length / 4) };
}

/* ---------------- Main loop ---------------- */
let lastDetect = 0, frame = 0;
function loop(now) {
  requestAnimationFrame(loop);
  frame++;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);

  if (S.grid) drawGrid();

  const Tg = targetJoints();
  // detect live pose ~20fps
  if (S.stream && poseVideo && Tg && video.readyState >= 2 && now - lastDetect > 50) {
    lastDetect = now;
    try {
      const r = poseVideo.detectForVideo(video, now);
      const lm = r.landmarks?.[0];
      if (lm) {
        const P = (i) => (lm[i] && (lm[i].visibility ?? 1) > 0.5 ? vidToStage(lm[i].x, lm[i].y) : null);
        const j = { nose: P(MP.nose) };
        for (const k of CHAIN) j[k] = [P(MP[k][0]), P(MP[k][1])];
        S.live = bySide(j);
      } else S.live = null;
    } catch { S.live = null; }
  }

  // ghost
  if (S.ghost) drawGhost(Tg);

  // assist
  if (S.ghost && Tg && poseVideo && S.stream) {
    const res = S.live ? compare(S.live, Tg) : { score: 0, hint: t("enter"), sub: t("enterS") };
    S.score = S.score * 0.75 + res.score * 0.25;
    const ok = S.score >= 84 && !res.hint;
    if (S.live) drawSkeleton(S.live, ok ? "#3DDC84" : "rgba(255,255,255,.85)", 3);
    if (res.arrow && !ok) drawArrow(res.arrow.from, res.arrow.to);
    let title = res.hint, sub = `${Math.round(S.score)}% ${t("match")}`;
    if (ok) {
      if (!S.holdStart) S.holdStart = now;
      const held = now - S.holdStart;
      title = S.auto ? t("hold") : t("perfect");
      setHold(S.auto ? Math.min(1, held / 1100) : 0);
      if (S.auto && held > 1100 && now > S.cooldown && !S.counting) { S.cooldown = now + 3500; capture(); }
    } else { S.holdStart = 0; setHold(0); if (!title) title = lang === "bn" ? "প্রায় হয়ে গেছে" : "Almost there"; }
    if (res.sub) sub = res.sub;
    setAssist(title, sub, S.score, ok);
  }

  // light chip every ~1s
  if (S.stream && frame % 45 === 0) {
    const l = quickLight();
    const chips = [];
    if (l) { if (l.mean < 55) chips.push(t("dark")); else if (l.hi > 0.12) chips.push(t("bright")); }
    $("chips").innerHTML = chips.map((c) => `<span class="chip warn">${c}</span>`).join("");
  }

  if (S.level) drawLevel();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 1;
  ctx.beginPath();
  for (const f of [1 / 3, 2 / 3]) { ctx.moveTo(W * f, 0); ctx.lineTo(W * f, H); ctx.moveTo(0, H * f); ctx.lineTo(W, H * f); }
  ctx.stroke();
}
function drawGhost(Tg) {
  const { bw, bh } = ghostBase(), tf = S.tf;
  const src = S.style === "outline" ? S.ghostOutline : S.ghostImg;
  if (src) {
    ctx.save();
    ctx.translate(tf.x, tf.y); ctx.rotate(tf.r); ctx.scale(tf.s * (tf.flip ? -1 : 1), tf.s);
    ctx.globalAlpha = S.style === "outline" ? Math.min(1, S.opacity + 0.4) : S.opacity;
    ctx.drawImage(src, -bw / 2, -bh / 2, bw, bh);
    ctx.restore();
  }
  if (Tg && !src) drawSkeleton(Tg, `rgba(242,176,76,${Math.min(1, S.opacity + 0.35)})`, 7, true);
}
function drawSkeleton(j, color, width, isTarget) {
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width * (isTarget ? S.tf.s : 1); ctx.lineCap = "round";
  const seg = (a, b) => { if (a && b) { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); } };
  ctx.beginPath();
  for (const i of [0, 1]) { seg(j.sh[i], j.el[i]); seg(j.el[i], j.wr[i]); seg(j.hip[i], j.kn[i]); seg(j.kn[i], j.an[i]); }
  seg(j.sh[0], j.sh[1]); seg(j.hip[0], j.hip[1]); seg(mid(j.sh[0], j.sh[1]), mid(j.hip[0], j.hip[1]));
  ctx.stroke();
  if (j.nose && j.sh[0] && j.sh[1]) {
    const r = Math.hypot(j.sh[0].x - j.sh[1].x, j.sh[0].y - j.sh[1].y) * 0.32;
    ctx.beginPath(); ctx.arc(j.nose.x, j.nose.y, Math.max(6, r), 0, 6.283); ctx.stroke();
  }
  ctx.restore();
}
function drawArrow(a, b) {
  const d = Math.hypot(b.x - a.x, b.y - a.y); if (d < 18) return;
  const an = Math.atan2(b.y - a.y, b.x - a.x);
  ctx.save(); ctx.strokeStyle = "#FFB347"; ctx.fillStyle = "#FFB347"; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - 16 * Math.cos(an - 0.45), b.y - 16 * Math.sin(an - 0.45)); ctx.lineTo(b.x - 16 * Math.cos(an + 0.45), b.y - 16 * Math.sin(an + 0.45)); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(a.x, a.y, 7, 0, 6.283); ctx.fill();
  ctx.restore();
}
function drawLevel() {
  const ok = Math.abs(S.tilt) < 1.5, w = Math.min(W, H) * 0.42;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-S.tilt * Math.PI / 180);
  ctx.strokeStyle = ok ? "#3DDC84" : "rgba(255,255,255,.9)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-18, 0); ctx.moveTo(18, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.moveTo(W / 2 - 12, H / 2); ctx.lineTo(W / 2 + 12, H / 2); ctx.stroke();
}
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma == null) return;
  const ang0 = (screen.orientation?.angle ?? window.orientation ?? 0) % 180;
  let tl = ang0 === 0 ? e.gamma : e.beta;
  if (Math.abs(tl) > 45) tl = 0;
  S.tilt = tl;
});

/* ---------------- Assist UI ---------------- */
function setAssist(title, sub, score, ok) {
  const a = $("assist"); a.hidden = false; a.classList.toggle("ok", !!ok);
  $("assist-t").textContent = title; $("assist-s").textContent = sub || "";
  const s = Math.max(0, Math.min(100, Math.round(score || 0)));
  $("ring-arc").setAttribute("stroke-dasharray", `${(s / 100) * 100.5} 101`);
  $("ring-arc").setAttribute("stroke", ok ? "var(--match)" : "var(--ghost)");
  $("ring-t").textContent = s;
  $("shutter").classList.toggle("ok", !!ok);
}
function setHold(f) { const a = $("hold-arc"); a.setAttribute("stroke-dasharray", `${f * 258} 258`); a.style.opacity = f > 0 ? 1 : 0; }
function updateAssistIdle() {
  if (!S.ghost) { setAssist(t("pick"), "", 0, false); return; }
  if (!S.ghost.joints) { setAssist(t("noAssist"), t("noAssistS"), 0, false); $("ring-t").textContent = "—"; return; }
  if (!poseVideo) setAssist(aiFailed ? t("noAssist") : t("loading"), aiFailed ? t("aiErr") : "", 0, false);
}

/* ---------------- Tray / library ---------------- */
function loadLibrary() { try { S.library = JSON.parse(load("ssl-lib") || "[]"); } catch { S.library = []; } }
function saveLibrary() {
  while (S.library.length && !save("ssl-lib", JSON.stringify(S.library))) S.library.pop(); // drop oldest if storage is full
}
let filter = load("ssl-filter") || "all";
const PIN_Q = { all: "aesthetic photo poses", w: "aesthetic poses for women", m: "aesthetic poses for men", mine: "aesthetic photo poses" };
function renderTray() {
  const cur = S.ghost?.id, bn = lang === "bn";
  const lbl = { all: bn ? "সব" : "All", w: bn ? "মেয়ে" : "Women", m: bn ? "ছেলে" : "Men", mine: bn ? "আমার" : "Mine" };
  $("filters").innerHTML = Object.keys(lbl).map((k) => `<button class="pill" data-f="${k}" aria-pressed="${filter === k}">${lbl[k]}</button>`).join("")
    + `<a class="pill pin" href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(PIN_Q[filter])}" target="_blank" rel="noopener">Pinterest ↗</a>`;
  const add = `<button class="pose add" id="tray-add"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 17-5-5-8 7"/></svg><span>${bn ? "ছবি থেকে" : "From photo"}</span></button>`;
  const mine = filter === "all" || filter === "mine" ? S.library.map((g) => `<button class="pose" data-id="${g.id}" aria-pressed="${g.id === cur}"><img src="${g.cut}" alt=""><span>${esc(g.name)}</span><span class="del" data-del="${g.id}" role="button" aria-label="Delete">×</span></button>`).join("") : "";
  const list = filter === "mine" ? [] : BUILTIN.filter((g) => filter === "all" || g.gender === filter);
  const built = list.map((g) => `<button class="pose" data-id="${g.id}" aria-pressed="${g.id === cur}"><img src="${thumbFor(g)}" alt=""><span>${g.name}</span></button>`).join("");
  const empty = filter === "mine" && !S.library.length ? `<p class="trayhint">${bn ? "Pinterest থেকে পছন্দের পোজের স্ক্রিনশট নিন, তারপর \"ছবি থেকে\" চাপুন।" : "Screenshot a pose you like on Pinterest, then tap From photo."}</p>` : "";
  $("tray").innerHTML = add + mine + built + empty;
}
$("filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  filter = b.dataset.f; save("ssl-filter", filter); renderTray(); $("tray").scrollLeft = 0;
});
function renderInfo() {
  const g = S.ghost, el = $("pinfo");
  if (!g?.builtin) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `<b>${esc(g.name)}</b><span>${esc(g.how)}</span><small>📷 ${esc(g.cam)}</small>`;
}
$("pinfo").addEventListener("click", () => $("pinfo").classList.toggle("open"));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
$("tray").addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  if (del) {
    e.stopPropagation();
    S.library = S.library.filter((g) => g.id !== del.dataset.del); saveLibrary();
    if (S.ghost?.id === del.dataset.del) setGhost(null); else renderTray();
    return;
  }
  if (e.target.closest("#tray-add")) { $("file").click(); return; }
  const b = e.target.closest(".pose"); if (!b) return;
  const id = b.dataset.id;
  if (S.ghost?.id === id) { setGhost(null); return; }
  setGhost(BUILTIN.find((g) => g.id === id) || S.library.find((g) => g.id === id));
});

/* ---------------- Lift a subject from a photo ---------------- */
const liftC = $("lift-c"), lctx = liftC.getContext("2d");
let liftSrc = null, liftMask = null, liftJoints = null;

$("file").addEventListener("change", async (e) => {
  const f = e.target.files[0]; e.target.value = "";
  if (f) openLift(f);
});
async function openLift(blob) {
  $("lift").hidden = false; $("lift-use").disabled = true; $("lift-spin").hidden = false;
  $("lift-note").textContent = t("liftFind");
  liftMask = null; liftJoints = null;
  const img = await blobToImage(blob);
  // work at most 1024px
  const sc = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight));
  liftSrc = document.createElement("canvas");
  liftSrc.width = Math.round(img.naturalWidth * sc); liftSrc.height = Math.round(img.naturalHeight * sc);
  liftSrc.getContext("2d").drawImage(img, 0, 0, liftSrc.width, liftSrc.height);
  liftC.width = liftSrc.width; liftC.height = liftSrc.height;
  drawLift();
  try {
    const pl = await getPoseImage();
    const r = pl.detect(liftSrc);
    const lm = r.landmarks?.[0];
    if (lm) {
      const P = (i) => (lm[i] && (lm[i].visibility ?? 1) > 0.5 ? { x: lm[i].x, y: lm[i].y } : null);
      liftJoints = { nose: P(0) };
      for (const k of CHAIN) liftJoints[k] = [P(MP[k][0]), P(MP[k][1])];
      if (!liftJoints.sh[0] || !liftJoints.sh[1]) liftJoints = null;
    }
    if (liftJoints) await liftPerson();
    else { $("lift-note").textContent = t("liftNone"); }
  } catch (err) {
    console.warn(err); $("lift-note").textContent = t("aiErr");
  }
  $("lift-spin").hidden = true;
}
async function liftPerson() {
  $("lift-spin").hidden = false;
  const seg = await getPersonSeg();
  await new Promise((res) => seg.segment(liftSrc, (r) => {
    const m = r.categoryMask; const a = m.getAsUint8Array();
    liftMask = { w: m.width, h: m.height, fg: (i) => a[i] > 0, data: Uint8Array.from(a, (v) => (v > 0 ? 1 : 0)) };
    res();
  }));
  $("lift-spin").hidden = true;
  afterMask();
}
liftC.addEventListener("pointerup", async (e) => {
  const rc = liftC.getBoundingClientRect();
  const x = (e.clientX - rc.left) / rc.width, y = (e.clientY - rc.top) / rc.height;
  $("lift-spin").hidden = false;
  try {
    const seg = await getTouchSeg();
    await new Promise((res) => seg.segment(liftSrc, { keypoint: { x, y } }, (r) => {
      const m = r.categoryMask; const a = m.getAsUint8Array();
      const tap = a[Math.min(m.height - 1, Math.floor(y * m.height)) * m.width + Math.min(m.width - 1, Math.floor(x * m.width))];
      liftMask = { w: m.width, h: m.height, data: Uint8Array.from(a, (v) => (v === tap ? 1 : 0)) };
      res();
    }));
    // only keep pose joints if the tap landed on the detected person
    afterMask(true);
  } catch (err) { console.warn(err); $("lift-note").textContent = t("aiErr"); }
  $("lift-spin").hidden = true;
});
$("lift-person").addEventListener("click", () => { if (liftJoints) liftPerson(); else $("lift-note").textContent = t("liftNone"); });
function afterMask() { drawLift(); $("lift-use").disabled = !liftMask; $("lift-note").textContent = t("liftOk"); }
function maskCanvas() {
  const { w, h, data } = liftMask, c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d"), id = x.createImageData(w, h);
  for (let i = 0; i < data.length; i++) { id.data[i * 4 + 3] = data[i] ? 255 : 0; }
  x.putImageData(id, 0, 0); return c;
}
function cutout() {
  const w = liftSrc.width, h = liftSrc.height, c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d"); x.drawImage(liftSrc, 0, 0);
  x.globalCompositeOperation = "destination-in"; x.filter = "blur(1.2px)"; x.drawImage(maskCanvas(), 0, 0, w, h); x.filter = "none";
  return c;
}
function drawLift() {
  lctx.globalCompositeOperation = "source-over"; lctx.clearRect(0, 0, liftC.width, liftC.height);
  if (!liftMask) { lctx.drawImage(liftSrc, 0, 0); return; }
  lctx.drawImage(liftSrc, 0, 0);
  lctx.fillStyle = "rgba(11,15,20,.72)"; lctx.fillRect(0, 0, liftC.width, liftC.height);
  lctx.drawImage(cutout(), 0, 0);
}
function maskInfo() {
  // bounding box + whether pose joints fall inside the mask
  const { w, h, data } = liftMask; let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[y * w + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < x0) return null;
  let inside = 0;
  if (liftJoints) for (const p of [liftJoints.sh[0], liftJoints.sh[1], liftJoints.hip[0], liftJoints.hip[1]]) if (p && data[Math.floor(p.y * h) * w + Math.floor(p.x * w)]) inside++;
  return { x0: x0 / w, y0: y0 / h, x1: (x1 + 1) / w, y1: (y1 + 1) / h, person: inside >= 2 };
}
$("lift-use").addEventListener("click", () => {
  const info = maskInfo(); if (!info) return;
  const pad = 0.02, bx0 = Math.max(0, info.x0 - pad), by0 = Math.max(0, info.y0 - pad), bx1 = Math.min(1, info.x1 + pad), by1 = Math.min(1, info.y1 + pad);
  const full = cutout(), sw = (bx1 - bx0) * full.width, sh = (by1 - by0) * full.height;
  const sc = Math.min(1, 720 / Math.max(sw, sh)), c = document.createElement("canvas");
  c.width = Math.round(sw * sc); c.height = Math.round(sh * sc);
  c.getContext("2d").drawImage(full, bx0 * full.width, by0 * full.height, sw, sh, 0, 0, c.width, c.height);
  let joints = null;
  if (liftJoints && info.person) {
    const n = (p) => (p ? { x: (p.x - bx0) / (bx1 - bx0), y: (p.y - by0) / (by1 - by0) } : null);
    joints = { nose: n(liftJoints.nose) }; for (const k of CHAIN) joints[k] = [n(liftJoints[k][0]), n(liftJoints[k][1])];
  }
  let cut = c.toDataURL("image/webp", 0.82);
  if (!cut.startsWith("data:image/webp")) cut = c.toDataURL("image/png");
  const g = { id: "u-" + Date.now(), name: (lang === "bn" ? "আমার পোজ " : "My pose ") + (S.library.length + 1), aspect: c.width / c.height, cut, joints };
  S.library.unshift(g); saveLibrary();
  $("lift").hidden = true;
  setGhost(g);
  toast(t("saved"));
});
$("lift-close").addEventListener("click", () => { $("lift").hidden = true; });
function blobToImage(blob) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(blob); }); }

/* ---------------- Capture ---------------- */
$("shutter").addEventListener("click", () => {
  if (S.counting) return;
  if (S.timer) countdown(S.timer); else capture();
});
function countdown(n) {
  S.counting = true; const el = $("count"); el.hidden = false; el.textContent = n;
  const iv = setInterval(() => { n--; if (n <= 0) { clearInterval(iv); el.hidden = true; S.counting = false; capture(); } else el.textContent = n; }, 1000);
}
function capture() {
  if (!video.videoWidth) return;
  const vw = video.videoWidth, vh = video.videoHeight, sc = Math.max(W / vw, H / vh);
  // crop to what's visible on screen
  const cw = W / sc, ch = H / sc, cx = (vw - cw) / 2, cy = (vh - ch) / 2;
  const c = document.createElement("canvas"); c.width = Math.round(cw); c.height = Math.round(ch);
  const x = c.getContext("2d");
  if (S.facing === "user") { x.translate(c.width, 0); x.scale(-1, 1); }
  x.drawImage(video, cx, cy, cw, ch, 0, 0, c.width, c.height);
  const f = $("flash"); f.classList.add("on"); requestAnimationFrame(() => requestAnimationFrame(() => f.classList.remove("on")));
  navigator.vibrate?.(30);
  S.lastMatch = S.ghost?.joints ? Math.round(S.score) : null;
  c.toBlob((b) => { if (!b) return; S.lastBlob = b; const u = URL.createObjectURL(b); $("b-last").innerHTML = `<img src="${u}" alt="">`; openReview(b, c); }, "image/jpeg", 0.92);
}

/* ---------------- Review ---------------- */
function analyze(src) {
  const w = 200, h = Math.max(1, Math.round(w * src.height / src.width)), c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(src, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data, g = new Float32Array(w * h); let s = 0, hi = 0;
  for (let i = 0, p = 0; i < g.length; i++, p += 4) { const y = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2]; g[i] = y; s += y; if (y > 245) hi++; }
  let l1 = 0, l2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++) for (let xx = 1; xx < w - 1; xx++) { const i = y * w + xx, L = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w]; l1 += L; l2 += L * L; n++; }
  return { mean: s / g.length, hi: hi / g.length, sharp: l2 / n - (l1 / n) ** 2 };
}
function openReview(blob, canvas) {
  $("review").hidden = false;
  $("rev-img").src = URL.createObjectURL(blob);
  const m = analyze(canvas), tips = [];
  const cell = (label, val, col) => `<div class="meter"><b>${label}</b><span style="color:var(--${col})">${val}</span></div>`;
  const light = m.mean < 60 ? ["Dark", "bad"] : m.mean > 200 ? ["Bright", "warn"] : ["Good", "match"];
  const sharp = m.sharp < 60 ? ["Blurry", "bad"] : m.sharp < 150 ? ["OK", "warn"] : ["Sharp", "match"];
  const hl = m.hi > 0.08 ? ["Blown", "warn"] : ["Fine", "match"];
  const match = S.lastMatch == null ? ["—", "muted"] : [S.lastMatch + "%", S.lastMatch >= 84 ? "match" : "warn"];
  $("rev-meters").innerHTML = cell("Light", ...light) + cell("Focus", ...sharp) + cell("Highlights", ...hl) + cell("Pose", ...match);
  const tp = T[lang].tips;
  if (light[1] === "bad") tips.push(tp.light);
  if (hl[0] === "Blown") tips.push(tp.bright);
  if (sharp[1] === "bad") tips.push(tp.blur);
  if (!tips.length) tips.push(tp.good);
  $("rev-tips").innerHTML = tips.map((x) => `<li>${x}</li>`).join("");
}
$("rev-close").addEventListener("click", () => { $("review").hidden = true; });
$("rev-retake").addEventListener("click", () => { $("review").hidden = true; });
$("rev-pose").addEventListener("click", () => { $("review").hidden = true; if (S.lastBlob) openLift(S.lastBlob); });
$("rev-save").addEventListener("click", async () => {
  if (!S.lastBlob) return;
  const name = `shotsathi-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.jpg`;
  const file = new File([S.lastBlob], name, { type: "image/jpeg" });
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file] }); toast(t("savedPhoto")); return; }
  } catch (e) { if (e?.name === "AbortError") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  toast(t("savedPhoto"));
});
$("b-last").addEventListener("click", () => { if (S.lastBlob) { $("review").hidden = false; } });

/* ---------------- Top & ghost controls ---------------- */
function bindToggle(id, key, store) {
  const b = $(id); b.setAttribute("aria-pressed", S[key]);
  b.addEventListener("click", () => { S[key] = !S[key]; b.setAttribute("aria-pressed", S[key]); if (store) save(store, S[key] ? "1" : "0"); });
}
bindToggle("b-grid", "grid", "ssl-grid");
bindToggle("b-level", "level");
bindToggle("b-auto", "auto", "ssl-auto");
$("b-timer").addEventListener("click", () => { S.timer = S.timer === 0 ? 3 : S.timer === 3 ? 10 : 0; $("timer-l").textContent = S.timer ? S.timer + "s" : ""; $("b-timer").setAttribute("aria-pressed", !!S.timer); });
$("b-flip").addEventListener("click", async () => { S.facing = S.facing === "user" ? "environment" : "user"; await startCamera(); });
$("b-torch").addEventListener("click", async () => {
  S.torch = !S.torch;
  try { await S.track.applyConstraints({ advanced: [{ torch: S.torch }] }); } catch { S.torch = false; }
  $("b-torch").setAttribute("aria-pressed", S.torch);
});
$("b-zoom").addEventListener("click", async () => {
  const z = S.caps.zoom; if (!z) return;
  const steps = [1, 2, 3].filter((v) => v >= z.min && v <= z.max); if (!steps.length) return;
  S.zoom = steps[(steps.indexOf(S.zoom) + 1) % steps.length] || steps[0];
  try { await S.track.applyConstraints({ advanced: [{ zoom: S.zoom }] }); $("zoom-l").textContent = S.zoom + "x"; } catch {}
});
$("b-mirror").addEventListener("click", () => { S.tf.flip = !S.tf.flip; $("b-mirror").setAttribute("aria-pressed", S.tf.flip); });
$("opacity").addEventListener("input", (e) => { S.opacity = +e.target.value; });
$("b-style").addEventListener("click", () => { S.style = S.style === "photo" ? "outline" : "photo"; $("b-style").setAttribute("aria-pressed", S.style === "outline"); });
$("b-reset").addEventListener("click", () => { S.tf.flip = false; $("b-mirror").setAttribute("aria-pressed", "false"); resetTransform(); });
$("b-clear").addEventListener("click", () => setGhost(null));

/* ---------------- Toast ---------------- */
let toastT = 0;
function toast(msg, ms = 2200) { const el = $("toast"); el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (el.hidden = true), ms); }

/* ---------------- Language + start ---------------- */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $("l-en").setAttribute("aria-pressed", lang === "en"); $("l-bn").setAttribute("aria-pressed", lang === "bn");
  renderTray(); updateAssistIdle();
}
$("l-en").addEventListener("click", () => { lang = "en"; save("ssl-lang", lang); applyLang(); });
$("l-bn").addEventListener("click", () => { lang = "bn"; save("ssl-lang", lang); applyLang(); });

$("b-start").addEventListener("click", async () => {
  if (window.DeviceOrientationEvent?.requestPermission) { try { await DeviceOrientationEvent.requestPermission(); } catch {} }
  const ok = await startCamera();
  $("start").hidden = true;
  if (!ok) return;
  updateAssistIdle();
  getPoseVideo().then(() => updateAssistIdle()).catch((e) => { console.warn(e); aiFailed = true; updateAssistIdle(); });
});

loadLibrary();
resize();
applyLang();
setGhost(BUILTIN.find((g) => filter === "all" || filter === "mine" || g.gender === filter) || BUILTIN[0]);
requestAnimationFrame(loop);

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});

// testing hook
window.__ss = { S, setGhost, BUILTIN, compare, targetJoints, getPoseImage, openLift };
