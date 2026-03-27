export const canvas = document.getElementById('c') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;

export function resize(): void {
  const W = Math.min(window.innerWidth - 4, 820);
  const H = Math.min(window.innerHeight - 4, 600);
  canvas.width = W;
  canvas.height = H;
  document.getElementById('wrap')!.style.width = W + 'px';
}

export function viewH(): number { return canvas.height - 62; }
export function viewW(): number { return canvas.width; }
