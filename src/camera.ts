import { store } from './state';
import { viewW, viewH } from './canvas';
import { T } from './constants';

export function updateCamera(): void {
  const G = store.G!;
  const p = G.player;
  const vw = viewW(), vh = viewH();
  const mapPxW = G.map[0].length * T, mapPxH = G.map.length * T;
  let cx = p.x + p.w / 2 - vw / 2;
  let cy = p.y + p.h / 2 - vh / 2;
  cx = Math.max(0, Math.min(mapPxW - vw, cx));
  cy = Math.max(0, Math.min(mapPxH - vh, cy));
  G.cam.x += (cx - G.cam.x) * 0.12;
  G.cam.y += (cy - G.cam.y) * 0.12;
}
