"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSound } from "@/hooks/use-sound";
import { type SoundType } from "@/types";
import { Button } from "./ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface FocusAlertProps {
  isOpen: boolean;
  onConfirm: () => void;
  onEndSession: () => void;
  taskTitle: string;
  taskEmoji: string;
  sound: SoundType;
  sessionCount: number;
}

export function FocusAlert({ isOpen, onConfirm, onEndSession, taskTitle, taskEmoji, sound, sessionCount }: FocusAlertProps) {
  const { startLoop, stopLoop } = useSound();

  React.useEffect(() => {
    if (isOpen) {
      startLoop(sound, 1500);
    } else {
      stopLoop();
    }
    
    return () => {
      stopLoop();
    };
  }, [isOpen, sound, startLoop, stopLoop]);

  const handleConfirm = () => {
    stopLoop();
    onConfirm();
  };
  
  const handleEndSession = () => {
    stopLoop();
    onEndSession();
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md bg-white border-0 shadow-xl">
        <AlertDialogHeader className="text-center pb-4">
          <div className="text-6xl mb-4">{taskEmoji}</div>
          <AlertDialogTitle className="text-xl font-light text-slate-700">
            Focus Check-In
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="text-center space-y-4">
          <AlertDialogDescription className="text-slate-600 leading-relaxed">
            Time for a gentle reminder! Are you still focused on:
          </AlertDialogDescription>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-700 mb-1">
              {taskTitle}
            </h3>
          </div>

          {sessionCount > 0 && (
            <div className="text-sm text-emerald-600">
              Great job! You've completed {sessionCount} focus session{sessionCount !== 1 ? 's' : ''} so far.
            </div>
          )}

          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
            <p className="text-sm text-amber-700">
              🔔 Sound will continue until you respond
            </p>
          </div>
        </div>
        <AlertDialogFooter className="flex-row gap-3 pt-4 sm:justify-center">
            <Button
              onClick={handleEndSession}
              variant="outline"
              className="flex-1 text-slate-600 border-slate-300 hover:bg-slate-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              End Session
            </Button>
            <AlertDialogAction
              onClick={handleConfirm}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              I am Focused
            </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}