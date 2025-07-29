"use client";

import { useRef, useEffect, useCallback } from 'react';
import { type SoundType } from '@/types';

type SoundPlayer = {
  playSound: (sound: SoundType) => void;
  startLoop: (sound: SoundType) => void;
  stopLoop: () => void;
};

// Helper function to create AudioContext to support older browsers.
const createAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export function useSound(): SoundPlayer {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize AudioContext on mount
  useEffect(() => {
    if (!audioContextRef.current) {
        audioContextRef.current = createAudioContext();
    }
    
    // Cleanup on unmount
    return () => {
        stopLoop();
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            // Closing the context was causing issues on re-renders, 
            // so we'll just stop sounds instead.
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSound = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // Hushing errors on double-stopping
      } finally {
        oscillatorRef.current = null;
      }
    }
    if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
    }
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // Resume context if it's suspended (e.g., due to browser policies)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    stopSound();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    let duration = 0.5;
    switch(sound) {
        case 'chime':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime); // C6
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
            duration = 1;
            break;
        case 'bell':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(1567.98, audioContext.currentTime); // G6
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.5);
            duration = 1.5;
            break;
        case 'beep':
        default:
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
            duration = 0.5;
            break;
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [stopSound]);

  const stopLoop = useCallback(() => {
    if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
    }
    stopSound();
  }, [stopSound]);

  const startLoop = useCallback((sound: SoundType) => {
    stopLoop(); // Ensure no other loops are running

    const playAndScheduleNext = () => {
        playSound(sound);
        const duration = sound === 'bell' ? 1500 : (sound === 'chime' ? 1000 : 500);
        loopIntervalRef.current = setTimeout(playAndScheduleNext, duration + 300); // 300ms gap
    };

    playAndScheduleNext();
  }, [playSound, stopLoop]);

  return { playSound, startLoop, stopLoop };
}
