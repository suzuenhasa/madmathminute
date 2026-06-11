import { $ } from '../dom';

/** Show the "How to Play" modal and move focus into it. */
export function openHow(): void {
  const modal = $('howModal');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  $('howGotIt').focus();
}

/** Hide the modal and return focus to the button that opened it. */
export function closeHow(): void {
  const modal = $('howModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  $('howBtn').focus();
}

/** Whether the modal is currently open. */
export function howIsOpen(): boolean {
  return $('howModal').classList.contains('show');
}
