/** The four arithmetic operations the game can drill. */
export type OpKey = 'mul' | 'div' | 'add' | 'sub';

/** Display metadata for an operation. */
export interface OpInfo {
  sym: string;
  name: string;
}

/** Everything the player can configure in the Practice screen. */
export interface Settings {
  ops: OpKey[];
  facts: number[];
  topMin: number;
  topMax: number;
  duration: number;
  sound: boolean;
  allowNegSub: boolean;
}

/** A single generated math problem and its answer. */
export interface Problem {
  top: number;
  op: OpKey;
  bottom: number;
  answer: number;
}

/** End-of-game rank shown on the results screen. */
export interface Rank {
  name: string;
  stars: number;
}

/** The full-screen views the app switches between. */
export type ScreenName = 'home' | 'game' | 'results' | 'settings' | 'tutorial';
