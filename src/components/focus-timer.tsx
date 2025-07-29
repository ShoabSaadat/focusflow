"use client";

import * as React from "react";
import { TimerOff } from "lucide-react";

import { type Task } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FocusAlert } from "./focus-alert";
import { Progress } from "./ui/progress";

interface FocusTimerProps {
  task: Task;
  onStop: () => void;
}

export function FocusTimer({ task, onStop }: FocusTimerProps) {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const intervalMilliseconds = task.interval * 1000;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIsAlertOpen(true);
    }, intervalMilliseconds);

    return () => clearInterval(timer);
  }, [task.id, intervalMilliseconds]);

  React.useEffect(() => {
    if (isAlertOpen) return;

    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / task.interval;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [task.interval, isAlertOpen]);

  const handleConfirmFocus = () => {
    setIsAlertOpen(false);
  };
  
  const getIntervalText = () => {
    if (task.interval < 60) {
        return `${task.interval} ${task.interval > 1 ? "seconds" : "second"}`
    }
    const minutes = Math.floor(task.interval / 60);
    const seconds = task.interval % 60;
    let text = `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
    if (seconds > 0) {
        text += ` and ${seconds} ${seconds > 1 ? "seconds" : "second"}`;
    }
    return text;
  }

  return (
    <>
      <Dialog open={true} modal={true}>
        <DialogContent
          className="max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          hideCloseButton={true}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-headline flex items-center justify-center gap-4">
              <span className="text-5xl">{task.emoji}</span>
              {task.title}
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              Focusing on: {task.description || "No description."}
              <br />
              Reminder every {getIntervalText()}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <Progress value={progress} className="w-full h-3" />
            <p className="text-center text-muted-foreground mt-4">
              The timer is running. Stay on task!
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="button" variant="destructive" onClick={onStop} size="lg">
              <TimerOff className="mr-2 h-5 w-5" />
              Stop Focusing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FocusAlert
        isOpen={isAlertOpen}
        onConfirm={handleConfirmFocus}
        taskTitle={task.title}
        taskEmoji={task.emoji}
      />
    </>
  );
}
