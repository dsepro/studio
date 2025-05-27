
"use client";

import { useState, useEffect } from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils'; // Import cn

interface MainClockProps {
  language: string;
  className?: string; // Add className prop
}

export function MainClock({ language, className }: MainClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    const locale = language === 'zh-hk' ? 'zh-HK' : 'en-GB'; // en-GB for 24-hour English
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23' // Explicitly ensure 24-hour format
    });
  };
  
  // Initialize with a static placeholder string to prevent hydration mismatch
  const [displayTime, setDisplayTime] = useState<string>("00:00:00");

  useEffect(() => {
    // This function will run only on the client side after hydration
    const updateClock = () => {
      const now = new Date();
      const locale = language === 'zh-hk' ? 'zh-HK' : 'en-GB'; // en-GB for 24-hour English
      const timeString = now.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23' // Explicitly ensure 24-hour format
      });
      setDisplayTime(timeString);
    };

    updateClock(); // Set the correct time as soon as the client mounts
    const timerId = setInterval(updateClock, 1000); // Continue updating every second

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, [language]); // Rerun effect if language changes


  return (
    <div className={cn("flex items-center space-x-2", className)}> {/* Use cn for className */}
      <Icons.ClockIcon className="h-5 w-5" />
      <span>{displayTime}</span>
    </div>
  );
}
