/**
 * Typed `getElementById` that fails loudly. The app's markup is static and every
 * id used here is expected to exist; if one ever goes missing (a renamed element,
 * a typo, a stale index.html) this throws an obvious, self-describing error at the
 * call site instead of a cryptic "Cannot read properties of null" later on.
 */
export const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
};
