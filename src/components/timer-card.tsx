
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Progress } from "@/components/ui/progress";
import useLocalStorage from '@/hooks/use-local-storage';
import { Separator } from '@/components/ui/separator';
import { Input } from "@/components/ui/input"; // Added for quick edit

interface TimerCardProps {
  initialDurationMinutes?: number;
  onOpenConfirmation: (title: string, description: string, onConfirm: () => void) => void; // Kept for potential future use
  language: string;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const parseFormattedTimeToSeconds = (formattedTime: string): number => {
  const parts = formattedTime.split(':').map(Number);
  if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0)) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  // Try parsing as just minutes if single number
  if (parts.length === 1 && !isNaN(parts[0]) && parts[0] >= 0) {
    return parts[0] * 60;
  }
  return -1; // Invalid format
};


export function TimerCard({ initialDurationMinutes = 135, onOpenConfirmation, language }: TimerCardProps) { 
  const [initialTotalSeconds, setInitialTotalSeconds] = useLocalStorage<number>('timerInitialSeconds', initialDurationMinutes * 60);
  const [timeLeft, setTimeLeft] = useLocalStorage<number>('timerTimeLeft', initialTotalSeconds);
  const [isRunning, setIsRunning] = useLocalStorage<boolean>('timerIsRunning', false);
  
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editTimeValue, setEditTimeValue] = useState(formatTime(timeLeft));
  const timeInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!isEditingTime) {
      setEditTimeValue(formatTime(timeLeft));
    }
  }, [timeLeft, isEditingTime]);

  useEffect(() => {
    if (isEditingTime && timeInputRef.current) {
      timeInputRef.current.focus();
      timeInputRef.current.select();
    }
  }, [isEditingTime]);

  const handleStart = () => {
    if (isEditingTime) setIsEditingTime(false);
    setIsRunning(true);
  }
  const handleStop = () => setIsRunning(false);

  const T = {
    timeLeftTitle: language === 'zh' ? '剩余时间' : 'Time Left',
    start: language === 'zh' ? '开始' : 'Start',
    stop: language === 'zh' ? '停止' : 'Stop',
    reset: language === 'zh' ? '重置' : 'Reset',
    // Reset confirmation text removed as it's no longer a popup
    adjustTimeLabel: language === 'zh' ? '调整时间 (计时器停止时)' : 'Adjust Time (when stopped)',
    s30: language === 'zh' ? '30秒' : '30s',
    m1: language === 'zh' ? '1分钟' : '1m',
    m5: language === 'zh' ? '5分钟' : '5m',
    quickEditHint: language === 'zh' ? '(点击时间进行快速编辑)' : '(Click time to quick edit)',
  };

  const handleReset = () => {
    // No confirmation needed
    setIsRunning(false);
    setTimeLeft(initialTotalSeconds);
    if (isEditingTime) setIsEditingTime(false);
  };

  const adjustCurrentTime = (seconds: number) => {
    if (isRunning) return;
    setTimeLeft(prevTime => {
      const newTime = prevTime + seconds;
      return Math.max(0, Math.min(newTime, initialTotalSeconds)); // Ensure time stays within bounds
    });
  };

  const handleTimeDisplayClick = () => {
    if (!isRunning) {
      setEditTimeValue(formatTime(timeLeft)); // Initialize with current time
      setIsEditingTime(true);
    }
  };

  const handleTimeEditSubmit = () => {
    if (!isEditingTime) return;
    const newTotalSeconds = parseFormattedTimeToSeconds(editTimeValue);
    if (newTotalSeconds !== -1) {
      setTimeLeft(Math.max(0, Math.min(newTotalSeconds, initialTotalSeconds)));
    }
    setIsEditingTime(false);
  };

  const handleTimeEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTimeEditSubmit();
    } else if (event.key === 'Escape') {
      setIsEditingTime(false);
      setEditTimeValue(formatTime(timeLeft)); // Reset to current time if escaped
    }
  };

  const progressPercentage = initialTotalSeconds > 0 ? (timeLeft / initialTotalSeconds) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center">{T.timeLeftTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6">
        {isEditingTime && !isRunning ? (
          <Input
            ref={timeInputRef}
            type="text"
            value={editTimeValue}
            onChange={(e) => setEditTimeValue(e.target.value)}
            onBlur={handleTimeEditSubmit}
            onKeyDown={handleTimeEditKeyDown}
            className="text-5xl md:text-7xl font-mono font-bold tabular-nums text-center h-auto p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            style={{ color: timeLeft <= 300 && timeLeft > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))', width: 'fit-content', minWidth: '280px' }}

          />
        ) : (
          <div 
            className="text-5xl md:text-7xl font-mono font-bold tabular-nums cursor-pointer"
            style={{ color: timeLeft <= 300 && timeLeft > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))' }}
            onClick={handleTimeDisplayClick}
            title={!isRunning ? (language === 'zh' ? '点击编辑时间' : 'Click to edit time') : undefined}
          >
            {formatTime(timeLeft)}
          </div>
        )}
        {!isRunning && <p className="text-xs text-muted-foreground">{T.quickEditHint}</p>}

        <Progress value={progressPercentage} className="w-full h-3" />
        
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          {/* Main Controls */}
          <div className="flex justify-center space-x-2 w-full">
            <Button onClick={handleStart} disabled={isRunning || timeLeft === 0} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Icons.Play className="mr-2 h-5 w-5" /> {T.start}
            </Button>
            <Button onClick={handleStop} disabled={!isRunning} variant="secondary" className="flex-1">
              <Icons.Pause className="mr-2 h-5 w-5" /> {T.stop}
            </Button>
            <Button onClick={handleReset} variant="destructive" className="flex-1">
              <Icons.RotateCcw className="mr-2 h-5 w-5" /> {T.reset}
            </Button>
          </div>

          <Separator className="my-4 w-3/4" />

          {/* Time Adjustment Controls */}
          <div className="w-full">
            <p className="text-sm text-center text-muted-foreground mb-2">{T.adjustTimeLabel}</p>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => adjustCurrentTime(-300)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Minus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{T.m5}</span><span className="sm:hidden">-5m</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(-60)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Minus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{T.m1}</span><span className="sm:hidden">-1m</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(-30)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Minus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{T.s30}</span><span className="sm:hidden">-30s</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(30)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{T.s30}</span><span className="sm:hidden">+30s</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(60)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{T.m1}</span><span className="sm:hidden">+1m</span>
              </Button>
              <Button onClick={() => adjustCurrentTime(300)} variant="outline" size="sm" disabled={isRunning} className="px-2">
                <Icons.Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{T.m5}</span><span className="sm:hidden">+5m</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

