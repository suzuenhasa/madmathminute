import type { Settings } from './types';
import { OPS } from './config';

/** One-line human summary of what the player is practicing (shown on Home). */
export function practiceSummary(s: Settings): string {
  const opTxt = s.ops.length === 4 ? 'everything' : s.ops.map((o) => OPS[o].sym).join(' ');
  const facts = [...s.facts].sort((a, b) => a - b).join(', ');
  return `${opTxt}  ·  families ${facts}  ·  up to ${s.topMax}  ·  ${s.duration}s`;
}

/**
 * Validate a draft of settings before saving.
 * Returns an error message to show the user, or `null` if the draft is valid.
 */
export function validateDraft(d: Settings): string | null {
  if (!d.ops.length) return 'Pick at least one thing to practice 🙂';
  if (!d.facts.length) return 'Pick at least one number family 🔢';
  if (d.ops.includes('div') && !d.facts.some((f) => f !== 0)) {
    return 'Division needs a number family above 0';
  }
  return null;
}
