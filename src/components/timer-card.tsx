
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import useLocalStorage from '@/hooks/use-local-storage';
import { TimeEditModal } from './time-edit-modal'; 

interface TimerCardProps {
  initialDurationMinutes?: number;
  language: string;
  onOpenConfirmation: (title: string, description: string, onConfirm: () => void) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function TimerCard({ 
  initialDurationMinutes = 90, 
  language,
  onOpenConfirmation
}: TimerCardProps) { 
  const [initialTotalSeconds, setInitialTotalSeconds] = useLocalStorage<number>('timerInitialSeconds', initialDurationMinutes * 60);
  const [timeLeft, setTimeLeft] = useLocalStorage<number>('timerTimeLeft', initialTotalSeconds);
  const [isRunning, setIsRunning] = useLocalStorage<boolean>('timerIsRunning', false);
  
  const [isTimeEditModalOpen, setIsTimeEditModalOpen] = useState(false);

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
    }
    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, setTimeLeft, setIsRunning]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);

  const T = {
    timeLeftTitle: language === 'zh-hk' ? '剩餘時間' : 'Time Left',
    start: language === 'zh-hk' ? '開始' : 'Start',
    stop: language === 'zh-hk' ? '停止' : 'Stop',
    reset: language === 'zh-hk' ? '重設' : 'Reset',
    editTime: language === 'zh-hk' ? '編輯時間' : 'Edit Time',
    confirmResetTitle: language === 'zh-hk' ? '重設計時器？' : 'Reset Timer?',
    confirmResetDescription: language === 'zh-hk' ? '您確定要將計時器重設為其初始持續時間嗎？' : 'Are you sure you want to reset the timer to its initial duration?',
  };

  const handleReset = () => {
    // Removed confirmation dialog as per previous request
    setIsRunning(false);
    setTimeLeft(initialTotalSeconds);
  };
  
  const adjustCurrentTimeByOneMinute = (amount: number) => {
    if (isRunning) return;
    setTimeLeft(prevTime => {
      const newTime = prevTime + (amount * 60);
      // Ensure newTime is not less than 0 and not more than a reasonable maximum (e.g., 24 hours from initialTotalSeconds or current timeLeft)
      const maxAllowed = Math.max(initialTotalSeconds, prevTime) + (24 * 3600); // cap at 24 hours more than initial or current
      return Math.max(0, Math.min(newTime, maxAllowed)); 
    });
  };

  const handleTimeDisplayClick = () => {
    if (!isRunning) {
      setIsTimeEditModalOpen(true);
    }
  };

  const handleSaveEditedTime = (newTimeInSeconds: number) => {
    setTimeLeft(newTimeInSeconds);
    // If the user sets a time GREATER than the current initialTotalSeconds,
    // update initialTotalSeconds to this new, larger value.
    // This allows "Edit Time" to effectively increase the total possible duration.
    if (newTimeInSeconds > initialTotalSeconds) {
        setInitialTotalSeconds(newTimeInSeconds);
    }
  };

  // Determine the maximum time for the edit modal. 
  // It should be at least the initialTotalSeconds, or if timeLeft is already greater (due to past edits), use that.
  // Add a buffer (e.g., 10 hours) to allow increasing time significantly.
  const maxTimeForModal = Math.max(initialTotalSeconds, timeLeft) + (10 * 3600);


  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-lg md:text-xl text-center font-medium text-muted-foreground">{T.timeLeftTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4 sm:space-y-6 px-4 py-2 sm:py-6">
          <div className="flex items-center justify-center w-full space-x-2 sm:space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-timer-adjust-btn hover:bg-timer-adjust-btn-hover" 
              onClick={() => adjustCurrentTimeByOneMinute(-1)} 
              disabled={isRunning}
              aria-label={language === 'zh-hk' ? "減少1分鐘" : "Decrease 1 minute"}
            >
              <Icons.Minus className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <div 
              className="text-6xl sm:text-7xl md:text-8xl font-mono font-extrabold tabular-nums select-none flex-shrink min-w-0" // Added flex-shrink and min-w-0
              style={{ 
                color: timeLeft <= 300 && timeLeft > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))',
                cursor: isRunning ? 'default' : 'pointer'
              }}
              onClick={handleTimeDisplayClick}
              title={!isRunning ? T.editTime : undefined}
            >
              {formatTime(timeLeft)}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-timer-adjust-btn hover:bg-timer-adjust-btn-hover"
              onClick={() => adjustCurrentTimeByOneMinute(1)} 
              disabled={isRunning}
              aria-label={language === 'zh-hk' ? "增加1分鐘" : "Increase 1 minute"}
            >
              <Icons.Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
          
          <div className="flex justify-center space-x-2 sm:space-x-3 w-full max-w-xs sm:max-w-sm pt-2">
            <Button 
              onClick={handleStart} 
              disabled={isRunning || timeLeft === 0} 
              className="flex-1 text-xs sm:text-sm py-2 h-9 sm:h-10 bg-primary text-primary-foreground hover:bg-primary/90"
            >
               {T.start}
            </Button>
            <Button 
              onClick={handleStop} 
              disabled={!isRunning} 
              variant="secondary" 
              className="flex-1 text-xs sm:text-sm py-2 h-9 sm:h-10 bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
               {T.stop}
            </Button>
            <Button 
              onClick={handleReset} 
              variant="destructive" 
              className="flex-1 text-xs sm:text-sm py-2 h-9 sm:h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
               {T.reset}
            </Button>
          </div>
        </CardContent>
      </Card>
      <TimeEditModal
        isOpen={isTimeEditModalOpen}
        onClose={() => setIsTimeEditModalOpen(false)}
        currentTimeInSeconds={timeLeft}
        onSave={handleSaveEditedTime}
        language={language}
        maxTimeInSeconds={maxTimeForModal} 
      />
    </>
  );
}
