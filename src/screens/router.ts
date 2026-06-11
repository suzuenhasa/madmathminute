import type { ScreenName } from '../types';
import { state } from '../state';
import { $ } from '../dom';

const SCREEN_IDS: ScreenName[] = ['home', 'game', 'results', 'settings'];

/** Show one screen and hide the rest. */
export function setScreen(name: ScreenName): void {
  state.screen = name;
  SCREEN_IDS.forEach((id) => $(id).classList.remove('active'));
  $(name).classList.add('active');
}
