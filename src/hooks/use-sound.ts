"use client";

import { useRef, useCallback } from 'react';
import { type SoundType } from '@/types';

type SoundPlayer = {
  playSound: (sound: SoundType) => Promise<void>;
  startLoop: (sound: SoundType, intervalMs?: number) => void;
  stopLoop: () => void;
  ensureAudioReady: () => Promise<void>;
};

const soundOptions = [
  { value: 'beep', frequency: 800, duration: 0.2 },
  { value: 'chime', frequency: 523.25, duration: 0.5 },
  { value: 'bell', frequency: 659.25, duration: 0.8 },
];

class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private currentLoop: NodeJS.Timeout | null = null;
  private isLooping = false;

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initAudioContext() {
    if (typeof window === 'undefined') return;
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.warn('AudioContext not supported:', error);
    }
  }
  
  public async ensureAudioReady() {
    await this.initAudioContext();
    if (this.audioContext && this.audioContext.state === 'suspended') {
        try {
            await this.audioContext.resume();
        } catch (e) {
            console.error("Could not resume audio context", e);
        }
    }
  }

  public async playSound(soundType: SoundType = 'beep') {
    await this.ensureAudioReady();
    if (!this.audioContext) return;
    
    try {
      const soundConfig = soundOptions.find(s => s.value === soundType) || soundOptions[0];
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(soundConfig.frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, now + soundConfig.duration);

      oscillator.start(now);
      oscillator.stop(now + soundConfig.duration);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  public startLoop(soundType: SoundType = 'beep', intervalMs = 1500) {
    this.stopLoop();
    this.isLooping = true;
    
    const playLoopedSound = () => {
      if (!this.isLooping) return;
      this.playSound(soundType);
      this.currentLoop = setTimeout(playLoopedSound, intervalMs);
    };
    
    playLoopedSound();
  }

  public stopLoop() {
    this.isLooping = false;
    if (this.currentLoop) {
      clearTimeout(this.currentLoop);
      this.currentLoop = null;
    }
  }
}

const soundManager = SoundManager.getInstance();

export function useSound(): SoundPlayer {
  const playSound = useCallback(async (sound: SoundType) => {
    await soundManager.playSound(sound);
  }, []);

  const startLoop = useCallback((sound: SoundType, intervalMs = 1500) => {
    soundManager.startLoop(sound, intervalMs);
  }, []);

  const stopLoop = useCallback(() => {
    soundManager.stopLoop();
  }, []);

  const ensureAudioReady = useCallback(async () => {
    await soundManager.ensureAudioReady();
  }, []);

  return { playSound, startLoop, stopLoop, ensureAudioReady };
}