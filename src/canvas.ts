import { UI_HEIGHT } from './constants';

export const canvas = document.getElementById('c') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;
export const RENDER_SCALE = 1.2;

export function resize(): void {
  const W = Math.min(window.innerWidth - 4, 820);
  const H = Math.min(window.innerHeight - 4, 600);
  canvas.width = W;
  canvas.height = H;
  document.getElementById('wrap')!.style.width = W + 'px';
}

export function viewH(): number { return (canvas.height - UI_HEIGHT) / RENDER_SCALE; }
export function viewW(): number { return canvas.width / RENDER_SCALE; }
