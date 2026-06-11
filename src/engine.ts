import { state } from './state';
import { $ } from './dom';
import { OPS } from './config';
import { makeProblem } from './math';
import { comboMult, COMBO_CALLOUTS, rankFor, POINTS_PER_CORRECT } from './scoring';
import { sndCorrect, sndWrong, sndTick, sndCombo, sndFinish, sndKey, vibrate } from './audio';
import { renderHud, renderTimer } from './screens/hud';
import { setScreen } from './screens/router';
import { confetti } from './confetti';
import { saveBest } from './storage';

/* ---------- round lifecycle ---------- */

export function beginGame(): void {
  state.endTime = performance.now() + state.settings.duration * 1000;
  nextProblem();
  loop();
}

function nextProblem(): void {
  // Avoid repeating the exact same problem twice in a row (capped retries).
  let p = makeProblem(state.settings);
  let guard = 1;
  while (
    state.prev &&
    p.top === state.prev.top &&
    p.bottom === state.prev.bottom &&
    p.op === state.prev.op &&
    guard < 12
  ) {
    p = makeProblem(state.settings);
    guard++;
  }
  state.prev = p;
  state.current = p;
  state.input = '';
  renderProblem();
  renderInput();
}

function renderProblem(): void {
  const p = state.current;
  if (!p) return;
  $('problem').innerHTML =
    `<span>${p.top}</span><span class="op">${OPS[p.op].sym}</span><span>${p.bottom}</span><span>=</span>`;
}

function renderInput(): void {
  const box = $('answerBox');
  box.classList.remove('good', 'bad');
  if (state.input === '') {
    box.classList.add('empty');
    box.innerHTML = '?';
  } else {
    box.classList.remove('empty');
    box.innerHTML = state.input + '<span class="caret"></span>';
  }
}

/* ---------- input handling (auto-commit when the digit count matches) ---------- */

export function pressDigit(d: string): void {
  if (state.locked || state.screen !== 'game' || !state.current) return;
  const need = String(state.current.answer).length;
  if (state.input.length >= need) return;
  state.input += String(d);
  sndKey();
  vibrate(6);
  renderInput();
  if (state.input.length >= need) commit();
}

export function backspace(): void {
  if (state.locked || !state.input) return;
  state.input = state.input.slice(0, -1);
  sndKey();
  renderInput();
}

export function clearInput(): void {
  if (state.locked) return;
  state.input = '';
  sndKey();
  renderInput();
}

export function commit(): void {
  if (state.locked || state.input === '' || !state.current) return;
  const val = parseInt(state.input, 10);
  const box = $('answerBox');

  if (val === state.current.answer) {
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    const mult = comboMult(state.streak);
    const pts = POINTS_PER_CORRECT * mult;
    state.score += pts;
    state.correct++;
    sndCorrect();
    vibrate(12);
    floatPoints(pts, mult);
    flashGood();
    box.classList.add('good');
    maybeCombo(state.streak);
    renderHud();
    setTimeout(nextProblem, 90);
  } else {
    state.wrong++;
    state.streak = 0;
    sndWrong();
    vibrate([30, 40, 30]);
    box.classList.add('bad');
    const card = $('problemCard');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    const rev = $('reveal');
    rev.textContent = 'It was ' + state.current.answer;
    rev.classList.add('show');
    renderHud();
    state.locked = true;
    state.revealTimer = setTimeout(() => {
      rev.classList.remove('show');
      state.locked = false;
      nextProblem();
    }, 900);
  }
}

/* ---------- celebration effects ---------- */

function maybeCombo(streak: number): void {
  const text = COMBO_CALLOUTS[streak];
  if (!text) return;
  sndCombo();
  const el = document.createElement('div');
  el.className = 'combo-callout';
  el.textContent = text;
  $('game').appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function floatPoints(pts: number, mult: number): void {
  const el = document.createElement('div');
  el.className = 'float-pts';
  el.textContent = '+' + pts + (mult > 1 ? ' ×' + mult : '');
  if (mult >= 3) el.style.color = 'var(--yellow)';
  $('floatLayer').appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function flashGood(): void {
  const f = document.createElement('div');
  f.className = 'flash-good';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 400);
}

/* ---------- timer loop ---------- */

function loop(): void {
  const remainMs = Math.max(0, state.endTime - performance.now());
  const secs = Math.ceil(remainMs / 1000);
  renderTimer(remainMs, state.settings.duration);

  if (secs <= 10 && secs > 0 && secs !== state.lastTickSec) {
    sndTick();
    state.lastTickSec = secs;
  }

  if (remainMs <= 0) {
    endGame();
    return;
  }
  state.raf = requestAnimationFrame(loop);
}

/* ---------- end of game / results ---------- */

export function endGame(): void {
  if (state.raf) cancelAnimationFrame(state.raf);
  if (state.revealTimer) clearTimeout(state.revealTimer);
  state.locked = true;

  const attempts = state.correct + state.wrong;
  const acc = attempts ? Math.round((100 * state.correct) / attempts) : 0;
  const rank = rankFor(state.correct);
  const isBest = state.score > state.best;
  if (isBest) {
    state.best = state.score;
    saveBest(state.best);
  }

  $('finalScore').textContent = String(state.score);
  $('rCorrect').textContent = String(state.correct);
  $('rAcc').textContent = acc + '%';
  $('rStreak').textContent = String(state.bestStreak);
  $('rankName').textContent = rank.name;
  $('rankStars').textContent = '⭐'.repeat(rank.stars) + '☆'.repeat(5 - rank.stars);
  $('newBest').style.display = isBest && state.score > 0 ? '' : 'none';

  setScreen('results');
  sndFinish();
  confetti(isBest ? 220 : 130);
}
