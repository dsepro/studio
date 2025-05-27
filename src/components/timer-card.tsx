
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Progress } from "@/components/ui/progress";
import useLocalStorage from '@/hooks/use-local-storage';
import { Separator } from '@/components/ui/separator';

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
        setTimeLeft(prevTime => Math.max(0, prevTime - 1));
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

  const adjustCurrentTime = (seconds: number) => {
    setTimeLeft(prevTime => {
      const newTime = prevTime + seconds;
      return Math.max(0, Math.min(newTime, initialTotalSeconds));
    });
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
        
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          {/* Main Controls */}
          <div className="flex justify-center space-x-2 w-full">
            <Button onClick={handleStart} disabled={isRunning || timeLeft === 0} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Icons.Play className="mr-2 h-5 w-5" /> Start
            </Button>
            <Button onClick={handleStop} disabled={!isRunning} variant="secondary" className="flex-1">
              <Icons.Pause className="mr-2 h-5 w-5" /> Stop
            </Button>
            <Button onClick={handleReset} variant="destructive" className="flex-1">
              <Icons.RotateCcw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>

          <Separator className="my-4 w-3/4" />

          {/* Time Adjustment Controls */}
          <div className="w-full">
            <p className="text-sm text-center text-muted-foreground mb-2">Adjust Time (when stopped)</p>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => adjustCurrentTime(-300)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Minus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">5m</span><span className="sm:hidden">-5m</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(-60)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Minus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">1m</span><span className="sm:hidden">-1m</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(-30)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Minus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">30s</span><span className="sm:hidden">-30s</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(300)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">5m</span><span className="sm:hidden">+5m</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(60)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">1m</span><span className="sm:hidden">+1m</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(30)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">30s</span><span className="sm:hidden">+30s</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
