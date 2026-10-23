/**
 * Web Audio API synthesizer for retro futuristic arcade sound effects & background arpeggios.
 * Generates all audio procedurally — zero external audio dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.35;
  private musicInterval: number | null = null;
  private musicStep: number = 0;

  constructor() {
    // Read persisted audio preferences
    try {
      const storedMute = localStorage.getItem('brick_breaker_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
      const storedMusic = localStorage.getItem('brick_breaker_music_muted');
      if (storedMusic !== null) {
        this.isMusicMuted = storedMusic === 'true';
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('brick_breaker_muted', String(muted));
    } catch {}
    if (muted) {
      this.stopMusic();
    } else if (!this.isMusicMuted) {
      this.startMusic();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    try {
      localStorage.setItem('brick_breaker_music_muted', String(muted));
    } catch {}
    if (muted) {
      this.stopMusic();
    } else if (!this.isMuted) {
      this.startMusic();
    }
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMuted;
  }

  // SFX: UI Hover
  public playHover() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.04 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // SFX: UI Click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(1040, now + 0.1);

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // SFX: Paddle Bounce
  public playPaddleBounce(impactRatio: number = 0.5) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    const baseFreq = 220 + (impactRatio * 180);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // SFX: Brick Hit
  public playBrickHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // SFX: Brick Break
  public playBrickBreak(combo: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const pitchMultiplier = Math.min(1 + (combo - 1) * 0.08, 2.2);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(700 * pitchMultiplier, now + 0.12);

    gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // SFX: Explosive Brick Detonation
  public playExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // SFX: Laser Shoot
  public playLaser() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);

    gain.gain.setValueAtTime(0.16 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // SFX: Powerup Collect
  public playPowerUpCollect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + (i * 0.05);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.12 * this.sfxVolume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.1);
    });
  }

  // SFX: Ball Lost
  public playBallLost() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [400, 320, 240, 160];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + (i * 0.08);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.1);
    });
  }

  // SFX: Victory Jingle
  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 880, 1108.73];
    const delays = [0, 0.1, 0.2, 0.32, 0.45, 0.6];

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + delays[i];
      const duration = i === notes.length - 1 ? 0.45 : 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    });
  }

  // Procedural Synthwave BGM Loop
  public startMusic() {
    if (this.isMuted || this.isMusicMuted || this.musicInterval !== null) return;
    this.initCtx();
    if (!this.ctx) return;

    // Arpeggiator notes in key of A minor / D dorian
    const scale = [220, 261.63, 329.63, 392, 440, 523.25, 659.25, 523.25];
    const bassScale = [110, 110, 130.81, 146.83];

    this.musicInterval = window.setInterval(() => {
      if (this.isMuted || this.isMusicMuted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Lead Arp
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'triangle';
      leadOsc.frequency.setValueAtTime(scale[this.musicStep % scale.length], now);

      leadGain.gain.setValueAtTime(0.04 * this.musicVolume, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      leadOsc.connect(leadGain);
      leadGain.connect(this.ctx.destination);

      leadOsc.start(now);
      leadOsc.stop(now + 0.14);

      // Bass Pulse on every 2 beats
      if (this.musicStep % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        const bassNote = bassScale[Math.floor(this.musicStep / 4) % bassScale.length];
        bassOsc.frequency.setValueAtTime(bassNote, now);

        bassGain.gain.setValueAtTime(0.06 * this.musicVolume, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.28);
      }

      this.musicStep = (this.musicStep + 1) % 16;
    }, 180);
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundEngine();
