import { state } from '../state';
import { $ } from '../dom';

/** Circumference of the timer ring (r = 52), used to drive the dash offset. */
const CIRC = 2 * Math.PI * 52;

export function renderHud(): void {
  $('scoreVal').textContent = String(state.score);
  $('streakVal').textContent = '🔥' + state.streak;
  $('streakStat').classList.toggle('cold', state.streak === 0);
}

/** Update the countdown ring + number from the time remaining. */
export function renderTimer(remainMs: number, duration: number): void {
  const secs = Math.ceil(remainMs / 1000);
  const frac = remainMs / (duration * 1000);
  $('timerNum').textContent = String(secs);
  $('timerProg').style.strokeDashoffset = String(CIRC * (1 - frac));
  $('timer').classList.toggle('warn', secs <= 5 && secs > 0);
}
