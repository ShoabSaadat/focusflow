"use client";

import * as React from "react";
import { ArrowLeft, Pause, Play, Square } from "lucide-react";
import { type Task } from "@/types";
import { Button } from "./ui/button";
import { FocusAlert } from "./focus-alert";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import { useSound } from "@/hooks/use-sound";

interface FocusTimerProps {
  task: Task;
  onStop: () => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatSeconds = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds} sec${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
};

export function FocusTimer({ task, onStop }: FocusTimerProps) {
  const [isRunning, setIsRunning] = React.useState(true);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [sessionCount, setSessionCount] = React.useState(0);
  
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const reminderTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { ensureAudioReady } = useSound();

  const intervalMilliseconds = task.interval * 1000;
  
  React.useEffect(() => {
    ensureAudioReady();
  }, [ensureAudioReady]);
  
  React.useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      
      const remainingTime = intervalMilliseconds - (elapsedSeconds * 1000);
      
      reminderTimeoutRef.current = setTimeout(() => {
        setIsAlertOpen(true);
        setIsRunning(false);
      }, remainingTime);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (reminderTimeoutRef.current) clearTimeout(reminderTimeoutRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (reminderTimeoutRef.current) clearTimeout(reminderTimeoutRef.current);
    };
  }, [isRunning, intervalMilliseconds, elapsedSeconds]);
  
  const handleConfirmFocus = () => {
    setIsAlertOpen(false);
    setSessionCount(prev => prev + 1);
    setElapsedSeconds(0);
    setIsRunning(true);
  };
  
  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  
  const progressPercentage = (elapsedSeconds / task.interval) * 100;
  const remainingSeconds = task.interval - elapsedSeconds;
  const totalMinutesFocused = Math.floor((sessionCount * task.interval + elapsedSeconds) / 60);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                onClick={onStop}
                className="hover:bg-white/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tasks
              </Button>
            </div>
            
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">{task.emoji}</div>
                      <h1 className="text-2xl font-light text-slate-700 mb-2">
                        {task.title}
                      </h1>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {task.description || "No description."}
                      </p>
                    </div>

                    <div className="text-center mb-8">
                      <div className="text-6xl font-mono font-light text-slate-700 mb-4">
                        {formatTime(elapsedSeconds)}
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className="w-full max-w-md mx-auto h-2"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Next reminder in {formatSeconds(remainingSeconds)}
                      </p>
                    </div>
                    
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-6 bg-slate-50 rounded-xl px-6 py-3">
                        <div className="text-center">
                          <div className="text-2xl font-light text-primary">
                            {sessionCount}
                          </div>
                          <div className="text-xs text-slate-500">
                            Completed Sessions
                          </div>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="text-center">
                          <div className="text-2xl font-light text-emerald-600">
                            {totalMinutesFocused}
                          </div>
                          <div className="text-xs text-slate-500">
                            Minutes Focused
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      {!isRunning ? (
                        <Button
                          onClick={handleResume}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Continue
                        </Button>
                      ) : (
                        <Button
                          onClick={handlePause}
                          variant="outline"
                          className="px-8 py-3 rounded-xl"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </Button>
                      )}
                      
                      <Button
                        onClick={onStop}
                        variant="outline" 
                        className="px-8 py-3 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        End Session
                      </Button>
                    </div>
                    
                    <div className="mt-8 p-4 bg-primary/10 rounded-xl">
                      <p className="text-sm text-primary/80 text-center font-light">
                        💡 You'll get a gentle reminder every {formatSeconds(task.interval)} to check in with your focus.
                      </p>
                    </div>

                </CardContent>
            </Card>
        </div>
      </div>
      <FocusAlert
        isOpen={isAlertOpen}
        onConfirm={handleConfirmFocus}
        onEndSession={onStop}
        taskTitle={task.title}
        taskEmoji={task.emoji}
        sound={task.sound}
        sessionCount={sessionCount + 1}
      />
    </>
  );
}