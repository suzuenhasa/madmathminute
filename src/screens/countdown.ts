import { $ } from '../dom';
import { setScreen } from './router';
import { resetRound } from '../state';
import { renderHud } from './hud';
import { sndCountTick, sndGo } from '../audio';
import { beginGame } from '../engine';

/** Run the 3-2-1-GO! overlay, then start the game. */
export function startCountdown(): void {
  setScreen('game');
  resetRound();
  renderHud();

  const cd = $('countdown');
  const num = $('cdNum');
  const ready = $('cdReady');
  cd.classList.add('show');

  const seq = ['3', '2', '1', 'GO!'];
  let i = 0;
  ready.textContent = 'Get ready…';

  const step = (): void => {
    num.textContent = seq[i];
    num.classList.remove('cd-pop');
    void num.offsetWidth; // force reflow so the animation restarts
    num.classList.add('cd-pop');
    if (seq[i] === 'GO!') {
      ready.textContent = '';
      sndGo();
    } else {
      sndCountTick();
    }
    i++;
    if (i < seq.length) {
      setTimeout(step, 750);
    } else {
      setTimeout(() => {
        cd.classList.remove('show');
        beginGame();
      }, 600);
    }
  };
  step();
}
