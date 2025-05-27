
"use client";

import { useState, useEffect } from 'react';
import { Icons } from '@/components/icons';

export function MainClock() {
  // Initialize with a static placeholder string to prevent hydration mismatch
  const [formattedTime, setFormattedTime] = useState<string>("00:00:00");

  useEffect(() => {
    // This function will run only on the client side after hydration
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      setFormattedTime(timeString);
    };

    updateClock(); // Set the correct time as soon as the client mounts
    const timerId = setInterval(updateClock, 1000); // Continue updating every second

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []); // Empty dependency array ensures this effect runs only once on the client after mount

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <Icons.ClockIcon className="h-5 w-5" />
      <span>{formattedTime}</span>
    </div>
  );
}
