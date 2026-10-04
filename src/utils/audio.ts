// Web Audio API Synthesizer for high-performance, zero-latency chess sound effects
class SoundController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    // Check saved mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chess_sound_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('chess_sound_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  // Soft wooden move sound
  public playMove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // ignore audio error
    }
  }

  // Crisp, punchy capture sound
  public playCapture() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // Click transient
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(480, t);
      osc1.frequency.exponentialRampToValueAtTime(120, t + 0.06);
      gain1.gain.setValueAtTime(0.3, t);
      gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.07);

      // Thud
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(220, t + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(60, t + 0.14);
      gain2.gain.setValueAtTime(0.4, t + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.02);
      osc2.stop(t + 0.15);
    } catch {
      // ignore
    }
  }

  // Alert check sound (Two harmonic high bells)
  public playCheck() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      [
        { freq: 659.25, time: 0 },       // E5
        { freq: 880.00, time: 0.08 },    // A5
      ].forEach(({ freq, time }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + time);

        gain.gain.setValueAtTime(0.3, t + time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + time + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t + time);
        osc.stop(t + time + 0.26);
      });
    } catch {
      // ignore
    }
  }

  // Best Move found (Magical upward arpeggio with sparkle)
  public playBestMove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // C5, E5, G5, C6 joyful fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.06);

        gain.gain.setValueAtTime(0.25, t + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t + i * 0.06);
        osc.stop(t + i * 0.06 + 0.24);
      });
    } catch {
      // ignore
    }
  }

  // Victory fanfare
  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0, dur: 0.12 },
        { freq: 659.25, time: 0.12, dur: 0.12 },
        { freq: 783.99, time: 0.24, dur: 0.12 },
        { freq: 1046.50, time: 0.36, dur: 0.4 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + time);

        gain.gain.setValueAtTime(0.3, t + time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t + time);
        osc.stop(t + time + dur + 0.02);
      });
    } catch {
      // ignore
    }
  }

  // Blunder / illegal move sound
  public playBlunder() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.18);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.2);
    } catch {
      // ignore
    }
  }

  // Camera Shutter Click for Vision AI
  public playCameraShutter() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.04);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);

      // Second click (shutter close)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(900, t + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(150, t + 0.11);
      gain2.gain.setValueAtTime(0.3, t + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.07);
      osc2.stop(t + 0.13);
    } catch {
      // ignore
    }
  }

  // Magical sparkly chime for AI Puzzle Generator
  public playMagicChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const notes = [659.25, 880, 1046.5, 1318.5, 1760];
      const t = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.26);
      });
    } catch {
      // ignore
    }
  }

  // Flame / Daily Challenge Whoosh
  public playFlameWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.16);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch {
      // ignore
    }
  }

  // Majestic Bell / Fanfare for Endgame Trainer
  public playMajesticFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const chords = [523.25, 659.25, 783.99, 1046.5];
      const t = this.ctx.currentTime;
      chords.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.5);
      });
    } catch {
      // ignore
    }
  }

  // Fast triple tick for Opening Drill
  public playDrillTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [0, 0.05, 0.1].forEach((delay, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800 + idx * 200;
        gain.gain.setValueAtTime(0.2, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.05);
      });
    } catch {
      // ignore
    }
  }

  // Clean ping for Guess the Move
  public playTargetChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } catch {
      // ignore
    }
  }
}

export const soundFx = new SoundController();
