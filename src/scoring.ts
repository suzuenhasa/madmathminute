import type { Rank } from './types';

/** Base points awarded for a correct answer, before the combo multiplier. */
export const POINTS_PER_CORRECT = 10;

/** Streak length → score multiplier. */
export function comboMult(streak: number): number {
  if (streak >= 15) return 5;
  if (streak >= 10) return 4;
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}

/** Celebratory callouts shown exactly when a new multiplier tier is reached. */
export const COMBO_CALLOUTS: Record<number, string> = {
  3: 'COMBO ×2!',
  6: 'ON FIRE! ×3 🔥',
  10: 'UNSTOPPABLE! ×4',
  15: 'LEGENDARY! ×5 👑',
};

/** Number of correct answers → end-of-game rank. */
export function rankFor(correct: number): Rank {
  if (correct >= 35) return { name: 'MATH LEGEND', stars: 5 };
  if (correct >= 26) return { name: 'Number Wizard', stars: 4 };
  if (correct >= 18) return { name: 'Math Hero', stars: 3 };
  if (correct >= 10) return { name: 'Number Ninja', stars: 2 };
  return { name: 'Math Explorer', stars: 1 };
}
