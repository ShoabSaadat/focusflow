"use client";

import { useState, useEffect, useCallback } from 'react';

export function useSound() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new (window.AudioContext)();
    setAudioContext(context);
    
    return () => {
      if (context.state !== 'closed') {
        context.close();
      }
    };
  }, []);

  const play = useCallback(() => {
    if (!audioContext) return;
    
    // Resume context if it's suspended (required by modern browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [audioContext]);

  return { play };
}
