import type { OpKey, OpInfo, Settings } from './types';

/** Symbols + human names for each operation. */
export const OPS: Record<OpKey, OpInfo> = {
  mul: { sym: '×', name: 'multiplication' },
  div: { sym: '÷', name: 'division' },
  add: { sym: '+', name: 'addition' },
  sub: { sym: '−', name: 'subtraction' },
};

/** Canonical operation order, used to keep `ops` arrays stable. */
export const ALL_OPS: OpKey[] = ['mul', 'div', 'add', 'sub'];

/** Settings applied on first run / when nothing is saved yet. */
export const DEFAULTS: Settings = {
  ops: ['mul'],
  facts: [1, 2, 5, 10],
  topMin: 0,
  topMax: 12,
  duration: 60,
  sound: true,
  allowNegSub: false,
};

/** Confetti palette. */
export const CONFETTI_COLORS = ['#ff2e93', '#2ee6ff', '#9bff5b', '#ffd23f', '#9b5cff', '#ff5cc8'];

/** localStorage keys. */
export const STORAGE_KEYS = {
  settings: 'mm_settings',
  best: 'mm_best',
} as const;
