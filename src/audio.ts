import { state } from './state';

/**
 * All sound effects are synthesised with the Web Audio API — no audio files to
 * load. Respects the `sound` setting and degrades gracefully where Web Audio or
 * vibration isn't available.
 */
let actx: AudioContext | null = null;

export function audio(): AudioContext | null {
  if (!actx) {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      actx = new Ctx();
    } catch {
      actx = null;
    }
  }
  if (actx && actx.state === 'suspended') actx.resume().catch(() => {});
  return actx;
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.2, when = 0): void {
  const a = audio();
  if (!a || !state.settings.sound) return;
  const t = a.currentTime + when;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.connect(g);
  g.connect(a.destination);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.03);
}

export const sndKey = (): void => tone(520, 0.05, 'triangle', 0.1);
export const sndCorrect = (): void => {
  tone(680, 0.09, 'triangle', 0.22);
  tone(1020, 0.13, 'triangle', 0.2, 0.07);
};
export const sndWrong = (): void => {
  tone(180, 0.16, 'square', 0.16);
  tone(120, 0.18, 'square', 0.14, 0.04);
};
export const sndTick = (): void => tone(1000, 0.04, 'square', 0.07);
export const sndCombo = (): void => {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, 'triangle', 0.18, i * 0.06));
};
export const sndFinish = (): void => {
  [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, 'triangle', 0.2, i * 0.09));
  tone(784, 0.5, 'sine', 0.16, 0.55);
};
export const sndCountTick = (): void => tone(440, 0.12, 'triangle', 0.2);
export const sndGo = (): void => {
  tone(880, 0.25, 'triangle', 0.25);
  tone(1175, 0.3, 'triangle', 0.2, 0.05);
};

export function vibrate(pattern: number | number[]): void {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
