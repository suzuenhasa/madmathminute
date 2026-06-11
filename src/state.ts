import type { Problem, ScreenName, Settings } from './types';
import { loadSettings, loadBest } from './storage';

/** All mutable runtime state for the app, in one place. */
export interface GameState {
  screen: ScreenName;
  settings: Settings;
  best: number;
  /** Working copy of settings while the Practice screen is open. */
  draft: Settings | null;
  current: Problem | null;
  prev: Problem | null;
  input: string;
  score: number;
  correct: number;
  wrong: number;
  streak: number;
  bestStreak: number;
  /** Problems answered wrong this round (used to suggest a Learn lesson). */
  missed: Problem[];
  /** A multiplication fact to offer on the results screen, if any. */
  learnFact: { a: number; b: number } | null;
  endTime: number;
  raf: number | null;
  locked: boolean;
  revealTimer: ReturnType<typeof setTimeout> | null;
  lastTickSec: number;
}

export const state: GameState = {
  screen: 'home',
  settings: loadSettings(),
  best: loadBest(),
  draft: null,
  current: null,
  prev: null,
  input: '',
  score: 0,
  correct: 0,
  wrong: 0,
  streak: 0,
  bestStreak: 0,
  missed: [],
  learnFact: null,
  endTime: 0,
  raf: null,
  locked: false,
  revealTimer: null,
  lastTickSec: 999,
};

/** Reset per-round counters before a new game starts. */
export function resetRound(): void {
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.missed = [];
  state.learnFact = null;
  state.input = '';
  state.locked = false;
  state.current = null;
  state.prev = null;
  state.lastTickSec = 999;
  if (state.revealTimer) clearTimeout(state.revealTimer);
}
