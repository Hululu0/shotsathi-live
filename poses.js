// Built-in pose library + a body silhouette renderer.
// Poses recreate popular "aesthetic pose" ideas (the kind people pin on Pinterest), drawn as our own
// mannequin silhouettes. Joints are in a 100x140 figure box; chain 0 is the screen-left side.
// [name, gender, category, how-to, camera tip, nose, sh0, sh1, el0, el1, wr0, wr1, hip0, hip1, kn0, kn1, an0, an1]

const RAW = [
  // ---------- Women ----------
  ["Look back", "w", "Standing", "Turn your back to the camera, then twist your head and one shoulder back. Soft smile or a neutral look.", "Chest height, a little to one side.",
    [55,13],[44,29],[56,29],[43,48],[58,48],[44,65],[57,64],[45,68],[55,68],[46,97],[53,96],[46,126],[50,125]],
  ["Hair tuck", "w", "Standing", "Tuck your hair behind one ear and look down. Put your weight on the back leg so the hips tilt.", "Eye level. Frame from the knees up.",
    [48,14],[41,29],[59,29],[37,47],[66,27],[38,63],[56,12],[43,67],[57,69],[45,96],[53,97],[46,126],[52,124]],
  ["Walk away, glance back", "w", "Walking", "Walk slowly away from the camera and look back over your shoulder mid-step. Shoot in burst.", "Hip height, a few steps behind.",
    [53,13],[43,29],[57,29],[39,47],[61,48],[37,62],[64,62],[44,68],[55,68],[42,96],[56,95],[38,125],[60,127]],
  ["Wall lean, foot up", "w", "Standing", "Lean your back on a wall, bend one knee and press that foot flat against the wall. Look away from the camera.", "Eye level, step back for full body.",
    [47,13],[40,29],[58,30],[36,47],[63,45],[37,63],[58,60],[44,68],[56,69],[45,97],[61,92],[46,126],[53,112]],
  ["Hat or sunglasses", "w", "Close-up", "Hold the hat brim or your sunglasses with both hands, chin slightly down, ankles crossed.", "Slightly above eye level.",
    [50,14],[41,29],[59,29],[32,32],[68,32],[43,13],[57,13],[44,68],[56,68],[47,97],[53,97],[53,126],[47,126]],
  ["Twirl", "w", "Movement", "Spin with arms out and kick one heel back. Works best in a dress or skirt. Shoot in burst.", "Low, around knee height, for a long-leg look.",
    [50,14],[41,29],[59,29],[28,40],[72,40],[18,48],[82,48],[44,68],[56,68],[46,97],[58,96],[47,127],[66,118]],
  ["Coffee in hand", "w", "Candid", "Hold a cup near your chest, the other hand in a pocket. Pop the front knee and look at the cup or away.", "Eye level, half body.",
    [51,14],[41,29],[59,29],[35,46],[62,48],[41,62],[54,38],[43,68],[57,68],[44,97],[53,98],[45,126],[53,127]],
  ["Mirror selfie", "w", "Selfie", "Hold the phone at chest height, pop one hip and put the other hand on your waist.", "Phone straight, not tilted. Clean the mirror.",
    [50,14],[41,29],[59,29],[31,48],[64,40],[42,65],[55,22],[42,68],[56,67],[44,97],[55,97],[46,126],[52,126]],
  ["Steps, knees up", "w", "Sitting", "Sit on stairs with knees together and hands resting on them. Lean slightly forward and look into the lens.", "Sit-level: crouch to their eye height.",
    [50,40],[42,55],[58,55],[38,71],[62,71],[45,80],[55,80],[44,96],[56,96],[44,82],[56,82],[43,124],[57,124]],
  ["Cross-legged on floor", "w", "Sitting", "Sit cross-legged, hands resting on your knees or holding a book. Tilt your head and look down.", "Shoot from slightly above.",
    [49,58],[41,72],[59,72],[36,88],[64,88],[42,100],[58,100],[44,108],[56,108],[30,118],[70,118],[55,122],[45,122]],
  ["Street squat", "w", "Sitting", "Squat down low, elbows on knees, hands loosely together. Look past the camera.", "Low angle, at their eye level.",
    [50,52],[41,66],[59,66],[34,82],[66,82],[45,93],[55,93],[44,104],[56,104],[36,88],[64,88],[42,128],[58,128]],
  ["Hands in hair", "w", "Close-up", "Lift both hands into your hair, elbows out, eyes closed or looking up. Great at golden hour.", "Slightly below eye level.",
    [50,15],[41,29],[59,29],[29,20],[71,20],[42,7],[58,7],[44,68],[56,68],[45,97],[55,97],[45,126],[55,126]],

  // ---------- Men ----------
  ["Pockets and lean", "m", "Standing", "Both hands in pockets, cross one ankle over the other and lean a shoulder on a wall. Look off camera.", "Chest height, full body.",
    [51,13],[38,29],[62,29],[33,47],[67,47],[41,64],[59,64],[44,68],[56,68],[46,97],[54,97],[52,126],[46,126]],
  ["Fix the watch", "m", "Candid", "Adjust your watch or sleeve at chest height and look down at it. Feet shoulder-width apart.", "Eye level, waist up or full body.",
    [49,15],[38,29],[62,29],[33,46],[66,47],[48,48],[52,46],[44,68],[56,68],[45,97],[56,97],[43,127],[58,127]],
  ["Collar pop", "m", "Close-up", "Grab your jacket collar with both hands, chin slightly up, serious look.", "Slightly below eye level.",
    [50,13],[38,29],[62,29],[32,38],[68,38],[44,26],[56,26],[44,68],[56,68],[45,97],[55,97],[44,127],[56,127]],
  ["Walk toward, look away", "m", "Walking", "Walk toward the camera at a slow pace and look to the side. Let arms swing naturally. Shoot in burst.", "Hip height, slightly low.",
    [52,13],[38,29],[62,29],[35,47],[64,46],[37,63],[61,62],[44,68],[56,68],[44,96],[57,95],[43,127],[58,121]],
  ["Elbows on knees", "m", "Sitting", "Sit on a chair or bench, lean forward with elbows on your knees and hands clasped. Look into the lens.", "At their eye level.",
    [50,40],[37,52],[63,52],[38,80],[62,80],[48,76],[52,76],[43,92],[57,92],[37,84],[63,84],[36,124],[64,124]],
  ["Arms crossed", "m", "Standing", "Cross your arms, turn your head to one side and shift weight onto one leg.", "Eye level, slightly to the side.",
    [53,13],[38,29],[62,29],[36,46],[64,46],[58,44],[42,44],[44,68],[56,68],[45,97],[57,97],[44,127],[60,126]],
  ["Low squat", "m", "Sitting", "Deep squat, forearms resting on knees, hands relaxed. Streetwear classic.", "Low angle from the ground.",
    [50,50],[38,64],[62,64],[33,82],[67,82],[40,94],[60,94],[43,102],[57,102],[34,86],[66,86],[40,128],[60,128]],
  ["Hand through hair", "m", "Close-up", "Run one hand back through your hair, other hand in a pocket. Look down or away.", "Slightly below eye level.",
    [49,14],[38,29],[62,29],[34,48],[70,22],[41,64],[55,6],[44,68],[56,68],[45,97],[56,96],[44,127],[58,126]],
  ["Railing lean", "m", "Standing", "Lean back on a railing with hands on it behind you, ankles crossed. Relaxed face.", "Chest height, straight on.",
    [50,13],[38,29],[62,29],[32,46],[68,46],[28,62],[72,62],[44,68],[56,68],[47,97],[53,97],[54,126],[46,126]],
  ["Phone check", "m", "Candid", "Look down at your phone held with both hands. Looks natural, no smile needed.", "Eye level, from the side.",
    [50,16],[38,29],[62,29],[36,47],[64,47],[47,52],[53,52],[44,68],[56,68],[45,97],[56,97],[44,127],[57,127]],
  ["Jacket over shoulder", "m", "Standing", "Hold your jacket hooked over one shoulder, other hand in a pocket. Weight on one leg.", "Hip height, full body.",
    [51,13],[38,29],[62,29],[33,47],[68,40],[41,64],[64,24],[44,68],[56,68],[45,97],[54,97],[44,127],[55,126]],
  ["Side profile", "m", "Standing", "Stand sideways to the camera and look ahead into the distance. Strong jawline shot.", "Eye level, straight from the side.",
    [54,13],[46,29],[54,29],[45,47],[56,48],[47,64],[57,64],[47,68],[53,68],[48,97],[54,97],[46,127],[57,127]],
];

const BOX = { x0: -10, y0: -8, w: 120, h: 154 };
const n = (p) => ({ x: (p[0] - BOX.x0) / BOX.w, y: (p[1] - BOX.y0) / BOX.h });

export const POSES = RAW.map(([name, gender, cat, how, cam, nose, s0, s1, e0, e1, w0, w1, h0, h1, k0, k1, a0, a1]) => ({
  id: "b-" + name.toLowerCase().replace(/[^a-z]+/g, "-"),
  name, gender, cat, how, cam, builtin: true, aspect: BOX.w / BOX.h,
  joints: { nose: n(nose), sh: [n(s0), n(s1)], el: [n(e0), n(e1)], wr: [n(w0), n(w1)], hip: [n(h0), n(h1)], kn: [n(k0), n(k1)], an: [n(a0), n(a1)] },
}));

/* ---------------- Silhouette renderer ---------------- */
const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const add = (a, v, k = 1) => ({ x: a.x + v.x * k, y: a.y + v.y * k });
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const unit = (a, b) => { const d = dist(a, b) || 1; return { x: (b.x - a.x) / d, y: (b.y - a.y) / d }; };
const perp = (v) => ({ x: -v.y, y: v.x });
const mid = (a, b) => lerp(a, b, 0.5);

// Draws a filled body on ctx from joints in pixel coords. colors: {body, hair, edge, shade}
export function drawBody(ctx, J, gender, colors) {
  const sM = mid(J.sh[0], J.sh[1]), hM = mid(J.hip[0], J.hip[1]);
  const T = dist(sM, hM) || 40, man = gender === "m";
  const up = unit(hM, sM), down = { x: -up.x, y: -up.y };
  ctx.save();
  ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.lineWidth = Math.max(1, 0.028 * T);
  const paint = (fill) => { ctx.fillStyle = fill || colors.body; ctx.fill(); if (colors.edge) { ctx.strokeStyle = colors.edge; ctx.stroke(); } };
  const ellipse = (p, rx, ry, rot, fill) => { ctx.beginPath(); ctx.ellipse(p.x, p.y, rx, ry, rot, 0, Math.PI * 2); paint(fill); };
  // tapered capsule as one outline so the edge only traces the outside
  const limb = (a, b, r1, r2) => {
    const v = unit(a, b), q = perp(v), th = Math.atan2(q.y, q.x);
    ctx.beginPath();
    ctx.moveTo(a.x + q.x * r1, a.y + q.y * r1); ctx.lineTo(b.x + q.x * r2, b.y + q.y * r2);
    ctx.arc(b.x, b.y, r2, th, th - Math.PI, true);
    ctx.lineTo(a.x - q.x * r1, a.y - q.y * r1);
    ctx.arc(a.x, a.y, r1, th - Math.PI, th - 2 * Math.PI, true);
    ctx.closePath(); paint();
  };

  const headC = add(J.nose, up, 0.05 * T), headAxis = unit(sM, headC), rot = Math.atan2(headAxis.y, headAxis.x) + Math.PI / 2;
  const hq = perp(headAxis);

  // long hair falls behind the body, so it goes first
  if (!man) {
    const top = add(headC, headAxis, 0.06 * T);
    const a = add(top, hq, 0.24 * T), b = add(top, hq, -0.24 * T);
    const low = add(headC, headAxis, -0.8 * T);
    const c = add(low, hq, -0.28 * T), d = add(low, hq, 0.28 * T), tip = add(headC, headAxis, -0.95 * T);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(d.x, d.y); ctx.quadraticCurveTo(tip.x, tip.y, c.x, c.y); ctx.lineTo(b.x, b.y); ctx.closePath();
    paint(colors.hair);
    ellipse(top, 0.245 * T, 0.28 * T, rot, colors.hair);
  }

  // standing legs sit behind the torso; legs folded up towards the camera (sitting, squatting) go in front
  const thigh = man ? 0.15 : 0.165, knee = man ? 0.09 : 0.08, ankle = 0.048;
  const folded = (i) => J.kn[i].y < J.hip[i].y + 0.35 * T;
  const leg = (i) => {
    const out = i === 0 ? -1 : 1, footDir = unit(J.kn[i], J.an[i]);
    ellipse(add(add(J.an[i], footDir, 0.05 * T), { x: out, y: 0 }, 0.05 * T), 0.12 * T, 0.05 * T, 0);
    limb(J.kn[i], J.an[i], knee * T, ankle * T);
    limb(J.hip[i], J.kn[i], thigh * T, knee * T);
  };
  for (const i of [0, 1]) if (!folded(i)) leg(i);

  // torso: V shape for men, hourglass for women
  const su = unit(J.sh[0], J.sh[1]), hu = unit(J.hip[0], J.hip[1]);
  const turn = Math.min(1, dist(J.sh[0], J.sh[1]) / (0.55 * T)); // narrower when the body is turned sideways
  const sOut = (man ? 0.14 : 0.07) * T * turn, hOut = (man ? 0.09 : 0.17) * T * Math.min(1, dist(J.hip[0], J.hip[1]) / (0.3 * T));
  const s0 = add(add(J.sh[0], su, -sOut), down, 0.03 * T), s1 = add(add(J.sh[1], su, sOut), down, 0.03 * T);
  const h0 = add(J.hip[0], hu, -hOut), h1 = add(J.hip[1], hu, hOut);
  const pinch = (man ? 0.03 : 0.1) * T * turn;
  const w0 = add(lerp(s0, h0, 0.58), su, pinch), w1 = add(lerp(s1, h1, 0.58), su, -pinch);
  const bot = add(hM, down, 0.16 * T), nk = add(sM, up, 0.05 * T);
  ctx.beginPath();
  ctx.moveTo(s0.x, s0.y);
  ctx.quadraticCurveTo(w0.x, w0.y, h0.x, h0.y);
  ctx.quadraticCurveTo(add(h0, down, 0.14 * T).x, add(h0, down, 0.14 * T).y, bot.x, bot.y);
  ctx.quadraticCurveTo(add(h1, down, 0.14 * T).x, add(h1, down, 0.14 * T).y, h1.x, h1.y);
  ctx.quadraticCurveTo(w1.x, w1.y, s1.x, s1.y);
  ctx.quadraticCurveTo(nk.x, nk.y, s0.x, s0.y);
  ctx.closePath(); paint();

  for (const i of [0, 1]) if (folded(i)) leg(i);

  // neck + head
  limb(lerp(sM, headC, 0.1), lerp(sM, headC, 0.72), 0.095 * T, 0.08 * T);
  ellipse(headC, 0.185 * T, 0.235 * T, rot);
  if (man) {
    ctx.beginPath();
    ctx.ellipse(headC.x, headC.y, 0.2 * T, 0.25 * T, rot, Math.PI * 1.05, Math.PI * 1.95);
    const hairTop = add(headC, headAxis, 0.29 * T);
    ctx.quadraticCurveTo(hairTop.x, hairTop.y, ...Object.values(add(add(headC, hq, -0.2 * T), headAxis, 0.04 * T)));
    ctx.closePath(); paint(colors.hair);
  } else {
    // fringe line over the forehead
    ctx.beginPath(); ctx.ellipse(headC.x, headC.y, 0.2 * T, 0.25 * T, rot, Math.PI * 1.1, Math.PI * 1.9); ctx.closePath(); paint(colors.hair);
  }

  // arms on top
  const ua = man ? 0.095 : 0.075, el = man ? 0.07 : 0.058, wr = man ? 0.048 : 0.04;
  for (const i of [0, 1]) {
    limb(J.sh[i], J.el[i], ua * T, el * T);
    limb(J.el[i], J.wr[i], el * T, wr * T);
    const dir = unit(J.el[i], J.wr[i]);
    ellipse(add(J.wr[i], dir, 0.08 * T), 0.065 * T, 0.095 * T, Math.atan2(dir.y, dir.x) + Math.PI / 2);
  }

  // soft side light for a bit of form
  if (colors.shade) {
    ctx.globalCompositeOperation = "source-atop";
    const g = ctx.createLinearGradient(sM.x - T, 0, sM.x + T, 0);
    g.addColorStop(0, "rgba(255,255,255,.16)"); g.addColorStop(0.5, "rgba(255,255,255,0)"); g.addColorStop(1, colors.shade);
    ctx.fillStyle = g; ctx.fillRect(sM.x - 3 * T, sM.y - 3 * T, 6 * T, 7 * T);
  }
  ctx.restore();
}

// Renders a pose into its own canvas (figure box, padded) — used for the camera overlay and thumbnails.
export function poseCanvas(pose, height, colors) {
  const w = Math.round(height * pose.aspect), c = document.createElement("canvas");
  c.width = w; c.height = height;
  const ctx = c.getContext("2d"), J = { nose: px(pose.joints.nose) };
  function px(p) { return { x: p.x * w, y: p.y * height }; }
  for (const k of ["sh", "el", "wr", "hip", "kn", "an"]) J[k] = pose.joints[k].map(px);
  drawBody(ctx, J, pose.gender, colors);
  return c;
}
