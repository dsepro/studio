"use client";

import { useState, useEffect } from 'react';
import { Icons } from '@/components/icons';

export function MainClock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <Icons.ClockIcon className="h-5 w-5" />
      <span>{formatTime(currentTime)}</span>
    </div>
  );
}
