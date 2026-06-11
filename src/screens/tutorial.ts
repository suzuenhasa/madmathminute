import { $ } from '../dom';
import { setScreen } from './router';

/**
 * Tutorial (Learn) screen — multiplication.
 *
 * Shows ONE multiplication problem several ways so the school-curriculum models
 * connect to the familiar "carry the 1" algorithm:
 *   groups → array → area model → standard.
 * Place value is colour-coded consistently (tens = cyan, ones = yellow).
 *
 * Works for any a × b (single- or double-digit). `openTutorial(problem)` lets
 * the game hand it a specific fact the player just missed. Groups and the array
 * are tap-to-build (one group / one row per tap).
 */

type Method = 'groups' | 'array' | 'area' | 'standard';
export interface TutProblem {
  a: number;
  b: number;
}

const PRESETS: TutProblem[] = [
  { a: 13, b: 4 },
  { a: 12, b: 3 },
  { a: 7, b: 8 },
  { a: 24, b: 2 },
];

const TENS = '#2ee6ff'; // cyan
const ONES = '#ffd23f'; // yellow

const tut = { problem: PRESETS[0], method: 'groups' as Method, step: 0, reveal: 1 };

/** Largest factor first, so `a` is the one we decompose and `b` is the count. */
function norm(p: TutProblem): TutProblem {
  return { a: Math.max(p.a, p.b), b: Math.min(p.a, p.b) };
}

/* ---------- tiny SVG helpers ---------- */

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElementTagNameMap[K];
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

function stage(w: number, h: number): SVGSVGElement {
  const s = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, width: '100%', preserveAspectRatio: 'xMidYMid meet' });
  s.style.maxHeight = '42vh';
  return s;
}

function label(x: number, y: number, str: string, attrs: Record<string, string | number> = {}): SVGTextElement {
  const t = svgEl('text', {
    x, y,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'font-family': 'Bungee, sans-serif',
    fill: '#f4ecff',
    ...attrs,
  });
  t.textContent = str;
  return t;
}

/* ---------- method renderers ---------- */

// Groups: `tut.reveal` equal groups of `a` (tap-to-build).
function renderGroups(p: TutProblem): SVGSVGElement {
  const { a, b } = p;
  const shown = Math.min(tut.reveal, b);
  const perRow = 5;
  const r = 7;
  const gap = 6;
  const cellW = r * 2 + gap;
  const rows = Math.ceil(a / perRow);
  const groupW = perRow * cellW + 16;
  const groupH = rows * cellW + 16;
  const m = 12;
  const W = b * groupW + (b + 1) * m;
  const H = groupH + 2 * m + 22;
  const s = stage(W, H);
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
      const c = i % perRow;
      const row = Math.floor(i / perRow);
      s.appendChild(svgEl('circle', { cx: gx + 8 + c * cellW + r, cy: gy + 8 + row * cellW + r, r, fill: TENS }));
    }
    s.appendChild(label(gx + groupW / 2, gy + groupH + 14, String(a), { 'font-size': 15, fill: '#b9a8e6' }));
  }
  return s;
}

// Array: `tut.reveal` rows of `a` (tap-to-build). Cols 0–9 = the ten (cyan).
function renderArray(p: TutProblem): SVGSVGElement {
  const { a, b } = p;
  const shown = Math.min(tut.reveal, b);
  const r = 7;
  const gap = 5;
  const cell = r * 2 + gap;
  const m = 16;
  const W = a * cell + 2 * m;
  const H = b * cell + 2 * m;
  const s = stage(W, H);
  const twoDigit = a >= 10;
  for (let row = 0; row < shown; row++) {
    for (let col = 0; col < a; col++) {
      s.appendChild(svgEl('circle', {
        cx: m + col * cell + r,
        cy: m + row * cell + r,
        r,
        fill: twoDigit ? (col < 10 ? TENS : ONES) : TENS,
      }));
    }
  }
  return s;
}

// Area model: decompose `a` into tens + ones; single box when `a` < 10.
function renderArea(p: TutProblem): SVGSVGElement {
  const { a, b } = p;
  const tens = Math.floor(a / 10) * 10;
  const ones = a % 10;
  const split = tens > 0 && ones > 0;
  const unitW = a > 15 ? 11 : 15;
  const unitH = 22;
  const H = b * unitH;
  const m = 42;

  if (!split) {
    const W = a * unitW;
    const s = stage(W + 2 * m, H + 2 * m + 8);
    s.appendChild(svgEl('rect', { x: m, y: m, width: W, height: H, fill: 'rgba(46,230,255,0.22)', stroke: TENS, 'stroke-width': 2 }));
    s.appendChild(label(m + W / 2, m + H / 2, `${a}×${b}=${a * b}`, { 'font-size': 16, fill: '#fff' }));
    s.appendChild(label(m + W / 2, m - 16, String(a), { 'font-size': 14, fill: TENS }));
    s.appendChild(label(m - 18, m + H / 2, String(b), { 'font-size': 14, fill: '#b9a8e6' }));
    return s;
  }

  const wT = tens * unitW;
  const wO = ones * unitW;
  const W = wT + wO;
  const s = stage(W + 2 * m, H + 2 * m + 26);
  const x0 = m;
  const y0 = m;
  s.appendChild(svgEl('rect', { x: x0, y: y0, width: wT, height: H, fill: 'rgba(46,230,255,0.22)', stroke: TENS, 'stroke-width': 2 }));
  s.appendChild(label(x0 + wT / 2, y0 + H / 2, `${tens}×${b}=${tens * b}`, { 'font-size': 16, fill: '#fff' }));
  s.appendChild(svgEl('rect', { x: x0 + wT, y: y0, width: wO, height: H, fill: 'rgba(255,210,63,0.22)', stroke: ONES, 'stroke-width': 2 }));
  s.appendChild(label(x0 + wT + wO / 2, y0 + H / 2, `${ones}×${b}=${ones * b}`, { 'font-size': 14, fill: '#fff' }));
  s.appendChild(label(x0 + wT / 2, y0 - 16, String(tens), { 'font-size': 14, fill: TENS }));
  s.appendChild(label(x0 + wT + wO / 2, y0 - 16, String(ones), { 'font-size': 14, fill: ONES }));
  s.appendChild(label(x0 - 20, y0 + H / 2, String(b), { 'font-size': 14, fill: '#b9a8e6' }));
  s.appendChild(label((W + 2 * m) / 2, y0 + H + 22, `${tens * b} + ${ones * b} = ${a * b}`, { 'font-size': 17, fill: '#9bff5b' }));
  return s;
}

// Standard algorithm: `a` (1–2 digit) × `b` (1 digit), step-by-step.
function renderStandard(p: TutProblem): HTMLElement {
  const { a, b } = p;
  const onesA = a % 10;
  const tensA = Math.floor(a / 10);
  const onesProd = onesA * b;
  const carry = Math.floor(onesProd / 10);
  const onesDigit = onesProd % 10;
  const tensProd = tensA * b + carry;
  const step = tut.step;

  const grid = document.createElement('div');
  grid.className = 'tut-standard';
  const cell = (txt: string, cls = ''): HTMLElement => {
    const d = document.createElement('span');
    d.className = 'tut-cell' + (cls ? ' ' + cls : '');
    d.textContent = txt;
    return d;
  };

  grid.append(cell(''), cell(step >= 1 && carry ? String(carry) : '', 'carry'), cell(''));
  grid.append(cell(''), cell(tensA ? String(tensA) : '', step === 2 ? 'hl' : ''), cell(String(onesA), step === 1 ? 'hl' : ''));
  grid.append(cell('×', 'op'), cell(''), cell(String(b), step >= 1 ? 'hl' : ''));
  const rule = document.createElement('div');
  rule.className = 'tut-rule';
  grid.appendChild(rule);
  grid.append(cell(''), cell(step >= 2 && tensProd ? String(tensProd) : '', 'ans'), cell(step >= 1 ? String(onesDigit) : '', 'ans'));
  return grid;
}

/* ---------- captions ---------- */

function caption(): string {
  const { a, b } = tut.problem;
  if (tut.method === 'groups') {
    const shown = Math.min(tut.reveal, b);
    return shown < b
      ? `${shown} group${shown > 1 ? 's' : ''} of ${a} = ${shown * a}. 👆 Tap to add another group!`
      : `${b} equal group${b > 1 ? 's' : ''} of ${a} = ${a * b}. (Tap to start over.)`;
  }
  if (tut.method === 'array') {
    const shown = Math.min(tut.reveal, b);
    if (shown < b) return `${shown} row${shown > 1 ? 's' : ''} of ${a} = ${shown * a}. 👆 Tap to add a row!`;
    return a >= 10
      ? `${a} × ${b} = ${a * b}. Blue is 10 × ${b}, yellow is ${a - 10} × ${b}. (Tap to restart.)`
      : `${a} × ${b} = ${a * b}. (Tap to restart.)`;
  }
  if (tut.method === 'area') {
    const tens = Math.floor(a / 10) * 10;
    const ones = a % 10;
    return tens && ones
      ? `Break ${a} into ${tens} + ${ones}. Multiply each part by ${b}, then add: ${tens * b} + ${ones * b} = ${a * b}.`
      : `${a === 8 ? 'An' : 'A'} ${a}-by-${b} rectangle. ${a} × ${b} = ${a * b}.`;
  }
  // standard
  const onesA = a % 10;
  const tensA = Math.floor(a / 10);
  const onesProd = onesA * b;
  const carry = Math.floor(onesProd / 10);
  const tensProd = tensA * b + carry;
  switch (tut.step) {
    case 0:
      return 'The way you probably learned it. Start with the ones — tap “Next step”.';
    case 1:
      return `${b} × ${onesA} = ${onesProd}. Write ${onesProd % 10}${carry ? `, carry the ${carry}.` : '.'}`;
    case 2:
      return tensA
        ? `${b} × ${tensA} ten = ${tensA * b * 10}${carry ? `, plus the carried ${carry} ten = ${tensProd * 10}` : ''}. Write ${tensProd}.`
        : `Nothing left to multiply. The answer is ${a * b}.`;
    default:
      return `${a} × ${b} = ${a * b}. The ${onesProd}${tensA ? ` and ${tensA * b * 10}` : ''} ${tensA ? 'are' : 'is'} the same part${tensA ? 's' : ''} as the area model! 🎉`;
  }
}

/* ---------- screen render ---------- */

function render(): void {
  const { a, b } = tut.problem;
  $('tutProblem').textContent = `${a} × ${b}`;

  document.querySelectorAll<HTMLElement>('#tutMethods .tut-tab').forEach((t) =>
    t.classList.toggle('on', t.dataset.method === tut.method),
  );
  const presetIdx = PRESETS.findIndex((p) => p.a === a && p.b === b);
  document.querySelectorAll<HTMLElement>('#tutPresets .tut-chip').forEach((c) =>
    c.classList.toggle('on', c.dataset.idx === String(presetIdx)),
  );

  const stageEl = $('tutStage');
  const controls = $('tutControls');
  stageEl.innerHTML = '';
  controls.innerHTML = '';
  const interactive = tut.method === 'groups' || tut.method === 'array';
  stageEl.classList.toggle('interactive', interactive);

  if (tut.method === 'groups') stageEl.appendChild(renderGroups(tut.problem));
  else if (tut.method === 'array') stageEl.appendChild(renderArray(tut.problem));
  else if (tut.method === 'area') stageEl.appendChild(renderArea(tut.problem));
  else {
    stageEl.appendChild(renderStandard(tut.problem));
    const next = document.createElement('button');
    next.className = 'btn btn-cyan tut-next';
    next.textContent = tut.step >= 3 ? '↺ Again' : 'Next step →';
    next.addEventListener('click', () => {
      tut.step = tut.step >= 3 ? 0 : tut.step + 1;
      render();
    });
    controls.appendChild(next);
  }

  $('tutCaption').textContent = caption();
}

/* ---------- public API ---------- */

export function initTutorial(): void {
  const presets = $('tutPresets');
  PRESETS.forEach((p, i) => {
    const chip = document.createElement('button');
    chip.className = 'tut-chip';
    chip.dataset.idx = String(i);
    chip.textContent = `${p.a}×${p.b}`;
    chip.addEventListener('click', () => {
      tut.problem = norm(p);
      tut.step = 0;
      tut.reveal = 1;
      render();
    });
    presets.appendChild(chip);
  });

  $('tutMethods').addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('.tut-tab');
    if (!tab || !tab.dataset.method) return;
    tut.method = tab.dataset.method as Method;
    tut.step = 0;
    tut.reveal = 1;
    render();
  });

  // tap-to-build for groups / array
  $('tutStage').addEventListener('click', () => {
    if (tut.method !== 'groups' && tut.method !== 'array') return;
    tut.reveal = tut.reveal < tut.problem.b ? tut.reveal + 1 : 1;
    render();
  });
}

/** Open the Learn screen, optionally on a specific fact (e.g. from the game). */
export function openTutorial(problem?: TutProblem): void {
  if (problem) tut.problem = norm(problem);
  tut.method = 'groups';
  tut.step = 0;
  tut.reveal = 1;
  render();
  setScreen('tutorial');
}
