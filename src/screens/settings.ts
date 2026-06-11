import type { Settings } from '../types';
import { state } from '../state';
import { $ } from '../dom';

/** Open the Practice screen, working on a throwaway copy of the settings. */
export function openSettings(): void {
  state.draft = JSON.parse(JSON.stringify(state.settings)) as Settings;
  buildFactChips();
  renderSettings();
}

/** Build the 1–12 number-family chips once, wiring each to toggle the draft. */
function buildFactChips(): void {
  const wrap = $('factChips');
  wrap.innerHTML = '';
  for (let n = 1; n <= 12; n++) {
    const b = document.createElement('button');
    b.className = 'chip num';
    b.dataset.fact = String(n);
    b.textContent = String(n);
    b.addEventListener('click', () => {
      const d = state.draft;
      if (!d) return;
      const f = new Set(d.facts);
      if (f.has(n)) f.delete(n);
      else f.add(n);
      d.facts = [...f].sort((a, b) => a - b);
      renderSettings();
    });
    wrap.appendChild(b);
  }
}

/** Reflect the current draft onto every control's selected state. */
export function renderSettings(): void {
  const d = state.draft;
  if (!d) return;
  document
    .querySelectorAll<HTMLElement>('#opChips .chip')
    .forEach((c) => c.classList.toggle('on', d.ops.includes(c.dataset.op as Settings['ops'][number])));
  document
    .querySelectorAll<HTMLElement>('#factChips .chip')
    .forEach((c) => c.classList.toggle('on', d.facts.includes(Number(c.dataset.fact))));
  document
    .querySelectorAll<HTMLElement>('#diffSeg .chip')
    .forEach((c) => c.classList.toggle('on', Number(c.dataset.max) === d.topMax));
  document
    .querySelectorAll<HTMLElement>('#timeSeg .chip')
    .forEach((c) => c.classList.toggle('on', Number(c.dataset.time) === d.duration));
  $('setWarn').textContent = '';
}
