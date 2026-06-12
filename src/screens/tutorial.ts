import { $ } from '../dom';
import { setScreen } from './router';
import { confetti } from '../confetti';
import { sndKey, sndTick, sndCorrect, sndWrong, sndCombo, vibrate } from '../audio';
import { comboMult, COMBO_CALLOUTS } from '../scoring';

/**
 * Guess-O-Tron — the multiplication "Explore" machine.
 *
 * Loop: pick a problem → (optionally) predict the answer → watch it BUILD
 * step-by-step with a tally counting up → reveal & judge the guess → chase a
 * suggested next problem. The visual is chosen from the numbers themselves
 * (small = groups, mid = array, big/2-digit = area split), so it adapts to
 * whatever the kid throws at it. Reuses the game's confetti, sounds, and combo
 * scoring so it feels like the same world. Prediction is OPTIONAL — "Just show
 * me" skips straight to the build.
 */

export interface TutProblem {
  a: number;
  b: number;
}

type Phase = 'pick' | 'predict' | 'build' | 'reveal';
type Rep = 'groups' | 'array' | 'area';
type Result = 'show' | 'exact' | 'close' | 'far';

const TENS = '#2ee6ff';
const ONES = '#ffd23f';

const gt = {
  a: 5,
  b: 10,
  phase: 'predict' as Phase,
  rep: 'array' as Rep,
  reveal: 0,
  guess: '',
  guessed: null as number | null,
  result: 'show' as Result,
  streak: 0,
  power: 0,
  attempts: 0,
  hits: 0,
  autoTimer: null as ReturnType<typeof setInterval> | null,
};

const norm = (p: TutProblem): TutProblem => ({ a: Math.max(p.a, p.b), b: Math.min(p.a, p.b) });
const randFactor = (): number => 2 + Math.floor(Math.random() * 11); // 2–12

/* ---------- SVG helpers ---------- */

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElementTagNameMap[K];
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}
function stageSvg(w: number, h: number): SVGSVGElement {
  const s = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, width: '100%', preserveAspectRatio: 'xMidYMid meet' });
  s.style.maxHeight = '40vh';
  return s;
}
function label(x: number, y: number, str: string, attrs: Record<string, string | number> = {}): SVGTextElement {
  const t = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': 'Bungee, sans-serif', fill: '#f4ecff', ...attrs });
  t.textContent = str;
  return t;
}

/* ---------- renderers (parametrised by reveal level) ---------- */

function renderGroups(a: number, b: number, shown: number): SVGSVGElement {
  const perRow = 5;
  const r = 7;
  const cellW = r * 2 + 6;
  const rows = Math.ceil(a / perRow);
  const groupW = perRow * cellW + 16;
  const groupH = rows * cellW + 16;
  const m = 12;
  const s = stageSvg(b * groupW + (b + 1) * m, groupH + 2 * m + 22);
  for (let g = 0; g < b; g++) {
    const gx = m + g * (groupW + m);
    const gy = m;
    const filled = g < shown;
    s.appendChild(svgEl('rect', {
      x: gx, y: gy, width: groupW, height: groupH, rx: 14,
      fill: filled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
      stroke: filled ? 'rgba(150,110,255,0.32)' : 'rgba(150,110,255,0.18)',
      'stroke-dasharray': filled ? '0' : '6 6',
    }));
    if (!filled) continue;
    for (let i = 0; i < a; i++) {
      s.appendChild(svgEl('circle', { cx: gx + 8 + (i % perRow) * cellW + r, cy: gy + 8 + Math.floor(i / perRow) * cellW + r, r, fill: TENS }));
    }
  }
  return s;
}

function renderArray(a: number, b: number, shown: number): SVGSVGElement {
  const r = 7;
  const cell = r * 2 + 5;
  const m = 16;
  const s = stageSvg(a * cell + 2 * m, b * cell + 2 * m);
  const twoDigit = a >= 10;
  for (let row = 0; row < shown; row++) {
    for (let col = 0; col < a; col++) {
      s.appendChild(svgEl('circle', { cx: m + col * cell + r, cy: m + row * cell + r, r, fill: twoDigit ? (col < 10 ? TENS : ONES) : TENS }));
    }
  }
  return s;
}

function renderArea(a: number, b: number, level: number): SVGSVGElement {
  const tens = Math.floor(a / 10) * 10;
  const ones = a % 10;
  const split = tens > 0 && ones > 0;
  const unitW = a > 15 ? 11 : 15;
  const unitH = 22;
  const H = b * unitH;
  const m = 42;

  if (!split) {
    const W = a * unitW;
    const s = stageSvg(W + 2 * m, H + 2 * m + 8);
    const filled = level >= 1;
    s.appendChild(svgEl('rect', { x: m, y: m, width: W, height: H, rx: 4, fill: filled ? 'rgba(46,230,255,0.22)' : 'rgba(255,255,255,0.04)', stroke: TENS, 'stroke-width': 2, 'stroke-dasharray': filled ? '0' : '6 6' }));
    if (filled) s.appendChild(label(m + W / 2, m + H / 2, `${a}×${b}=${a * b}`, { 'font-size': 16, fill: '#fff' }));
    s.appendChild(label(m + W / 2, m - 16, String(a), { 'font-size': 14, fill: TENS }));
    s.appendChild(label(m - 18, m + H / 2, String(b), { 'font-size': 14, fill: '#b9a8e6' }));
    return s;
  }

  const wT = tens * unitW;
  const wO = ones * unitW;
  const W = wT + wO;
  const s = stageSvg(W + 2 * m, H + 2 * m + 26);
  const x0 = m;
  const y0 = m;
  s.appendChild(svgEl('rect', { x: x0, y: y0, width: W, height: H, rx: 4, fill: 'none', stroke: 'rgba(150,110,255,0.3)', 'stroke-width': 1.5, 'stroke-dasharray': '5 5' }));
  if (level >= 1) {
    s.appendChild(svgEl('rect', { x: x0, y: y0, width: wT, height: H, fill: 'rgba(46,230,255,0.22)', stroke: TENS, 'stroke-width': 2 }));
    s.appendChild(label(x0 + wT / 2, y0 + H / 2, `${tens}×${b}=${tens * b}`, { 'font-size': 15, fill: '#fff' }));
    s.appendChild(label(x0 + wT / 2, y0 - 16, String(tens), { 'font-size': 13, fill: TENS }));
  }
  if (level >= 2) {
    s.appendChild(svgEl('rect', { x: x0 + wT, y: y0, width: wO, height: H, fill: 'rgba(255,210,63,0.22)', stroke: ONES, 'stroke-width': 2 }));
    s.appendChild(label(x0 + wT + wO / 2, y0 + H / 2, `${ones}×${b}=${ones * b}`, { 'font-size': 13, fill: '#fff' }));
    s.appendChild(label(x0 + wT + wO / 2, y0 - 16, String(ones), { 'font-size': 13, fill: ONES }));
    s.appendChild(label((W + 2 * m) / 2, y0 + H + 22, `${tens * b} + ${ones * b} = ${a * b}`, { 'font-size': 16, fill: '#9bff5b' }));
  }
  s.appendChild(label(x0 - 20, y0 + H / 2, String(b), { 'font-size': 13, fill: '#b9a8e6' }));
  return s;
}

function placeholder(): SVGSVGElement {
  const s = stageSvg(220, 120);
  s.appendChild(svgEl('rect', { x: 20, y: 20, width: 180, height: 80, rx: 16, fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(150,110,255,0.3)', 'stroke-width': 2, 'stroke-dasharray': '8 8' }));
  s.appendChild(label(110, 60, '?', { 'font-size': 56, fill: '#9b5cff' }));
  return s;
}

/* ---------- adaptive routing + build maths ---------- */

function pickRep(a: number, b: number): Rep {
  if (a >= 10) return 'area';
  if (a * b > 60) return 'area'; // e.g. 9×9 = 81 → area/box, never 81 dots
  if (a >= 6) return 'array';
  return 'groups';
}
function maxReveal(): number {
  if (gt.rep !== 'area') return gt.b;
  const tens = Math.floor(gt.a / 10) * 10;
  const ones = gt.a % 10;
  return tens > 0 && ones > 0 ? 2 : 1;
}
function tallyNow(): number {
  const { a, b, rep, reveal } = gt;
  if (rep !== 'area') return reveal * a;
  const tens = Math.floor(a / 10) * 10;
  const ones = a % 10;
  if (!(tens > 0 && ones > 0)) return reveal >= 1 ? a * b : 0;
  return (reveal >= 1 ? tens * b : 0) + (reveal >= 2 ? ones * b : 0);
}

/* ---------- small DOM builders ---------- */

const div = (cls: string): HTMLDivElement => Object.assign(document.createElement('div'), { className: cls });
function btn(text: string, cls: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = cls;
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}
function key(text: string, onClick: () => void, extra = ''): HTMLButtonElement {
  return btn(text, 'key' + (extra ? ' ' + extra : ''), onClick);
}

/* ---------- reward effects (reuse the game's CSS) ---------- */

function floatPts(text: string): void {
  const el = div('float-pts');
  el.textContent = text;
  $('gtSlot').appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
function flashGood(): void {
  const f = div('flash-good');
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 400);
}
function maybeCombo(streak: number): void {
  const text = COMBO_CALLOUTS[streak];
  if (!text) return;
  const el = div('combo-callout');
  el.textContent = text;
  $('tutorial').appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

/* ---------- build driver ---------- */

function crank(): void {
  if (gt.phase !== 'build') return;
  const max = maxReveal();
  if (gt.reveal >= max) return;
  gt.reveal++;
  sndTick();
  if (gt.reveal >= max) finishBuild();
  else render();
}
function startAuto(): void {
  if (gt.autoTimer) return;
  gt.autoTimer = setInterval(crank, 480);
}
function stopAuto(): void {
  if (gt.autoTimer) clearInterval(gt.autoTimer);
  gt.autoTimer = null;
}
function skip(): void {
  stopAuto();
  gt.reveal = maxReveal();
  finishBuild();
}
function toBuild(): void {
  gt.rep = pickRep(gt.a, gt.b);
  gt.reveal = 0;
  gt.phase = 'build';
  render();
}
function finishBuild(): void {
  stopAuto();
  gt.phase = 'reveal';
  judge();
  render();
}

function judge(): void {
  const answer = gt.a * gt.b;
  if (gt.guessed === null) {
    gt.result = 'show';
    confetti(90);
    sndCorrect();
    return;
  }
  gt.attempts++;
  const diff = Math.abs(gt.guessed - answer);
  const band = Math.max(2, Math.round(answer * 0.1));
  if (gt.guessed === answer) {
    gt.streak++;
    gt.hits++;
    gt.result = 'exact';
    const mult = comboMult(gt.streak);
    confetti(120 + gt.streak * 8);
    sndCorrect();
    if (COMBO_CALLOUTS[gt.streak]) sndCombo();
    floatPts(`+${10 * mult}${mult > 1 ? ' ×' + mult : ''}`);
    flashGood();
    maybeCombo(gt.streak);
    vibrate(12);
  } else if (diff <= band) {
    gt.result = 'close';
    sndKey();
    vibrate(6);
  } else {
    gt.result = 'far';
    gt.streak = 0;
    sndWrong();
    vibrate([30, 40, 30]);
  }
  gt.power = gt.attempts ? Math.round((100 * gt.hits) / gt.attempts) : 0;
}

/* ---------- flow ---------- */

function startExplore(): void {
  const n = norm({ a: gt.a, b: gt.b });
  gt.a = n.a;
  gt.b = n.b;
  gt.phase = 'predict';
  gt.guess = '';
  gt.guessed = null;
  gt.reveal = 0;
  render();
}
function pressGuess(d: string): void {
  if (gt.guess.length >= 3) return;
  gt.guess += d;
  sndKey();
  render();
}

/* ---------- panels ---------- */

function chipRow(title: string, current: number, onPick: (n: number) => void): HTMLElement {
  const wrap = div('gt-chiprow');
  const lab = document.createElement('span');
  lab.className = 'gt-chiplabel';
  lab.textContent = title;
  wrap.appendChild(lab);
  const row = div('gt-chips');
  for (let n = 1; n <= 12; n++) {
    const c = btn(String(n), 'tut-chip' + (n === current ? ' on' : ''), () => onPick(n));
    row.appendChild(c);
  }
  wrap.appendChild(row);
  return wrap;
}

function pickPanel(): HTMLElement {
  const wrap = div('gt-panel-inner');
  wrap.appendChild(chipRow('First number', gt.a, (n) => { gt.a = n; render(); }));
  wrap.appendChild(chipRow('Second number', gt.b, (n) => { gt.b = n; render(); }));
  const actions = div('gt-actions');
  actions.appendChild(btn('🎲 Surprise', 'btn btn-cyan', () => { gt.a = randFactor(); gt.b = randFactor(); render(); }));
  actions.appendChild(btn('Go! ✅', 'btn btn-lime', startExplore));
  wrap.appendChild(actions);
  return wrap;
}

function predictPanel(): HTMLElement {
  const wrap = div('gt-panel-inner');
  const disp = div('gt-guess');
  disp.textContent = gt.guess || '?';
  wrap.appendChild(disp);
  const pad = div('gt-keypad');
  ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((d) => pad.appendChild(key(d, () => pressGuess(d))));
  pad.appendChild(key('C', () => { gt.guess = ''; render(); }, 'util'));
  pad.appendChild(key('0', () => pressGuess('0')));
  pad.appendChild(key('⌫', () => { gt.guess = gt.guess.slice(0, -1); render(); }, 'util'));
  wrap.appendChild(pad);
  const actions = div('gt-actions');
  const lock = btn('Lock it in 🔒', 'btn btn-lime', () => { if (!gt.guess) return; gt.guessed = parseInt(gt.guess, 10); toBuild(); });
  if (!gt.guess) lock.disabled = true;
  actions.appendChild(lock);
  actions.appendChild(btn('Just show me 👀', 'btn btn-ghost', () => { gt.guessed = null; toBuild(); }));
  wrap.appendChild(actions);
  wrap.appendChild(btn('✏️ change numbers', 'gt-link', () => { gt.phase = 'pick'; render(); }));
  return wrap;
}

function buildPanel(): HTMLElement {
  const actions = div('gt-actions');
  actions.appendChild(btn('▶ Auto', 'btn btn-cyan', startAuto));
  actions.appendChild(btn('Skip ⏭', 'btn btn-ghost', skip));
  return actions;
}

function nextChips(a: number, b: number): TutProblem[] {
  const seen = new Set([`${a}x${b}`]);
  const out: TutProblem[] = [];
  const add = (na: number, nb: number) => {
    const k = `${Math.max(na, nb)}x${Math.min(na, nb)}`;
    if (na >= 1 && nb >= 1 && na <= 12 && nb <= 99 && !seen.has(k)) {
      seen.add(k);
      out.push({ a: na, b: nb });
    }
  };
  if (b < 12) add(a, b + 1);
  if (a < 12) add(a + 1, b);
  if (b !== 10 && a !== 10) add(a, 10);
  return out.slice(0, 3);
}
function chaseTag(p: TutProblem): string {
  return `${p.a} × ${p.b}?!`;
}

function revealPanel(): HTMLElement {
  const wrap = div('gt-panel-inner');
  const lead = document.createElement('span');
  lead.className = 'gt-chiplabel';
  lead.textContent = 'Chase this next! 🚀';
  wrap.appendChild(lead);
  const chips = div('gt-chips');
  nextChips(gt.a, gt.b).forEach((p) => chips.appendChild(btn(chaseTag(p), 'gt-chase', () => { gt.a = p.a; gt.b = p.b; startExplore(); })));
  wrap.appendChild(chips);
  const actions = div('gt-actions');
  actions.appendChild(btn('🎲 Surprise', 'btn btn-cyan', () => { gt.a = randFactor(); gt.b = randFactor(); startExplore(); }));
  actions.appendChild(btn('✏️ Pick numbers', 'btn btn-ghost', () => { gt.phase = 'pick'; render(); }));
  wrap.appendChild(actions);
  return wrap;
}

/* ---------- captions ---------- */

function caption(): string {
  const { a, b, phase } = gt;
  const answer = a * b;
  if (phase === 'pick') return 'Pick two numbers to explore! 🔢';
  if (phase === 'predict') return `What do YOU think ${a} × ${b} is? Lock in a guess — or just watch! 🤔`;
  if (phase === 'build') {
    if (gt.reveal >= maxReveal()) return '';
    if (gt.rep === 'area') return `${a} is a big one — let's BREAK it apart! 👆 Tap to reveal each piece.`;
    const word = gt.rep === 'groups' ? 'group' : 'row';
    return `👆 Tap the build area to add a ${word}! ${tallyNow()} so far…`;
  }
  if (gt.result === 'show') return `There it is — ${a} × ${b} = ${answer}! 🎉 What next?`;
  if (gt.result === 'exact') return `BOOM — ${a} × ${b} = ${answer}! You CALLED it! 🎉`;
  if (gt.result === 'close') return `SOOO close — you said ${gt.guessed}, it's ${answer}! (${(gt.guessed ?? 0) < answer ? 'a little low' : 'a little high'}) 👌`;
  return `You said ${gt.guessed}, it's ${answer}. Let's chase another! 🚀`;
}

/* ---------- render ---------- */

function paintStage(): void {
  const el = $('tutStage');
  el.innerHTML = '';
  el.classList.toggle('crankable', gt.phase === 'build');
  if (gt.phase === 'pick' || gt.phase === 'predict') {
    el.appendChild(placeholder());
    return;
  }
  if (gt.rep === 'groups') el.appendChild(renderGroups(gt.a, gt.b, gt.reveal));
  else if (gt.rep === 'array') el.appendChild(renderArray(gt.a, gt.b, gt.reveal));
  else el.appendChild(renderArea(gt.a, gt.b, gt.reveal));
}

function render(): void {
  $('gtStreak').textContent = '🔥' + gt.streak;
  $('gtPowerFill').style.width = gt.power + '%';
  $('gtProblem').textContent = `${gt.a} × ${gt.b}`;
  $('gtTally').textContent = gt.phase === 'build' ? String(tallyNow()) : gt.phase === 'reveal' ? String(gt.a * gt.b) : '?';

  paintStage();

  const panel = $('gtPanel');
  panel.innerHTML = '';
  if (gt.phase === 'pick') panel.appendChild(pickPanel());
  else if (gt.phase === 'predict') panel.appendChild(predictPanel());
  else if (gt.phase === 'build') panel.appendChild(buildPanel());
  else panel.appendChild(revealPanel());

  $('tutCaption').textContent = caption();
}

/* ---------- public API ---------- */

export function initTutorial(): void {
  $('tutStage').addEventListener('click', () => {
    if (gt.phase === 'build') crank();
  });
}

/** Open the Explore machine, optionally seeded with a specific fact (from the game). */
export function openTutorial(problem?: TutProblem): void {
  stopAuto();
  if (problem) {
    const n = norm(problem);
    gt.a = n.a;
    gt.b = n.b;
  }
  gt.phase = 'predict';
  gt.guess = '';
  gt.guessed = null;
  gt.reveal = 0;
  gt.result = 'show';
  render();
  setScreen('tutorial');
}
