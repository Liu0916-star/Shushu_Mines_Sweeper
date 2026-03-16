import { useRef, useCallback } from 'react';

// 用 Web Audio API 合成音效，无需外部文件
function createAudioContext() {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(ctx, { frequency = 440, type = 'sine', duration = 0.1, volume = 0.3, delay = 0 }) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

const SOUND_PACKS = {
  cute: {
    name: '可爱',
    click: (ctx) => playTone(ctx, { frequency: 880, type: 'sine', duration: 0.08, volume: 0.25 }),
    flag: (ctx) => {
      playTone(ctx, { frequency: 660, type: 'sine', duration: 0.06, volume: 0.2 });
      playTone(ctx, { frequency: 880, type: 'sine', duration: 0.06, volume: 0.2, delay: 0.06 });
    },
    win: (ctx) => {
      [523, 659, 784, 1047].forEach((f, i) =>
        playTone(ctx, { frequency: f, type: 'sine', duration: 0.18, volume: 0.3, delay: i * 0.12 })
      );
    },
    lose: (ctx) => {
      playTone(ctx, { frequency: 300, type: 'sawtooth', duration: 0.3, volume: 0.2 });
      playTone(ctx, { frequency: 200, type: 'sawtooth', duration: 0.4, volume: 0.2, delay: 0.2 });
    },
    combo: (ctx, count) => {
      const base = 440 + count * 60;
      playTone(ctx, { frequency: base, type: 'sine', duration: 0.1, volume: 0.35 });
      playTone(ctx, { frequency: base * 1.25, type: 'sine', duration: 0.1, volume: 0.3, delay: 0.08 });
    },
  },
  retro: {
    name: '复古',
    click: (ctx) => playTone(ctx, { frequency: 220, type: 'square', duration: 0.05, volume: 0.2 }),
    flag: (ctx) => playTone(ctx, { frequency: 330, type: 'square', duration: 0.08, volume: 0.2 }),
    win: (ctx) => {
      [262, 330, 392, 523, 659].forEach((f, i) =>
        playTone(ctx, { frequency: f, type: 'square', duration: 0.12, volume: 0.25, delay: i * 0.1 })
      );
    },
    lose: (ctx) => {
      [220, 196, 165, 147].forEach((f, i) =>
        playTone(ctx, { frequency: f, type: 'square', duration: 0.15, volume: 0.25, delay: i * 0.1 })
      );
    },
    combo: (ctx, count) => {
      const f = 165 + count * 33;
      playTone(ctx, { frequency: f, type: 'square', duration: 0.08, volume: 0.3 });
    },
  },
  soft: {
    name: '轻柔',
    click: (ctx) => playTone(ctx, { frequency: 600, type: 'triangle', duration: 0.12, volume: 0.18 }),
    flag: (ctx) => {
      playTone(ctx, { frequency: 500, type: 'triangle', duration: 0.1, volume: 0.15 });
      playTone(ctx, { frequency: 700, type: 'triangle', duration: 0.1, volume: 0.15, delay: 0.08 });
    },
    win: (ctx) => {
      [400, 500, 600, 800, 1000].forEach((f, i) =>
        playTone(ctx, { frequency: f, type: 'triangle', duration: 0.2, volume: 0.2, delay: i * 0.1 })
      );
    },
    lose: (ctx) => playTone(ctx, { frequency: 250, type: 'triangle', duration: 0.5, volume: 0.15 }),
    combo: (ctx, count) => {
      playTone(ctx, { frequency: 500 + count * 80, type: 'triangle', duration: 0.15, volume: 0.25 });
    },
  },
};

export { SOUND_PACKS };

export default function useSound(soundPack = 'cute', enabled = true) {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, [enabled]);

  const pack = SOUND_PACKS[soundPack] || SOUND_PACKS.cute;

  return {
    playClick: useCallback(() => pack.click(getCtx()), [pack, getCtx]),
    playFlag: useCallback(() => pack.flag(getCtx()), [pack, getCtx]),
    playWin: useCallback(() => pack.win(getCtx()), [pack, getCtx]),
    playLose: useCallback(() => pack.lose(getCtx()), [pack, getCtx]),
    playCombo: useCallback((count) => pack.combo(getCtx(), count), [pack, getCtx]),
  };
}