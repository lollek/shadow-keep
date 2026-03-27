import { store } from './state';
import { viewW, viewH } from './canvas';

export function updateCamera(): void {
  const G = store.G!;
  const p = G.player;
  const vw = viewW(), vh = viewH();
  const mapPxW = G.map[0].length * 24, mapPxH = G.map.length * 24;
  let cx = p.x + p.w / 2 - vw / 2;
  let cy = p.y + p.h / 2 - vh / 2;
  cx = Math.max(0, Math.min(mapPxW - vw, cx));
  cy = Math.max(0, Math.min(mapPxH - vh, cy));
  G.cam.x += (cx - G.cam.x) * 0.12;
  G.cam.y += (cy - G.cam.y) * 0.12;
}
