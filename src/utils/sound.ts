/**
 * Sound synthesis engine for Piket Malam: Lab RPL using Web Audio API
 * Features:
 * - Procedural Cyberpunk/Retro Synthwave Mystery Soundtrack (BGM)
 * - Flashlight click, Lensa Nalar resonance hum, BIP CRT blips,
 *   heartbeat pulses, and puzzle completion chimes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isSoundtrackEnabled: boolean = true;

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private lensHumGain: GainNode | null = null;
  private lensHumOsc: OscillatorNode | null = null;

  // Soundtrack Scheduler State
  private schedulerInterval: number | null = null;
  private nextStepTime: number = 0;
  private currentStep: number = 0;
  private isSoundtrackRunning: boolean = false;

  // Tempo config (112 BPM, 16th note steps)
  private readonly bpm: number = 112;
  private get stepDuration(): number {
    return 60 / this.bpm / 4; // ~0.1339s per 16th note
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Bus (Full, rich clarity)
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // BGM Bus (Louder, atmospheric presence: boosted from 0.07 to 0.38)
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(
        this.isSoundtrackEnabled && !this.isMuted ? 0.38 : 0,
        this.ctx.currentTime
      );
      this.bgmGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Toggle Master Mute
  public toggleMute(): boolean {
    this.initCtx();
    this.isMuted = !this.isMuted;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  // Toggle Soundtrack specifically (BGM)
  public toggleSoundtrack(): boolean {
    this.initCtx();
    this.isSoundtrackEnabled = !this.isSoundtrackEnabled;

    if (!this.isSoundtrackRunning && this.isSoundtrackEnabled) {
      this.startSoundtrack();
    }

    if (this.bgmGain && this.ctx) {
      const target = this.isSoundtrackEnabled && !this.isMuted ? 0.38 : 0;
      this.bgmGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
    }

    return this.isSoundtrackEnabled;
  }

  public isSoundtrackPlaying(): boolean {
    return this.isSoundtrackRunning && this.isSoundtrackEnabled && !this.isMuted;
  }

  // Aliases for BGM controls
  public startBgm() {
    this.startSoundtrack();
  }

  public toggleBgm(): boolean {
    return this.toggleSoundtrack();
  }

  // ==========================================
  // PROCEDURAL SOUNDTRACK (RETRO SYNTH BGM)
  // ==========================================
  public startSoundtrack() {
    this.initCtx();
    if (this.isSoundtrackRunning || !this.ctx) return;

    this.isSoundtrackRunning = true;
    this.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;

    // Run scheduler loop using lookahead technique
    this.schedulerInterval = window.setInterval(() => {
      this.scheduleSoundtrackNotes();
    }, 45);
  }

  public stopSoundtrack() {
    if (this.schedulerInterval !== null) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.isSoundtrackRunning = false;
  }

  private scheduleSoundtrackNotes() {
    if (!this.ctx || !this.isSoundtrackRunning) return;

    // Lookahead: schedule notes up to 0.15s ahead
    const lookahead = 0.15;
    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      if (this.isSoundtrackEnabled && !this.isMuted) {
        this.playStepNotes(this.currentStep, this.nextStepTime);
      }
      this.nextStepTime += this.stepDuration;
      this.currentStep = (this.currentStep + 1) % 64; // 4 bars of 16 steps
    }
  }

  // Plays synthesized notes for a specific 16th-step
  private playStepNotes(step: number, time: number) {
    if (!this.ctx || !this.bgmGain) return;

    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;

    // Chord definitions (Deep Horror & Dissonance):
    // Bar 0: Dm (maj7 tension)
    // Bar 1: Eb dim (tritone tension)
    // Bar 2: Gm / Db dim (uncanny valley)
    // Bar 3: A7 altered (b9 horror resolution)
    const bassFrequencies = [73.42, 38.89, 49.00, 55.00]; // D2, Eb1, G1, A1
    const padFrequencies = [
      [146.83, 174.61, 277.18], // D3, F3, C#4 (Horror harmonic minor)
      [155.56, 185.00, 220.00], // Eb3, Gb3, A3 (Diminished tritone)
      [146.83, 196.00, 277.18], // D3, G3, C#4 (Eerie dissonant cluster)
      [138.59, 196.00, 233.08], // C#3, G3, Bb3 (Altered dark chord)
    ];

    // Arpeggio patterns (16 notes per bar - Haunting chime / music box motif)
    const arpMelodies = [
      // Bar 0: Dm horror motif
      [293.66, 349.23, 440.00, 554.37, 523.25, 440.00, 349.23, 277.18, 293.66, 349.23, 440.00, 554.37, 659.25, 554.37, 440.00, 349.23],
      // Bar 1: Eb dim eerie shimmer
      [311.13, 369.99, 440.00, 622.25, 587.33, 440.00, 369.99, 311.13, 311.13, 369.99, 440.00, 622.25, 698.46, 622.25, 440.00, 369.99],
      // Bar 2: Gm / C# ghostly chime
      [293.66, 392.00, 466.16, 554.37, 698.46, 554.37, 466.16, 392.00, 293.66, 392.00, 466.16, 554.37, 698.46, 554.37, 466.16, 392.00],
      // Bar 3: A7b9 spine-chilling resolution
      [277.18, 329.63, 392.00, 466.16, 554.37, 466.16, 392.00, 329.63, 277.18, 329.63, 392.00, 466.16, 587.33, 554.37, 466.16, 329.63],
    ];

    // 1. Synth Kick Pulse (Beat 1 and 3: step 0 & 8)
    if (stepInBar === 0 || stepInBar === 8) {
      try {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(85, time);
        kickOsc.frequency.exponentialRampToValueAtTime(32, time + 0.12);
        kickGain.gain.setValueAtTime(0.55, time);
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
        kickOsc.connect(kickGain);
        kickGain.connect(this.bgmGain);
        kickOsc.start(time);
        kickOsc.stop(time + 0.15);
      } catch {
        // ignore
      }
    }

    // 2. Pulsing Bass Line (Every quarter note: step 0, 4, 8, 12)
    if (stepInBar % 4 === 0) {
      try {
        const bassFreq = bassFrequencies[bar];
        const bassOsc = this.ctx.createOscillator();
        const bassFilter = this.ctx.createBiquadFilter();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, time);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(380, time);
        bassFilter.frequency.exponentialRampToValueAtTime(150, time + 0.25);

        bassGain.gain.setValueAtTime(0.42, time);
        bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.bgmGain);

        bassOsc.start(time);
        bassOsc.stop(time + 0.3);
      } catch {
        // ignore
      }
    }

    // 3. Ambient Pad Chord (Triggered on step 0 of each bar, lasting 16 steps)
    if (stepInBar === 0) {
      const chord = padFrequencies[bar];
      chord.forEach((freq) => {
        try {
          const padOsc = this.ctx!.createOscillator();
          const padFilter = this.ctx!.createBiquadFilter();
          const padGain = this.ctx!.createGain();

          padOsc.type = 'triangle';
          padOsc.frequency.setValueAtTime(freq, time);

          padFilter.type = 'lowpass';
          padFilter.frequency.setValueAtTime(620, time);

          // Slow soft envelope
          const dur = this.stepDuration * 15.5;
          padGain.gain.setValueAtTime(0.001, time);
          padGain.gain.linearRampToValueAtTime(0.14, time + 0.4);
          padGain.gain.setValueAtTime(0.14, time + dur - 0.4);
          padGain.gain.exponentialRampToValueAtTime(0.001, time + dur);

          padOsc.connect(padFilter);
          padFilter.connect(padGain);
          padGain.connect(this.bgmGain!);

          padOsc.start(time);
          padOsc.stop(time + dur + 0.05);
        } catch {
          // ignore
        }
      });
    }

    // 4. Arpeggiated Synth Pluck (Every 8th note: step 0, 2, 4, 6, 8, 10, 12, 14)
    if (stepInBar % 2 === 0) {
      try {
        const noteFreq = arpMelodies[bar][stepInBar];
        const arpOsc = this.ctx.createOscillator();
        const arpFilter = this.ctx.createBiquadFilter();
        const arpGain = this.ctx.createGain();

        arpOsc.type = 'triangle';
        arpOsc.frequency.setValueAtTime(noteFreq, time);

        arpFilter.type = 'lowpass';
        arpFilter.frequency.setValueAtTime(1600, time);
        arpFilter.frequency.exponentialRampToValueAtTime(450, time + 0.12);

        arpGain.gain.setValueAtTime(0.22, time);
        arpGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

        arpOsc.connect(arpFilter);
        arpFilter.connect(arpGain);
        arpGain.connect(this.bgmGain);

        arpOsc.start(time);
        arpOsc.stop(time + 0.15);
      } catch {
        // ignore
      }
    }
  }

  // ==========================================
  // SOUND EFFECTS (SFX)
  // ==========================================

  // Flashlight click on/off
  public playFlashlight() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  // Switch or button click
  public playSwitchClick() {
    this.playFlashlight();
  }

  // Success chime alias
  public playSuccessChime() {
    this.playPuzzleSolved();
  }

  // Lensa Nalar activate / hum
  public setLensaNalarHum(active: boolean) {
    if (this.isMuted || !active) {
      if (this.lensHumGain && this.ctx) {
        this.lensHumGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      return;
    }
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;

      if (!this.lensHumOsc) {
        this.lensHumOsc = this.ctx.createOscillator();
        this.lensHumGain = this.ctx.createGain();
        this.lensHumOsc.type = 'sine';
        this.lensHumOsc.frequency.setValueAtTime(432, this.ctx.currentTime);
        this.lensHumGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.lensHumOsc.connect(this.lensHumGain);
        this.lensHumGain.connect(this.sfxGain);
        this.lensHumOsc.start();
      }
      if (this.lensHumGain) {
        this.lensHumGain.gain.setTargetAtTime(0.18, this.ctx.currentTime, 0.08);
      }
    } catch {
      // ignore
    }
  }

  // Footstep sound
  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90 + Math.random() * 25, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // ignore
    }
  }

  // Jump swoosh / hop sound
  public playJump() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.12);
      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // ignore
    }
  }

  // Heartbeat when ghost steps forward
  public playHeartbeat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      [0, 0.14].forEach((delay, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 58 : 50, now + delay);
        osc.frequency.exponentialRampToValueAtTime(30, now + delay + 0.12);
        gain.gain.setValueAtTime(0.55, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + delay);
        osc.stop(now + delay + 0.16);
      });
    } catch {
      // ignore
    }
  }

  // BIP CRT chatter blip
  public playBipBlip(pitchOffset = 0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(
        580 + pitchOffset * 50 + (Math.random() * 100 - 50),
        this.ctx.currentTime
      );
      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  // Warm chime for puzzle solved / concept verified
  public playPuzzleSolved() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C (major chord)
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.42, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.55);
      });
    } catch {
      // ignore
    }
  }

  // Safe conceptual mistake thud
  public playConceptMistake() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.42, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }

  // Page turn sound
  public playPageTurn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }

  // Start deep ambient school drone
  public startAmbience() {
    if (this.ambientOsc) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(58.27, this.ctx.currentTime); // Bb1 drone
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.sfxGain);
      this.ambientOsc.start();
    } catch {
      // ignore
    }
  }

  // Player takes damage / hurt sound
  public playPlayerHurt() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);

      this.playHeartbeat();
    } catch {
      // ignore
    }
  }

  // Terrifying Jumpscare audio synthesis
  public playJumpscare() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Violent High Screech (Sawtooth + Square Dissonance)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const screechFilter = this.ctx.createBiquadFilter();
      const screechGain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(1900, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 1.2);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1980, now); // tritone/minor 2nd screech
      osc2.frequency.exponentialRampToValueAtTime(110, now + 1.2);

      screechFilter.type = 'highpass';
      screechFilter.frequency.setValueAtTime(250, now);

      screechGain.gain.setValueAtTime(0.95, now);
      screechGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc1.connect(screechFilter);
      osc2.connect(screechFilter);
      screechFilter.connect(screechGain);
      screechGain.connect(this.masterGain || this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.6);
      osc2.stop(now + 1.6);

      // 2. Heavy Sub Bass Impact Thump
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(130, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.9);
      subGain.gain.setValueAtTime(1.0, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      subOsc.connect(subGain);
      subGain.connect(this.masterGain || this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.4);

      // 3. Static White Noise Screaming Burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.35));
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2800, now);
      noiseFilter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain || this.ctx.destination);
      noiseSource.start(now);
    } catch {
      // ignore
    }
  }
}

export const sounds = new SoundEngine();
