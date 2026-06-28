/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmbientSoundType } from '../types';

class AudioEngineClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  
  // Ambient sources
  private windNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private rainNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private cricketTimer: number | null = null;
  private birdTimer: number | null = null;
  private padOscillators: OscillatorNode[] = [];
  private padGains: GainNode[] = [];
  
  private currentAmbient: AmbientSoundType | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private initialized: boolean = false;

  constructor() {
    // Audio will be fully initialized on the first user interaction
  }

  public init() {
    if (this.initialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      this.ctx = new AudioCtx();
      
      // Setup master controls
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.initialized = true;
      this.resume();
    } catch (e) {
      console.warn("Failed to initialize Web Audio API:", e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.warn(e));
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (!this.initialized) this.init();
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(mute ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  public setMusicMute(mute: boolean) {
    this.isMusicMuted = mute;
    if (!this.initialized) this.init();
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(mute ? 0 : 0.5, this.ctx.currentTime);
      
      // If we unmuted and have an ambient, trigger restart
      if (!mute && this.currentAmbient) {
        const prev = this.currentAmbient;
        this.stopAmbient();
        this.startAmbient(prev);
      } else if (mute) {
        this.stopAmbientNoiseNodes();
      }
    }
  }

  // Helper to create a noise buffer (white noise)
  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  // --- SOUND EFFECTS ---

  // Play a soft bounce/hop sound
  public playHop() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    // Bouncy organic waveform
    osc.type = 'triangle';
    
    // Pitch slide representing a hop
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

    // Soft envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    // Low pass filter to make it cozy and warm
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Play a satisfying leaf puff / pop sound
  public playSplat(type: string = 'leaf') {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    // 1. High-frequency chime/sparkle component for magic feel
    if (type === 'sparkle' || type === 'star' || type === 'enchanted') {
      const frequencies = [587.33, 880.00, 1174.66, 1318.51]; // Beautiful harmonious D major notes
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.015);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.015 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + idx * 0.03);

        osc.start(now + idx * 0.015);
        osc.stop(now + 0.5);
      });
    }

    // 2. Pleasant fluid bubble/droplet sound
    if (type === 'droplet') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.start(now);
      osc.stop(now + 0.16);
      return;
    }

    // 3. Leaf/Petal/Default: Soft organic pop (noise burst + clean sub harmonic)
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      // Low, pleasant leaf ruffle frequency
      filter.frequency.setValueAtTime(type === 'snow' ? 2200 : 850, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noiseSource.start(now);
      noiseSource.stop(now + 0.22);
    }

    // Organic pop thud component for tactility
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.connect(thudGain);
    thudGain.connect(this.sfxGain);

    thud.type = 'triangle';
    thud.frequency.setValueAtTime(180, now);
    thud.frequency.linearRampToValueAtTime(50, now + 0.08);

    thudGain.gain.setValueAtTime(0.3, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    thud.start(now);
    thud.stop(now + 0.12);
  }

  // Play a soft meditative achievement chime
  public playChime() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Beautiful pentatonic chime chord (G major chord: G4, B4, D5, G5, B5)
    const notes = [392.00, 493.88, 587.33, 783.99, 987.77];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const delay = idx * 0.08;

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);

      osc.start(now + delay);
      osc.stop(now + delay + 1.0);
    });
  }

  // --- AMBIENT SOUNDSCAPES ---

  public startAmbient(type: AmbientSoundType) {
    this.init();
    this.resume();
    if (this.currentAmbient === type) return;
    
    this.stopAmbient();
    this.currentAmbient = type;

    if (!this.ctx || this.isMusicMuted || !this.musicGain) return;

    const now = this.ctx.currentTime;

    if (type === 'meadow' || type === 'forest') {
      // 1. Soft wind (lowpass filtered noise with LFO volume)
      this.startWind(type === 'forest' ? 350 : 500);
      
      // 2. Procedural birds chirping
      this.startBirds();
    } else if (type === 'rain') {
      // Gentle rain
      this.startRain();
    } else if (type === 'night') {
      // Crickets and low breeze
      this.startWind(250, 0.08); // deeper wind
      this.startCrickets();
    } else if (type === 'enchanted') {
      // Celestial pad chord progression
      this.startEnchantedPad();
    }
  }

  public stopAmbient() {
    this.stopAmbientNoiseNodes();
    
    if (this.cricketTimer) {
      window.clearInterval(this.cricketTimer);
      this.cricketTimer = null;
    }
    if (this.birdTimer) {
      window.clearInterval(this.birdTimer);
      this.birdTimer = null;
    }
    
    // Stop pads
    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.padGains.forEach(gain => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        } catch (e) {}
      });
      
      const currentOscs = [...this.padOscillators];
      setTimeout(() => {
        currentOscs.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {}
        });
      }, 1500);
      
      this.padOscillators = [];
      this.padGains = [];
    }

    this.currentAmbient = null;
  }

  private stopAmbientNoiseNodes() {
    if (this.windNode) {
      try {
        this.windNode.disconnect();
      } catch (e) {}
      this.windNode = null;
    }
    if (this.rainNode) {
      try {
        this.rainNode.disconnect();
      } catch (e) {}
      this.rainNode = null;
    }
  }

  // Generate wind-like texture via script processor (backward compatible and super lightweight)
  private startWind(cutoff: number = 400, baseGain: number = 0.12) {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = 4096;
    let lastOut = 0.0;
    
    // ScriptProcessor is deprecated but universally supported and perfect for local procedural noise without worklet file paths
    const proc = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    proc.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Simple brown noise filter
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate loss of volume
      }
    };

    // Slowly modulate volume to simulate breeze
    proc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);

    this.windNode = proc;

    // Start breathing wind LFO
    const lfo = () => {
      if (!this.ctx || !this.windNode) return;
      const t = this.ctx.currentTime;
      const speed = 4 + Math.random() * 4; // LFO duration
      const targetVol = baseGain + (Math.random() * 0.14);
      try {
        gainNode.gain.exponentialRampToValueAtTime(targetVol, t + speed);
        // Slowly drift filter cutoff
        filter.frequency.exponentialRampToValueAtTime(cutoff + (Math.random() * 200 - 100), t + speed);
        setTimeout(lfo, speed * 1000);
      } catch (e) {}
    };

    gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    lfo();
  }

  private startRain() {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = 4096;
    const proc = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    proc.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // High frequency white noise crackle
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
    };

    proc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);

    gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.rainNode = proc;
  }

  private startBirds() {
    if (!this.ctx) return;

    const triggerBird = () => {
      if (!this.ctx || this.isMusicMuted || this.currentAmbient === 'rain' || !this.musicGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.type = 'sine';
      
      // Random lovely chirping frequency sweeps
      const baseFreq = 2200 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, now);
      
      // Series of short quick chirps
      const chirps = 2 + Math.floor(Math.random() * 3);
      let t = now;
      gain.gain.setValueAtTime(0, t);

      for (let i = 0; i < chirps; i++) {
        gain.gain.linearRampToValueAtTime(0.03, t + 0.01);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 1000, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        t += 0.12;
        osc.frequency.setValueAtTime(baseFreq - 200, t);
      }

      osc.start(now);
      osc.stop(t + 0.1);
    };

    // Schedule next bird chirp every 6-12 seconds
    this.birdTimer = window.setInterval(() => {
      if (Math.random() > 0.4) triggerBird();
    }, 7000);
  }

  private startCrickets() {
    if (!this.ctx) return;

    const triggerCricket = () => {
      if (!this.ctx || this.isMusicMuted || !this.musicGain) return;

      const now = this.ctx.currentTime;
      const count = 3 + Math.floor(Math.random() * 4); // rhythmic chirps
      
      for (let i = 0; i < count; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.type = 'sine';
        // Crickets chirp at high frequency (around 3800-4200 Hz)
        osc.frequency.setValueAtTime(4000 + Math.random() * 150, now + (i * 0.18));
        
        const chirpStart = now + (i * 0.18);
        gain.gain.setValueAtTime(0, chirpStart);
        gain.gain.linearRampToValueAtTime(0.02, chirpStart + 0.02);
        // Fast amplitude modulation to simulate wings rubbing
        gain.gain.setValueAtTime(0.015, chirpStart + 0.04);
        gain.gain.linearRampToValueAtTime(0.02, chirpStart + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.12);

        osc.start(chirpStart);
        osc.stop(chirpStart + 0.15);
      }
    };

    this.cricketTimer = window.setInterval(() => {
      if (Math.random() > 0.3) triggerCricket();
    }, 4500);
  }

  // Celestial relaxing chords for the Enchanted Garden
  private startEnchantedPad() {
    if (!this.ctx || !this.musicGain) return;

    // G major, C major 7th, E minor 7th chord structures
    const chords = [
      [196.00, 293.66, 392.00, 493.88], // G3, D4, G4, B4
      [261.63, 329.63, 392.00, 523.25], // C3, E4, G4, C5
      [164.81, 293.66, 329.63, 392.00]  // E3, D4, E4, G4
    ];

    let currentChordIdx = 0;

    const playChord = () => {
      if (!this.ctx || this.currentAmbient !== 'enchanted' || this.isMusicMuted || !this.musicGain) return;

      const now = this.ctx.currentTime;
      const chord = chords[currentChordIdx];
      const duration = 12.0; // long, slow chords

      // Stop old pad oscillators safely
      const oldGains = [...this.padGains];
      oldGains.forEach(g => {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        } catch (e) {}
      });

      // Clear list from active references
      this.padOscillators = this.padOscillators.filter(osc => {
        try {
          // Keep running for a bit then let it die, we clean up actual node references
          return false;
        } catch (e) { return false; }
      });
      this.padGains = [];

      // Start new chord
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        // Soft warmth filter
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500 + Math.random() * 200, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain!);

        // Soft, rich warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 1.5 - 0.75), now); // tiny detune

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 3.0); // Slow fade-in
        gain.gain.setValueAtTime(0.04, now + duration - 3.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Slow fade-out

        osc.start(now);
        // Let it run slightly past duration so fade complete
        osc.stop(now + duration + 1);

        this.padOscillators.push(osc);
        this.padGains.push(gain);
      });

      // Progress chord
      currentChordIdx = (currentChordIdx + 1) % chords.length;

      // Schedule next chord
      this.birdTimer = window.setTimeout(playChord, (duration - 2.5) * 1000);
    };

    playChord();
  }
}

export const AudioEngine = new AudioEngineClass();
