import { sv } from './state';

const SK = 'dc5_save';

export function loadSv(): void {
  try {
    const s = localStorage.getItem(SK);
    if (s) Object.assign(sv, JSON.parse(s));
  } catch (_) { /* ignore */ }
}

export function writeSv(): void {
  try {
    localStorage.setItem(SK, JSON.stringify(sv));
  } catch (_) { /* ignore */ }
}
