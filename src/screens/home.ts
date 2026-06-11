import { state } from '../state';
import { $ } from '../dom';
import { practiceSummary } from '../settings-logic';

export function renderHome(): void {
  if (state.best > 0) {
    $('bestTag').style.display = '';
    $('bestScore').textContent = String(state.best);
  } else {
    $('bestTag').style.display = 'none';
  }
  $('practiceSummary').textContent = practiceSummary(state.settings);
  syncSoundIcons();
}

export function syncSoundIcons(): void {
  const icon = state.settings.sound ? '🔊' : '🔇';
  $('soundBtn').textContent = icon;
  $('soundBtnHome').textContent = icon;
}
