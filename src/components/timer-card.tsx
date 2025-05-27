
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Progress } from "@/components/ui/progress";
import useLocalStorage from '@/hooks/use-local-storage';

interface TimerCardProps {
  initialDurationMinutes?: number;
  onOpenConfirmation: (title: string, description: string, onConfirm: () => void) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function TimerCard({ initialDurationMinutes = 135, onOpenConfirmation }: TimerCardProps) { 
  const [initialTotalSeconds, setInitialTotalSeconds] = useLocalStorage<number>('timerInitialSeconds', initialDurationMinutes * 60);
  const [timeLeft, setTimeLeft] = useLocalStorage<number>('timerTimeLeft', initialTotalSeconds);
  const [isRunning, setIsRunning] = useLocalStorage<boolean>('timerIsRunning', false);
  
  useEffect(() => {
    // Update initialTotalSeconds and timeLeft if initialDurationMinutes prop changes and timer is not running
    // This ensures that changes from ExamSetupModal (which updates examDetails.timeAllowed) propagate to the timer
    const newPropInitialSeconds = initialDurationMinutes * 60;
    if (!isRunning && newPropInitialSeconds !== initialTotalSeconds) {
      setInitialTotalSeconds(newPropInitialSeconds);
      setTimeLeft(newPropInitialSeconds);
    }
  }, [initialDurationMinutes, isRunning, initialTotalSeconds, setInitialTotalSeconds, setTimeLeft]);


  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);
      // Optionally, play a sound or show a notification
    }
    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, setTimeLeft, setIsRunning]);


  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    onOpenConfirmation(
      "Reset Timer?",
      "Are you sure you want to reset the timer to its initial duration?",
      () => {
        setIsRunning(false);
        setTimeLeft(initialTotalSeconds);
      }
    );
  };

  const progressPercentage = initialTotalSeconds > 0 ? (timeLeft / initialTotalSeconds) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center">Time Left</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6">
        <div className="text-5xl md:text-7xl font-mono font-bold tabular-nums"
             style={{ color: timeLeft <= 300 && timeLeft > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))' }}>
          {formatTime(timeLeft)}
        </div>
        <Progress value={progressPercentage} className="w-full h-3" />
        <div className="grid grid-cols-3 gap-2 w-full max-w-md">
          <Button onClick={handleStart} disabled={isRunning || timeLeft === 0} variant="default" className="col-span-1">
            <Icons.Play className="mr-2 h-5 w-5" /> Start
          </Button>
          <Button onClick={handleStop} disabled={!isRunning} variant="secondary" className="col-span-1">
            <Icons.Pause className="mr-2 h-5 w-5" /> Stop
          </Button>
          <Button onClick={handleReset} variant="destructive" className="col-span-1">
            <Icons.RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
