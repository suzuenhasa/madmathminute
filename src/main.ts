import './styles/index.css';

import type { OpKey, Settings } from './types';
import { state } from './state';
import { $ } from './dom';
import { ALL_OPS } from './config';
import { audio, sndKey } from './audio';
import { initConfetti } from './confetti';
import { setScreen } from './screens/router';
import { renderHome, syncSoundIcons } from './screens/home';
import { startCountdown } from './screens/countdown';
import { openHow, closeHow, howIsOpen } from './screens/how';
import { initTutorial, openTutorial } from './screens/tutorial';
import { openSettings, renderSettings } from './screens/settings';
import { validateDraft } from './settings-logic';
import { pressDigit, backspace, clearInput, commit } from './engine';
import { saveSettings } from './storage';

/* ---------- small glue actions ---------- */

function toggleSound(): void {
  state.settings.sound = !state.settings.sound;
  saveSettings(state.settings);
  syncSoundIcons();
  if (state.settings.sound) {
    audio();
    sndKey();
  }
}

function goSettings(): void {
  openSettings();
  setScreen('settings');
}

function goHome(): void {
  renderHome();
  setScreen('home');
}

function quitGame(): void {
  if (state.raf) cancelAnimationFrame(state.raf);
  if (state.revealTimer) clearTimeout(state.revealTimer);
  state.locked = true;
  goHome();
}

function play(): void {
  audio();
  startCountdown();
}

/* ---------- starfield ---------- */

function initStars(): void {
  const sky = $('stars');
  const n = 16;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.opacity = String(0.3 + Math.random() * 0.5);
    sky.appendChild(s);
  }
}

/* ---------- navigation + sound ---------- */

$('playBtn').addEventListener('click', play);
$('againBtn').addEventListener('click', play);
$('settingsBtn').addEventListener('click', goSettings);
$('resSettingsBtn').addEventListener('click', goSettings);
$('howBtn').addEventListener('click', openHow);
$('howClose').addEventListener('click', closeHow);
$('howGotIt').addEventListener('click', closeHow);
$('howModal').addEventListener('click', (e) => {
  // close when the dark backdrop (not the card) is clicked
  if (e.target === e.currentTarget) closeHow();
});
$('learnBtn').addEventListener('click', () => openTutorial());
$('tutQuit').addEventListener('click', goHome);
$('resLearnBtn').addEventListener('click', () => {
  if (state.learnFact) openTutorial(state.learnFact);
});
$('homeBtn').addEventListener('click', goHome);
$('quitBtn').addEventListener('click', quitGame);
$('soundBtn').addEventListener('click', toggleSound);
$('soundBtnHome').addEventListener('click', toggleSound);

/* ---------- keypad (touch) ---------- */

$('keypad').addEventListener('click', (e) => {
  const k = (e.target as HTMLElement).closest<HTMLElement>('.key');
  if (!k) return;
  if (k.dataset.d != null) pressDigit(k.dataset.d);
  else if (k.dataset.act === 'back') backspace();
  else if (k.dataset.act === 'clear') clearInput();
});

/* ---------- physical keyboard (bonus for laptops) ---------- */

addEventListener('keydown', (e) => {
  if (howIsOpen()) {
    if (e.key === 'Escape') closeHow();
    return;
  }
  if (state.screen !== 'game') return;
  if (e.key >= '0' && e.key <= '9') {
    pressDigit(e.key);
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    backspace();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (state.input) commit();
  } else if (e.key === 'Escape') {
    $('quitBtn').click();
  }
});

/* ---------- settings interactions ---------- */

$('opChips').addEventListener('click', (e) => {
  const c = (e.target as HTMLElement).closest<HTMLElement>('.chip');
  if (!c || !state.draft) return;
  const op = c.dataset.op as OpKey;
  const ops = new Set<OpKey>(state.draft.ops);
  if (ops.has(op)) ops.delete(op);
  else ops.add(op);
  state.draft.ops = ALL_OPS.filter((o) => ops.has(o));
  renderSettings();
});

$('factPresets').addEventListener('click', (e) => {
  const p = (e.target as HTMLElement).closest<HTMLElement>('.preset');
  if (!p || !state.draft || !p.dataset.preset) return;
  state.draft.facts = p.dataset.preset.split(',').map(Number);
  renderSettings();
});

$('diffSeg').addEventListener('click', (e) => {
  const c = (e.target as HTMLElement).closest<HTMLElement>('.chip');
  if (!c || !state.draft) return;
  state.draft.topMax = Number(c.dataset.max);
  renderSettings();
});

$('timeSeg').addEventListener('click', (e) => {
  const c = (e.target as HTMLElement).closest<HTMLElement>('.chip');
  if (!c || !state.draft) return;
  state.draft.duration = Number(c.dataset.time);
  renderSettings();
});

$('setCancel').addEventListener('click', goHome);

$('setSave').addEventListener('click', () => {
  const d = state.draft;
  if (!d) return;
  const err = validateDraft(d);
  if (err) {
    $('setWarn').textContent = err;
    return;
  }
  state.settings = JSON.parse(JSON.stringify(d)) as Settings;
  saveSettings(state.settings);
  goHome();
});

/* ---------- boot ---------- */

initConfetti();
initStars();
initTutorial();
renderHome();
