"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSound } from "@/hooks/use-sound";
import { type SoundType } from "@/types";

interface FocusAlertProps {
  isOpen: boolean;
  onConfirm: () => void;
  taskTitle: string;
  taskEmoji: string;
  sound: SoundType;
}

export function FocusAlert({ isOpen, onConfirm, taskTitle, taskEmoji, sound }: FocusAlertProps) {
  const { startLoop, stopLoop } = useSound();

  React.useEffect(() => {
    if (isOpen) {
      startLoop(sound);
    } else {
      stopLoop();
    }
    
    // Cleanup on unmount or when isOpen changes to false
    return () => {
      stopLoop();
    };
  }, [isOpen, sound, startLoop, stopLoop]);

  const handleConfirm = () => {
    stopLoop();
    onConfirm();
  };
  
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center text-2xl gap-4">
            <span className="text-4xl">{taskEmoji}</span>
            Stay Focused!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2">
            A gentle reminder to keep your focus on &quot;{taskTitle}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center pt-4">
          <AlertDialogAction onClick={handleConfirm} className="px-8 py-6 text-lg">
            I am focused
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
