"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAudio = useCallback(() => {
    if (!isInitialized) {
      // Create AudioContext on the first user interaction
      const context = new (window.AudioContext)();
      audioContextRef.current = context;
      setIsInitialized(true);
      // A dummy sound played on initialization to unlock audio on all browsers.
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    }
  }, [isInitialized]);

  useEffect(() => {
    // Add event listeners for the first user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => window.addEventListener(event, initializeAudio, { once: true }));

    return () => {
      // Cleanup event listeners
      events.forEach(event => window.removeEventListener(event, initializeAudio));
      // Cleanup AudioContext
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [initializeAudio]);

  const play = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext || !isInitialized) return;
    
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
  }, [isInitialized]);

  return { play };
}
