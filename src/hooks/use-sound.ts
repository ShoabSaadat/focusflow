"use client";

import { useRef, useEffect, useCallback } from 'react';
import { type SoundType } from '@/types';

type SoundPlayer = {
  startLoop: (sound: SoundType) => void;
  stopLoop: () => void;
};

export function useSound(): SoundPlayer {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This effect runs once on mount to create the AudioContext.
    // We check for window to ensure it only runs on the client.
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;
    }

    // Cleanup on unmount
    return () => {
        stopLoop();
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };
  }, []);

  const stopLoop = useCallback(() => {
    if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
    }
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
    }
  }, []);
  
  const playSound = useCallback((sound: SoundType) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // It's a good practice to resume the context, in case it was suspended.
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    stopLoop(); // Stop any existing sound before playing a new one.

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    switch(sound) {
        case 'chime':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime); // C6
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
            break;
        case 'bell':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(1567.98, audioContext.currentTime); // G6
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.5);
            break;
        case 'beep':
        default:
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
            break;
    }

    oscillator.start(audioContext.currentTime);
    const duration = sound === 'bell' ? 1.5 : (sound === 'chime' ? 1 : 0.5)
    oscillator.stop(audioContext.currentTime + duration);
  }, [stopLoop]);

  const startLoop = useCallback((sound: SoundType) => {
    stopLoop(); // Ensure no other loops are running

    const playAndScheduleNext = () => {
        playSound(sound);
        const duration = sound === 'bell' ? 1500 : (sound === 'chime' ? 1000 : 500);
        loopIntervalRef.current = setTimeout(playAndScheduleNext, duration + 300); // 300ms gap
    };

    playAndScheduleNext();
  }, [playSound, stopLoop]);


  return { startLoop, stopLoop };
}
