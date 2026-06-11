import { describe, it, expect } from 'vitest';
import { practiceSummary, validateDraft } from '../src/settings-logic';
import { DEFAULTS } from '../src/config';
import type { Settings } from '../src/types';

function settings(overrides: Partial<Settings>): Settings {
  return { ...DEFAULTS, ...overrides };
}

describe('validateDraft', () => {
  it('accepts a valid draft', () => {
    expect(validateDraft(settings({ ops: ['mul'], facts: [2, 5] }))).toBeNull();
  });

  it('requires at least one operation', () => {
    expect(validateDraft(settings({ ops: [], facts: [2] }))).toMatch(/at least one thing/i);
  });

  it('requires at least one number family', () => {
    expect(validateDraft(settings({ ops: ['mul'], facts: [] }))).toMatch(/number family/i);
  });

  it('rejects division when every family is 0', () => {
    expect(validateDraft(settings({ ops: ['div'], facts: [0] }))).toMatch(/division/i);
  });

  it('allows division when a non-zero family is present', () => {
    expect(validateDraft(settings({ ops: ['div'], facts: [0, 3] }))).toBeNull();
  });
});

describe('practiceSummary', () => {
  it('summarises a single operation', () => {
    const text = practiceSummary(settings({ ops: ['mul'], facts: [5, 2, 10], topMax: 12, duration: 60 }));
    expect(text).toContain('×');
    expect(text).toContain('families 2, 5, 10'); // sorted
    expect(text).toContain('up to 12');
    expect(text).toContain('60s');
  });

  it('says "everything" when all four ops are selected', () => {
    const text = practiceSummary(settings({ ops: ['mul', 'div', 'add', 'sub'] }));
    expect(text).toContain('everything');
  });
});
