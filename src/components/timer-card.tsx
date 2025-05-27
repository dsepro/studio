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

export function TimerCard({ initialDurationMinutes = 135, onOpenConfirmation }: TimerCardProps) { // Default 2h15m
  const [initialTotalSeconds, setInitialTotalSeconds] = useLocalStorage<number>('timerInitialSeconds', initialDurationMinutes * 60);
  const [timeLeft, setTimeLeft] = useLocalStorage<number>('timerTimeLeft', initialTotalSeconds);
  const [isRunning, setIsRunning] = useLocalStorage<boolean>('timerIsRunning', false);
  
  // This effect ensures that on initial load, if isRunning was true from localStorage, the timer starts.
  // It also handles the timer countdown.
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
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

  const adjustTime = (seconds: number) => {
    setTimeLeft(prevTime => Math.max(0, prevTime + seconds));
    // If timer is not running and adjusted to >0, and we want it to start, uncomment:
    // if (!isRunning && timeLeft + seconds > 0) setIsRunning(true); 
  };

  const adjustInitialTime = (minutes: number) => {
    const newInitialSeconds = Math.max(60, initialTotalSeconds + minutes * 60); // Minimum 1 minute
    setInitialTotalSeconds(newInitialSeconds);
    if (!isRunning) { // Only update timeLeft if timer is not running
      setTimeLeft(newInitialSeconds);
    }
  };

  const progressPercentage = initialTotalSeconds > 0 ? (timeLeft / initialTotalSeconds) * 100 : 0;

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Exam Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6">
        <div className="text-5xl md:text-7xl font-mono font-bold tabular-nums"
             style={{ color: timeLeft <= 300 && timeLeft > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))' }}>
          {formatTime(timeLeft)}
        </div>
        <Progress value={progressPercentage} className="w-full h-3" />
        <div className="grid grid-cols-3 gap-2 w-full">
          <Button onClick={handleStart} disabled={isRunning || timeLeft === 0} className="btn-success col-span-1">
            <Icons.Play className="mr-2 h-5 w-5" /> Start
          </Button>
          <Button onClick={handleStop} disabled={!isRunning} variant="destructive" className="col-span-1">
            <Icons.Pause className="mr-2 h-5 w-5" /> Stop
          </Button>
          <Button onClick={handleReset} variant="outline" className="col-span-1">
            <Icons.RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>
        <div className="w-full space-y-2 pt-4">
          <p className="text-sm font-medium text-center text-muted-foreground">Adjust Current Time:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => adjustTime(300)} className="btn-timer-adjust">+5m</Button>
            <Button onClick={() => adjustTime(60)} className="btn-timer-adjust">+1m</Button>
            <Button onClick={() => adjustTime(30)} className="btn-timer-adjust">+30s</Button>
            <Button onClick={() => adjustTime(-300)} className="btn-timer-adjust">-5m</Button>
            <Button onClick={() => adjustTime(-60)} className="btn-timer-adjust">-1m</Button>
            <Button onClick={() => adjustTime(-30)} className="btn-timer-adjust">-30s</Button>
          </div>
        </div>
         <div className="w-full space-y-2 pt-4">
          <p className="text-sm font-medium text-center text-muted-foreground">Adjust Initial Duration (Resets Timer):</p>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => { adjustInitialTime(5); handleReset(); }} className="btn-timer-adjust">+5m Init</Button>
            <Button onClick={() => { adjustInitialTime(-5); handleReset(); }} className="btn-timer-adjust">-5m Init</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
