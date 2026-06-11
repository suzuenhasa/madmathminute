import { $ } from '../dom';
import { setScreen } from './router';

/**
 * Tutorial (Learn) screen — PROTOTYPE.
 *
 * Shows ONE multiplication problem four ways so the learner can connect the
 * school-curriculum models to the familiar "carry the 1" algorithm:
 *   groups → array → area model → standard algorithm.
 * Place value is colour-coded consistently (tens = cyan, ones = yellow) so the
 * same parts are recognisable across every representation.
 *
 * Scoped to 2-digit × 1-digit so all four methods stay meaningful and the
 * standard algorithm shows exactly one carry. Numbers are parameters, so this
 * generalises later.
 */

type Method = 'groups' | 'array' | 'area' | 'standard';
interface TutProblem {
  a: number; // 2-digit factor
  b: number; // 1-digit factor
}

const PRESETS: TutProblem[] = [
  { a: 13, b: 4 },
  { a: 12, b: 3 },
  { a: 21, b: 3 },
  { a: 24, b: 2 },
];

const TENS = '#2ee6ff'; // cyan
const ONES = '#ffd23f'; // yellow

const tut = { problem: PRESETS[0], method: 'groups' as Method, step: 0 };

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
  s.style.maxHeight = '44vh';
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

function renderGroups(p: TutProblem): SVGSVGElement {
  const { a, b } = p;
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
    s.appendChild(svgEl('rect', {
      x: gx, y: gy, width: groupW, height: groupH, rx: 14,
      fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(150,110,255,0.32)',
    }));
    for (let i = 0; i < a; i++) {
      const c = i % perRow;
      const row = Math.floor(i / perRow);
      s.appendChild(svgEl('circle', {
        cx: gx + 8 + c * cellW + r,
        cy: gy + 8 + row * cellW + r,
        r,
        fill: TENS,
      }));
    }
    s.appendChild(label(gx + groupW / 2, gy + groupH + 14, String(a), { 'font-size': 15, fill: '#b9a8e6' }));
  }
  return s;
}

function renderArray(p: TutProblem): SVGSVGElement {
  const { a, b } = p;
  const r = 7;
  const gap = 5;
  const cell = r * 2 + gap;
  const m = 16;
  const W = a * cell + 2 * m;
  const H = b * cell + 2 * m;
  const s = stage(W, H);
  for (let row = 0; row < b; row++) {
    for (let col = 0; col < a; col++) {
      s.appendChild(svgEl('circle', {
        cx: m + col * cell + r,
        cy: m + row * cell + r,
        r,
        fill: col < 10 ? TENS : ONES,
      }));
    }
  }
  return s;
}

function renderArea(p: TutProblem): SVGSVGElement {
  const { a, b } = p;
  const tens = 10;
  const ones = a - 10;
  const unitW = 15;
  const unitH = 24;
  const wT = tens * unitW;
  const wO = ones * unitW;
  const H = b * unitH;
  const m = 42;
  const W = wT + wO;
  const s = stage(W + 2 * m, H + 2 * m + 26);
  const x0 = m;
  const y0 = m;

  s.appendChild(svgEl('rect', { x: x0, y: y0, width: wT, height: H, fill: 'rgba(46,230,255,0.22)', stroke: TENS, 'stroke-width': 2 }));
  s.appendChild(label(x0 + wT / 2, y0 + H / 2, `${tens}×${b}=${tens * b}`, { 'font-size': 17, fill: '#fff' }));

  s.appendChild(svgEl('rect', { x: x0 + wT, y: y0, width: wO, height: H, fill: 'rgba(255,210,63,0.22)', stroke: ONES, 'stroke-width': 2 }));
  s.appendChild(label(x0 + wT + wO / 2, y0 + H / 2, `${ones}×${b}=${ones * b}`, { 'font-size': 15, fill: '#fff' }));

  s.appendChild(label(x0 + wT / 2, y0 - 16, String(tens), { 'font-size': 15, fill: TENS }));
  s.appendChild(label(x0 + wT + wO / 2, y0 - 16, String(ones), { 'font-size': 15, fill: ONES }));
  s.appendChild(label(x0 - 20, y0 + H / 2, String(b), { 'font-size': 15, fill: '#b9a8e6' }));

  s.appendChild(label((W + 2 * m) / 2, y0 + H + 22, `${tens * b} + ${ones * b} = ${a * b}`, { 'font-size': 18, fill: '#9bff5b' }));
  return s;
}

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

  // carry row
  grid.append(cell(''), cell(step >= 1 && carry ? String(carry) : '', 'carry'), cell(''));
  // factor a
  grid.append(cell(''), cell(String(tensA), step === 2 ? 'hl' : ''), cell(String(onesA), step === 1 ? 'hl' : ''));
  // × b
  grid.append(cell('×', 'op'), cell(''), cell(String(b), step >= 1 ? 'hl' : ''));
  // rule
  const rule = document.createElement('div');
  rule.className = 'tut-rule';
  grid.appendChild(rule);
  // answer
  grid.append(cell(''), cell(step >= 2 ? String(tensProd) : '', 'ans'), cell(step >= 1 ? String(onesDigit) : '', 'ans'));

  return grid;
}

function standardCaption(p: TutProblem, step: number): string {
  const { a, b } = p;
  const onesA = a % 10;
  const tensA = Math.floor(a / 10);
  const onesProd = onesA * b;
  const carry = Math.floor(onesProd / 10);
  const tensProd = tensA * b + carry;
  switch (step) {
    case 0:
      return 'The way you probably learned it. Start with the ones — tap “Next step”.';
    case 1:
      return `${b} × ${onesA} = ${onesProd}. Write ${onesProd % 10}${carry ? `, carry the ${carry}.` : '.'}`;
    case 2:
      return `${b} × ${tensA} ten = ${tensA * b * 10}${carry ? `, plus the carried ${carry} ten = ${tensProd * 10}` : ''}. Write ${tensProd}.`;
    default:
      return `${a} × ${b} = ${a * b}. The ${onesProd} and ${tensA * b * 10} are the same parts as the area model! 🎉`;
  }
}

/* ---------- screen render ---------- */

function render(): void {
  const { a, b } = tut.problem;
  $('tutProblem').textContent = `${a} × ${b}`;

  document.querySelectorAll<HTMLElement>('#tutMethods .tut-tab').forEach((t) =>
    t.classList.toggle('on', t.dataset.method === tut.method),
  );
  document.querySelectorAll<HTMLElement>('#tutPresets .tut-chip').forEach((c) =>
    c.classList.toggle('on', c.dataset.idx === String(PRESETS.indexOf(tut.problem))),
  );

  const stageEl = $('tutStage');
  const controls = $('tutControls');
  stageEl.innerHTML = '';
  controls.innerHTML = '';
  let caption = '';

  if (tut.method === 'groups') {
    stageEl.appendChild(renderGroups(tut.problem));
    caption = `${b} equal groups of ${a}. That's ${Array(b).fill(a).join(' + ')} = ${a * b}.`;
  } else if (tut.method === 'array') {
    stageEl.appendChild(renderArray(tut.problem));
    caption = `${a} in each row, ${b} rows. Blue is 10 × ${b}, yellow is ${a - 10} × ${b}.`;
  } else if (tut.method === 'area') {
    stageEl.appendChild(renderArea(tut.problem));
    caption = `Break ${a} into 10 + ${a - 10}. Multiply each part by ${b}, then add: ${10 * b} + ${(a - 10) * b} = ${a * b}.`;
  } else {
    stageEl.appendChild(renderStandard(tut.problem));
    caption = standardCaption(tut.problem, tut.step);
    const next = document.createElement('button');
    next.className = 'btn btn-cyan tut-next';
    next.textContent = tut.step >= 3 ? '↺ Again' : 'Next step →';
    next.addEventListener('click', () => {
      tut.step = tut.step >= 3 ? 0 : tut.step + 1;
      render();
    });
    controls.appendChild(next);
  }

  $('tutCaption').textContent = caption;
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
      tut.problem = PRESETS[i];
      tut.step = 0;
      render();
    });
    presets.appendChild(chip);
  });

  $('tutMethods').addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('.tut-tab');
    if (!tab || !tab.dataset.method) return;
    tut.method = tab.dataset.method as Method;
    tut.step = 0;
    render();
  });
}

export function openTutorial(): void {
  tut.step = 0;
  render();
  setScreen('tutorial');
}
