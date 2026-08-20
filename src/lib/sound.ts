// Lightweight WebAudio sound effects - no audio files required.
// Generates a soft Telegram-style "pop" chime for incoming messages.

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function playMessageSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Two quick sine blips: 880Hz then 1318Hz, like a message pop
  [880, 1318].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t0 = now + i * 0.09;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.2);
  });
}
