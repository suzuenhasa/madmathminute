import type { Problem, Settings } from './types';

/** Inclusive random integer in [min, max]. */
export const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Random element of a non-empty array. */
export const choice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Build one problem from the current settings.
 *
 * Mirrors the original `mad_minute_generator.py`:
 *  - mul/add: `top` is a random number in range, `bottom` a chosen fact.
 *  - div: builds a clean division by multiplying a fact (the divisor) by a
 *    random quotient, so it always divides evenly and never by zero.
 *  - sub: never goes negative unless `allowNegSub` is set.
 */
export function makeProblem(s: Settings): Problem {
  const op = choice(s.ops);
  const facts = s.facts;
  const { topMin, topMax, allowNegSub } = s;

  if (op === 'mul') {
    const top = randInt(topMin, topMax);
    const bottom = choice(facts);
    return { top, op, bottom, answer: top * bottom };
  }

  if (op === 'div') {
    const divisors = facts.filter((f) => f !== 0);
    const bottom = choice(divisors.length ? divisors : [1]);
    const q = randInt(topMin, topMax);
    return { top: bottom * q, op, bottom, answer: q };
  }

  if (op === 'add') {
    const top = randInt(topMin, topMax);
    const bottom = choice(facts);
    return { top, op, bottom, answer: top + bottom };
  }

  // sub — never negative unless allowed (mirrors the original script).
  const bottom = choice(facts);
  let top: number;
  if (allowNegSub) {
    top = randInt(topMin, topMax);
  } else {
    const low = Math.max(topMin, bottom);
    const high = Math.max(topMax, low);
    top = randInt(low, high);
  }
  return { top, op, bottom, answer: top - bottom };
}
