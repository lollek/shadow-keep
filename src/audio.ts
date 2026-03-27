import type { SoundType } from './types';

let _ac: AudioContext | null = null;

function getAC(): AudioContext {
  if (!_ac) _ac = new (window.AudioContext || (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return _ac;
}

export function snd(type: SoundType): void {
  try {
    const a = getAC();
    const t = a.currentTime;

    const tone = (f1: number, f2: number | null, d: number, v: number, w: OscillatorType = 'square') => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.connect(g); g.connect(a.destination);
      o.type = w;
      o.frequency.setValueAtTime(f1, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.start(t); o.stop(t + d);
    };

    const chord = (fs: number[], d: number, v: number) =>
      fs.forEach((f, i) => {
        const o = a.createOscillator();
        const g = a.createGain();
        o.connect(g); g.connect(a.destination);
        o.type = 'sine'; o.frequency.value = f;
        const st = t + i * 0.1;
        g.gain.setValueAtTime(v, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + d);
        o.start(st); o.stop(st + d);
      });

    const sounds: Record<SoundType, () => void> = {
      melee:   () => tone(200, 70, 0.1, 0.18),
      shoot:   () => tone(440, 220, 0.06, 0.07, 'sawtooth'),
      hit:     () => tone(220, 80, 0.08, 0.13),
      hurt:    () => tone(110, 55, 0.13, 0.2),
      die:     () => tone(280, 50, 0.3, 0.12, 'sawtooth'),
      clear:   () => chord([523, 659, 784], 0.25, 0.11),
      loot:    () => chord([660, 880], 0.2, 0.09),
      boss:    () => tone(55, 28, 0.55, 0.28, 'sawtooth'),
      explode: () => tone(150, 40, 0.22, 0.18, 'sawtooth'),
      buy:     () => chord([440, 550, 660], 0.15, 0.08),
      town:    () => chord([330, 440, 550, 660], 0.3, 0.07),
      exit:    () => chord([523, 659, 784, 1047], 0.4, 0.1),
    };

    sounds[type]();
  } catch (_) { /* audio not available */ }
}
