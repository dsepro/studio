
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeInSeconds: number;
  onSave: (newTimeInSeconds: number) => void;
  language: string;
  maxTimeInSeconds: number;
}

export function TimeEditModal({
  isOpen,
  onClose,
  currentTimeInSeconds,
  onSave,
  language,
  maxTimeInSeconds,
}: TimeEditModalProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHours(Math.floor(currentTimeInSeconds / 3600));
      setMinutes(Math.floor((currentTimeInSeconds % 3600) / 60));
      setSeconds(currentTimeInSeconds % 60);
    }
  }, [isOpen, currentTimeInSeconds]);

  const handleSave = () => {
    let newTotalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    newTotalSeconds = Math.max(0, newTotalSeconds); // Ensure not negative
    newTotalSeconds = Math.min(newTotalSeconds, maxTimeInSeconds); // Ensure not over max
    onSave(newTotalSeconds);
    onClose();
  };

  const T = {
    modalTitle: language === 'zh-hk' ? '編輯時間' : 'Edit Time',
    modalDescription: language === 'zh-hk' ? '設定新的剩餘時間。' : 'Set the new remaining time.',
    hoursLabel: language === 'zh-hk' ? '小時' : 'Hours',
    minutesLabel: language === 'zh-hk' ? '分鐘' : 'Minutes',
    secondsLabel: language === 'zh-hk' ? '秒' : 'Seconds',
    cancelButton: language === 'zh-hk' ? '取消' : 'Cancel',
    saveButton: language === 'zh-hk' ? '儲存' : 'Save',
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{T.modalTitle}</DialogTitle>
          <DialogDescription>{T.modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div>
            <Label htmlFor="hours" className="text-right">
              {T.hoursLabel}
            </Label>
            <Input
              id="hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="col-span-2 h-10 text-center"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="minutes" className="text-right">
              {T.minutesLabel}
            </Label>
            <Input
              id="minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              className="col-span-2 h-10 text-center"
              min="0"
              max="59"
            />
          </div>
          <div>
            <Label htmlFor="seconds" className="text-right">
              {T.secondsLabel}
            </Label>
            <Input
              id="seconds"
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              className="col-span-2 h-10 text-center"
              min="0"
              max="59"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {T.cancelButton}
          </Button>
          <Button onClick={handleSave}>{T.saveButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
