import type { SoundType } from './types';

let _ac: AudioContext | null = null;
let _musicGain: GainNode | null = null;
let _musicTimer: ReturnType<typeof setInterval> | null = null;
let _currentTheme = '';

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

// ---- Procedural background music ----

interface ThemeMusic {
  notes: number[];
  bass: number;
  tempo: number;  // ms per note
  wave: OscillatorType;
  vol: number;
}

const MUSIC: Record<string, ThemeMusic> = {
  Dungeon:      { notes: [220, 196, 165, 196, 220, 262, 247, 220], bass: 110, tempo: 600, wave: 'triangle', vol: 0.04 },
  Caverns:      { notes: [165, 196, 220, 196, 165, 147, 131, 147], bass: 82, tempo: 800, wave: 'sine', vol: 0.035 },
  Shrine:       { notes: [330, 392, 440, 523, 440, 392, 330, 294], bass: 165, tempo: 700, wave: 'sine', vol: 0.03 },
  'Shadow Keep': { notes: [147, 131, 110, 98, 110, 131, 147, 165], bass: 55, tempo: 500, wave: 'sawtooth', vol: 0.03 },
  Town:         { notes: [330, 392, 440, 494, 523, 494, 440, 392], bass: 165, tempo: 650, wave: 'triangle', vol: 0.03 },
};

export function startMusic(themeName: string): void {
  if (themeName === _currentTheme) return;
  stopMusic();
  _currentTheme = themeName;
  const m = MUSIC[themeName];
  if (!m) return;
  try {
    const a = getAC();
    if (a.state === 'suspended') void a.resume();
    _musicGain = a.createGain();
    _musicGain.gain.value = m.vol;
    _musicGain.connect(a.destination);

    let step = 0;
    const play = () => {
      if (!_musicGain) return;
      const t = a.currentTime;
      const freq = m.notes[step % m.notes.length];

      // Melody note
      const o = a.createOscillator();
      const g = a.createGain();
      o.connect(g); g.connect(_musicGain);
      o.type = m.wave;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + m.tempo / 1000 * 0.9);
      o.start(t); o.stop(t + m.tempo / 1000);

      // Bass drone (every 4th beat)
      if (step % 4 === 0) {
        const ob = a.createOscillator();
        const gb = a.createGain();
        ob.connect(gb); gb.connect(_musicGain);
        ob.type = 'sine';
        ob.frequency.setValueAtTime(m.bass, t);
        const dur = m.tempo / 1000 * 3.5;
        gb.gain.setValueAtTime(0.7, t);
        gb.gain.exponentialRampToValueAtTime(0.001, t + dur);
        ob.start(t); ob.stop(t + dur);
      }

      step++;
    };

    play();
    _musicTimer = setInterval(play, m.tempo);
  } catch (_) { /* audio not available */ }
}

export function stopMusic(): void {
  if (_musicTimer) { clearInterval(_musicTimer); _musicTimer = null; }
  if (_musicGain) {
    try { _musicGain.disconnect(); } catch (_) { /* */ }
    _musicGain = null;
  }
  _currentTheme = '';
}
