// First-run onboarding: a few questions to personalise the pose tray, then short demos of each feature.
import { POSES, poseCanvas } from "./poses.js";

const $ = (id) => document.getElementById(id);
const byName = (n) => POSES.find((p) => p.name === n);

/* ---------- Illustrated "photos" for the cards (drawn, no stock images) ---------- */
const SCENES = {
  beach(x, w, h) {
    const sky = x.createLinearGradient(0, 0, 0, h * 0.55); sky.addColorStop(0, "#7FB8E8"); sky.addColorStop(1, "#DDEEFA");
    x.fillStyle = sky; x.fillRect(0, 0, w, h);
    x.fillStyle = "#FFF4D6"; x.beginPath(); x.arc(w * 0.8, h * 0.16, w * 0.07, 0, 7); x.fill();
    x.fillStyle = "#2E9BBF"; x.fillRect(0, h * 0.46, w, h * 0.12);
    x.fillStyle = "#8FD3E3"; x.fillRect(0, h * 0.56, w, h * 0.02);
    const sand = x.createLinearGradient(0, h * 0.58, 0, h); sand.addColorStop(0, "#F1DFBE"); sand.addColorStop(1, "#E2C89C");
    x.fillStyle = sand; x.fillRect(0, h * 0.58, w, h);
    x.fillStyle = "#A8743F"; for (let i = 0; i < 14; i++) { x.fillRect(i * w / 13, 0, w / 16, h * (0.09 + (i % 3) * 0.02)); }
  },
  street(x, w, h) {
    x.fillStyle = "#C9C2B8"; x.fillRect(0, 0, w, h);
    x.fillStyle = "#B3AA9E"; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) x.fillRect(w * (0.08 + c * 0.32), h * (0.06 + r * 0.17), w * 0.18, h * 0.11);
    const pave = x.createLinearGradient(0, h * 0.6, 0, h); pave.addColorStop(0, "#9C978F"); pave.addColorStop(1, "#7F7A73");
    x.fillStyle = pave; x.fillRect(0, h * 0.6, w, h);
    x.strokeStyle = "rgba(0,0,0,.12)"; x.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(0, h * (0.66 + i * 0.07)); x.lineTo(w, h * (0.64 + i * 0.07)); x.stroke(); }
    x.fillStyle = "#2A2A2A"; x.fillRect(w * 0.08, h * 0.38, w * 0.05, h * 0.3);
  },
  room(x, w, h) {
    x.fillStyle = "#EDE6DC"; x.fillRect(0, 0, w, h);
    const win = x.createLinearGradient(w * 0.6, 0, w, 0); win.addColorStop(0, "rgba(255,255,255,.0)"); win.addColorStop(1, "rgba(255,255,255,.85)");
    x.fillStyle = win; x.fillRect(w * 0.6, 0, w * 0.4, h * 0.7);
    x.fillStyle = "#D8CDBF"; x.fillRect(w * 0.05, h * 0.5, w * 0.4, h * 0.16);
    x.fillStyle = "#3B3B3B"; x.fillRect(w * 0.1, h * 0.53, w * 0.08, h * 0.06);
    x.fillStyle = "#C4A27E"; x.fillRect(0, h * 0.7, w, h * 0.3);
    x.fillStyle = "#6E8B5B"; x.beginPath(); x.ellipse(w * 0.9, h * 0.58, w * 0.08, h * 0.12, 0, 0, 7); x.fill();
  },
  golden(x, w, h) {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#FFC98B"); g.addColorStop(0.55, "#F59E7C"); g.addColorStop(1, "#8E6F9E");
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = "rgba(255,240,200,.9)"; x.beginPath(); x.arc(w * 0.3, h * 0.55, w * 0.12, 0, 7); x.fill();
    x.fillStyle = "#5B4A6E"; x.fillRect(0, h * 0.68, w, h * 0.32);
  },
};
const SKIN = { body: "#E8C3A0", hair: "#3B2A20", edge: "rgba(60,35,20,.35)", shade: "rgba(80,40,20,.22)" };
const SILHOUETTE = { body: "#2B2433", hair: "#2B2433", edge: null, shade: null };

function photo(scene, poseName, w = 300, h = 380, opts = {}) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d"); SCENES[scene](x, w, h);
  const p = byName(poseName);
  if (p) {
    const fh = Math.round(h * (opts.scale || 0.92)), fig = poseCanvas(p, fh, opts.colors || (scene === "golden" ? SILHOUETTE : SKIN));
    const fx = (w - fig.width) / 2 + (opts.dx || 0) * w, fy = h - fh + (opts.dy || 0) * h;
    if (opts.ghost) { // gold outline where the pose should be
      x.save(); x.globalAlpha = 0.95; x.drawImage(outline(poseCanvas(p, fh, SKIN), "#F2B04C"), (w - fig.width) / 2, fy); x.restore();
    }
    if (opts.cut) { x.fillStyle = "rgba(255,255,255,.0)"; x.drawImage(outline(fig, "#FFFFFF", 3), fx, fy); }
    x.drawImage(fig, fx, fy);
  }
  return c.toDataURL("image/jpeg", 0.9);
}
function outline(img, color, k = 2) {
  const w = img.width, h = img.height, c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d"), r = Math.max(2, Math.round(h / 140) * k);
  for (let a = 0; a < 16; a++) x.drawImage(img, Math.cos(a / 16 * 6.283) * r, Math.sin(a / 16 * 6.283) * r);
  x.globalCompositeOperation = "source-in"; x.fillStyle = color; x.fillRect(0, 0, w, h);
  x.globalCompositeOperation = "destination-out"; x.drawImage(img, 0, 0);
  return c;
}

/* ---------- Copy ---------- */
const COPY = {
  en: {
    intro: ["Copy any pose", "Found a photo you love on Pinterest, Instagram or a friend's feed? ShotSathi turns that pose into a live guide on your camera."],
    who: "Who's in front of the camera?", whoOpts: { w: "Women's poses", m: "Men's poses", all: "Show me both" },
    turn: "How do your photos usually come out?", turnOpts: ["Mostly great", "Some good, some bad", "Never quite right", "I avoid being in photos"],
    goal: "What do you want to get better at?", goalOpts: { mirror: "Mirror selfies", fullbody: "Full-body outfit shots", street: "Street & travel", candid: "Candid moments", portrait: "Close-up portraits", sitting: "Sitting poses" },
    pain: "What usually goes wrong?", painNote: "Pick all that apply",
    painOpts: { hands: "I don't know what to do with my hands", freeze: "I go stiff in front of the camera", same: "I do the same pose every time", friend: "My friend doesn't know how to shoot me", late: "I only see the problem after the shot" },
    cut: ["Lift the pose out", "Tap the person in any photo and ShotSathi cuts them out as a guide. It all runs on your phone; photos never get uploaded.", "Tap the person to lift them"],
    line: ["Match it on your camera", "The pose floats over the live camera. Drag, pinch or rotate it, then step into the outline.", "Framed like the photo you saved"],
    coach: ["A coach that watches for you", "The ring fills from orange to green as you get closer, with one simple tip at a time.", "Tiny nudges instead of guesswork"],
    auto: ["Auto-Capture", "Hold the pose when the ring turns green and the camera takes the shot for you. No more running to the timer."],
    done: ["You're ready", "Your camera's set up. Let's find your first pose.", "Starting with", "We'll help with"],
    painHelp: { hands: "Every pose shows exactly where the hands go", freeze: "Auto-Capture shoots the moment you're in position", same: "25 poses plus any photo you save", friend: "Pose Assist tells them where to stand", late: "Live tips before you press the shutter" },
    cont: "Continue", go: "Open camera", skip: "Skip",
  },
  bn: {
    intro: ["যেকোনো পোজ কপি করুন", "Pinterest, Instagram বা বন্ধুর ছবিতে পছন্দের পোজ দেখেছেন? ShotSathi সেই পোজকে আপনার ক্যামেরায় লাইভ গাইড বানিয়ে দেয়।"],
    who: "ক্যামেরার সামনে কে থাকবে?", whoOpts: { w: "মেয়েদের পোজ", m: "ছেলেদের পোজ", all: "দুটোই দেখান" },
    turn: "আপনার ছবি সাধারণত কেমন হয়?", turnOpts: ["বেশিরভাগই ভালো", "কিছু ভালো, কিছু খারাপ", "কখনো ঠিকমতো হয় না", "ছবি তুলতেই চাই না"],
    goal: "কোন ধরনের ছবি ভালো করতে চান?", goalOpts: { mirror: "মিরর সেলফি", fullbody: "ফুল-বডি আউটফিট", street: "স্ট্রিট ও ট্রাভেল", candid: "ক্যান্ডিড মুহূর্ত", portrait: "ক্লোজ-আপ পোর্ট্রেট", sitting: "বসে থাকা পোজ" },
    pain: "সাধারণত কী সমস্যা হয়?", painNote: "যতগুলো মেলে বাছুন",
    painOpts: { hands: "হাত দিয়ে কী করব বুঝি না", freeze: "ক্যামেরার সামনে শক্ত হয়ে যাই", same: "প্রতিবার একই পোজ দিই", friend: "বন্ধু ঠিকমতো ছবি তুলতে পারে না", late: "ছবি তোলার পরে ভুল চোখে পড়ে" },
    cut: ["পোজটা কেটে নিন", "যেকোনো ছবিতে মানুষের উপর ট্যাপ করুন, ShotSathi তাকে কেটে গাইড বানাবে। সব ফোনেই হয়, ছবি কোথাও আপলোড হয় না।", "মানুষের উপর ট্যাপ করুন"],
    line: ["ক্যামেরায় মিলিয়ে নিন", "পোজটা লাইভ ক্যামেরার উপর ভাসে। টেনে, পিঞ্চ করে বা ঘুরিয়ে বসান, তারপর আউটলাইনের মধ্যে দাঁড়ান।", "সেভ করা ছবির মতোই ফ্রেম"],
    coach: ["আপনার পোজ কোচ", "যত কাছে আসবেন রিং কমলা থেকে সবুজ হবে, একবারে একটা সহজ টিপ।", "আন্দাজ নয়, ছোট ছোট গাইড"],
    auto: ["অটো-ক্যাপচার", "রিং সবুজ হলে পোজ ধরে রাখুন, ক্যামেরা নিজেই ছবি তুলবে।"],
    done: ["সব রেডি", "ক্যামেরা তৈরি। চলুন প্রথম পোজটা খুঁজি।", "শুরু করছি", "যেভাবে সাহায্য করব"],
    painHelp: { hands: "প্রতিটা পোজে হাত কোথায় থাকবে দেখানো আছে", freeze: "পজিশনে এলেই অটো-ক্যাপচার ছবি তোলে", same: "২৫টা পোজ, সাথে আপনার সেভ করা ছবি", friend: "পোজ অ্যাসিস্ট বলে দেয় কোথায় দাঁড়াতে হবে", late: "শাটার চাপার আগেই লাইভ টিপ" },
    cont: "চালিয়ে যান", go: "ক্যামেরা খুলুন", skip: "বাদ দিন",
  },
};

/* ---------- Flow ---------- */
export function runOnboarding({ lang, onLang, onDone }) {
  const root = $("onboard");
  const ans = { who: null, turn: null, goal: null, pains: new Set() };
  let i = 0;
  const L = () => COPY[lang];
  const pics = {}; // cache drawn photos
  const pic = (key, ...args) => (pics[key] ||= photo(...args));

  const stack = (items) => `<div class="ob-stack">${items.map((src, k) => `<figure class="ob-card c${k}"><img src="${src}" alt=""></figure>`).join("")}</div>`;
  const options = (opts, sel, multi) => `<div class="ob-opts" role="${multi ? "group" : "radiogroup"}">${Object.entries(opts).map(([k, v]) =>
    `<button class="ob-opt" data-k="${k}" role="${multi ? "checkbox" : "radio"}" aria-checked="${multi ? sel.has(k) : sel === k}">${v}</button>`).join("")}</div>`;

  const STEPS = [
    { valid: () => true, html: () => `${stackIntro()}<h1>${L().intro[0]}</h1><p class="ob-sub">${L().intro[1]}</p>
        <div class="ob-lang" role="group" aria-label="Language"><button data-lang="en" aria-pressed="${lang === "en"}">English</button><button data-lang="bn" aria-pressed="${lang === "bn"}">বাংলা</button></div>` },
    { valid: () => !!ans.who, key: "who", html: () => `<h1 class="ob-q">${L().who}</h1>${options(L().whoOpts, ans.who)}` },
    { valid: () => ans.turn != null, key: "turn", html: () => `${stackTurn()}<h1 class="ob-q">${L().turn}</h1>${options(Object.fromEntries(L().turnOpts.map((t, k) => [k, t])), ans.turn == null ? null : String(ans.turn))}` },
    { valid: () => !!ans.goal, key: "goal", html: () => `<h1 class="ob-q">${L().goal}</h1>${options(L().goalOpts, ans.goal)}` },
    { valid: () => ans.pains.size > 0, key: "pains", html: () => `<h1 class="ob-q">${L().pain}</h1><p class="ob-note">${L().painNote}</p>${options(L().painOpts, ans.pains, true)}` },
    { valid: () => true, html: () => demo(pic("cut", "beach", gp("Look back", "Pockets and lean"), 300, 380, { cut: true }), `<span class="ob-tap"></span>`, L().cut[2], "ob-hint") + feature(L().cut, null) },
    { valid: () => true, html: () => demo(pic("line", "street", gp("Coffee in hand", "Fix the watch"), 300, 380, { ghost: true, dx: 0.07 }), `<span class="ob-zoom"><i>0.5</i><b>1x</b><i>2</i></span>`) + feature(L().line, L().line[2]) },
    { valid: () => true, html: () => demo(pic("coach", "room", gp("Hair tuck", "Arms crossed")), `<span class="ob-dot"></span><span class="ob-tip"><em>${lang === "bn" ? "◀ পাশের হাত উপরে" : "Raise the ◀ hand"}</em><em>${lang === "bn" ? "একটু পিছনে যান" : "Step back"}</em><em>${lang === "bn" ? "প্রায় হয়ে গেছে" : "Almost there"}</em></span>`) + feature(L().coach, L().coach[2]) },
    { valid: () => true, html: () => demo(pic("auto", "street", gp("Street squat", "Low squat")), `<span class="ob-ok"><i></i>${lang === "bn" ? "পারফেক্ট — ধরে রাখুন!" : "Perfect — hold it!"}</span><span class="ob-shutter"><svg viewBox="0 0 88 88"><circle cx="44" cy="44" r="40"/></svg></span>`) + feature(L().auto, null) },
    { valid: () => true, last: true, html: () => `${stackDone()}<h1>${L().done[0]}</h1><p class="ob-sub">${L().done[1]}</p>
        <p class="ob-note">${L().done[2]}</p><span class="ob-chip">${L().goalOpts[ans.goal || "portrait"]}</span>
        ${ans.pains.size ? `<ul class="ob-help">${[...ans.pains].map((k) => `<li>${L().painHelp[k]}</li>`).join("")}</ul>` : ""}` },
  ];
  // gender-aware pose pick
  function gp(w, m) { return ans.who === "m" ? m : w; }
  function stackIntro() { return stack([pic("i1", "room", "Hands in hair", 240, 300), pic("i2", "beach", "Twirl", 240, 300), pic("i3", "street", "Pockets and lean", 240, 300)]); }
  function stackTurn() { return stack([pic("t1", "beach", gp("Look back", "Railing lean"), 240, 300), pic("t2", "street", gp("Walk away, glance back", "Walk toward, look away"), 240, 300), pic("t3", "street", gp("Street squat", "Low squat"), 240, 300)]); }
  function stackDone() {
    const ids = { mirror: ["Mirror selfie", "Mirror check"], fullbody: ["Wall lean, foot up", "Jacket over shoulder"], street: ["Walk away, glance back", "Walk toward, look away"], candid: ["Coffee in hand", "Phone check"], portrait: ["Hat or sunglasses", "Collar pop"], sitting: ["Steps, knees up", "Elbows on knees"] }[ans.goal || "portrait"];
    const main = gp(ids[0], ids[1]);
    return stack([pic("d1" + main, "room", gp("Hair tuck", "Fix the watch"), 240, 300), pic("d2" + main, "golden", main, 240, 300), pic("d3" + main, "beach", gp("Twirl", "Railing lean"), 240, 300)]);
  }
  function demo(src, extra, hint, hintCls) {
    return `<div class="ob-demo"><img src="${src}" alt="">${extra || ""}</div>${hint ? `<p class="${hintCls}">${hint}</p>` : ""}`;
  }
  function feature([title, body], pill) {
    return `${pill ? `<span class="ob-pill">${pill}</span>` : ""}<h1>${title}${/Auto|অটো|coach|কোচ/.test(title) ? ' <span class="ob-free">FREE</span>' : ""}</h1><p class="ob-sub">${body}</p>`;
  }

  function render() {
    const s = STEPS[i];
    root.innerHTML = `
      <div class="ob-top">
        <button class="ob-back" aria-label="Back" ${i === 0 ? "hidden" : ""}><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
        <div class="ob-bar"><i style="width:${((i + 1) / STEPS.length) * 100}%"></i></div>
        <button class="ob-skip">${L().skip}</button>
      </div>
      <div class="ob-body" data-step="${i}">${s.html()}</div>
      <div class="ob-foot"><button class="ob-cta" ${s.valid() ? "" : "disabled"}>${s.last ? L().go : L().cont}</button></div>`;
  }
  root.onclick = (e) => {
    const t = e.target;
    if (t.closest(".ob-back")) { i = Math.max(0, i - 1); render(); return; }
    if (t.closest(".ob-skip")) { finish(); return; }
    const lb = t.closest("[data-lang]");
    if (lb) { lang = lb.dataset.lang; onLang(lang); render(); return; }
    const opt = t.closest(".ob-opt");
    if (opt) {
      const k = opt.dataset.k, key = STEPS[i].key;
      if (key === "pains") ans.pains.has(k) ? ans.pains.delete(k) : ans.pains.add(k);
      else ans[key] = key === "turn" ? Number(k) : k;
      render();
      return;
    }
    if (t.closest(".ob-cta") && STEPS[i].valid()) { if (STEPS[i].last) finish(); else { i++; render(); root.scrollTop = 0; } }
  };
  function finish() {
    root.hidden = true;
    onDone({ who: ans.who || "all", goal: ans.goal || "portrait", pains: [...ans.pains] });
  }
  root.hidden = false;
  render();
}
