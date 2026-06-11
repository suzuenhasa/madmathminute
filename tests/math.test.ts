import { describe, it, expect } from 'vitest';
import { randInt, choice, makeProblem } from '../src/math';
import { DEFAULTS } from '../src/config';
import type { Settings } from '../src/types';

const ITERATIONS = 2000;

function settings(overrides: Partial<Settings>): Settings {
  return { ...DEFAULTS, ...overrides };
}

describe('randInt', () => {
  it('stays within the inclusive range', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const n = randInt(2, 5);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(5);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it('returns the bound when min === max', () => {
    expect(randInt(7, 7)).toBe(7);
  });
});

describe('choice', () => {
  it('always returns an element of the array', () => {
    const arr = [1, 2, 3, 4];
    for (let i = 0; i < ITERATIONS; i++) {
      expect(arr).toContain(choice(arr));
    }
  });
});

describe('makeProblem — multiplication', () => {
  it('produces top×bottom with operands in range', () => {
    const s = settings({ ops: ['mul'], facts: [3, 4, 5], topMin: 0, topMax: 12 });
    for (let i = 0; i < ITERATIONS; i++) {
      const p = makeProblem(s);
      expect(p.op).toBe('mul');
      expect(p.answer).toBe(p.top * p.bottom);
      expect(p.top).toBeGreaterThanOrEqual(0);
      expect(p.top).toBeLessThanOrEqual(12);
      expect(s.facts).toContain(p.bottom);
    }
  });
});

describe('makeProblem — division', () => {
  it('always divides evenly, never by zero', () => {
    const s = settings({ ops: ['div'], facts: [0, 2, 5, 10], topMin: 1, topMax: 12 });
    for (let i = 0; i < ITERATIONS; i++) {
      const p = makeProblem(s);
      expect(p.op).toBe('div');
      expect(p.bottom).not.toBe(0);
      expect(p.top % p.bottom).toBe(0);
      expect(p.answer).toBe(p.top / p.bottom);
      expect(p.answer).toBeGreaterThanOrEqual(1);
      expect(p.answer).toBeLessThanOrEqual(12);
    }
  });

  it('falls back to a divisor of 1 when all facts are 0', () => {
    const s = settings({ ops: ['div'], facts: [0], topMin: 1, topMax: 9 });
    for (let i = 0; i < 200; i++) {
      const p = makeProblem(s);
      expect(p.bottom).toBe(1);
      expect(p.answer).toBe(p.top);
    }
  });
});

describe('makeProblem — addition', () => {
  it('produces top+bottom', () => {
    const s = settings({ ops: ['add'], facts: [1, 2, 3], topMin: 0, topMax: 10 });
    for (let i = 0; i < ITERATIONS; i++) {
      const p = makeProblem(s);
      expect(p.op).toBe('add');
      expect(p.answer).toBe(p.top + p.bottom);
    }
  });
});

describe('makeProblem — subtraction', () => {
  it('never goes negative when allowNegSub is false', () => {
    const s = settings({ ops: ['sub'], facts: [3, 7, 9], topMin: 0, topMax: 12, allowNegSub: false });
    for (let i = 0; i < ITERATIONS; i++) {
      const p = makeProblem(s);
      expect(p.op).toBe('sub');
      expect(p.answer).toBe(p.top - p.bottom);
      expect(p.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it('can go negative when allowNegSub is true', () => {
    const s = settings({ ops: ['sub'], facts: [12], topMin: 0, topMax: 3, allowNegSub: true });
    let sawNegative = false;
    for (let i = 0; i < ITERATIONS; i++) {
      const p = makeProblem(s);
      expect(p.answer).toBe(p.top - p.bottom);
      if (p.answer < 0) sawNegative = true;
    }
    expect(sawNegative).toBe(true);
  });
});
