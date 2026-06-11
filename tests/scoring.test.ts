import { describe, it, expect } from 'vitest';
import { comboMult, rankFor, COMBO_CALLOUTS, POINTS_PER_CORRECT } from '../src/scoring';

describe('comboMult', () => {
  it('steps up at the streak thresholds', () => {
    expect(comboMult(0)).toBe(1);
    expect(comboMult(2)).toBe(1);
    expect(comboMult(3)).toBe(2);
    expect(comboMult(5)).toBe(2);
    expect(comboMult(6)).toBe(3);
    expect(comboMult(9)).toBe(3);
    expect(comboMult(10)).toBe(4);
    expect(comboMult(14)).toBe(4);
    expect(comboMult(15)).toBe(5);
    expect(comboMult(100)).toBe(5);
  });

  it('has a callout exactly at each new tier', () => {
    expect(Object.keys(COMBO_CALLOUTS).map(Number).sort((a, b) => a - b)).toEqual([3, 6, 10, 15]);
  });
});

describe('rankFor', () => {
  it('maps correct counts to the right rank + stars', () => {
    expect(rankFor(0)).toEqual({ name: 'Math Explorer', stars: 1 });
    expect(rankFor(9)).toEqual({ name: 'Math Explorer', stars: 1 });
    expect(rankFor(10)).toEqual({ name: 'Number Ninja', stars: 2 });
    expect(rankFor(17)).toEqual({ name: 'Number Ninja', stars: 2 });
    expect(rankFor(18)).toEqual({ name: 'Math Hero', stars: 3 });
    expect(rankFor(25)).toEqual({ name: 'Math Hero', stars: 3 });
    expect(rankFor(26)).toEqual({ name: 'Number Wizard', stars: 4 });
    expect(rankFor(34)).toEqual({ name: 'Number Wizard', stars: 4 });
    expect(rankFor(35)).toEqual({ name: 'MATH LEGEND', stars: 5 });
  });
});

describe('points', () => {
  it('awards base points × multiplier', () => {
    expect(POINTS_PER_CORRECT * comboMult(1)).toBe(10);
    expect(POINTS_PER_CORRECT * comboMult(3)).toBe(20);
    expect(POINTS_PER_CORRECT * comboMult(15)).toBe(50);
  });
});
