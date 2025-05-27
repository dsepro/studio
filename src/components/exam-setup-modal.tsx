
"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import type { ExamDetails } from '@/app/page';
import { ScrollArea } from './ui/scroll-area';

// Helper to derive title from subject and paper
const deriveTitle = (subject: string, paper: string, lang: string): string => {
  const s = subject?.trim() || "";
  const p = paper?.trim() || "";
  if (!s && !p) return lang === 'zh-hk' ? '自訂考試' : 'Custom Exam';
  return `${s}${p ? ` ${p}` : ""}`.trim();
};

const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime || durationMinutes < 0) return "";

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  if (isNaN(startHours) || isNaN(startMinutes)) return "";

  const totalStartMinutes = startHours * 60 + startMinutes;
  const totalEndMinutes = totalStartMinutes + durationMinutes;

  const endHours = Math.floor(totalEndMinutes / 60) % 24;
  const endMinutes = totalEndMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: ExamDetails;
  onSave: (details: ExamDetails) => void;
  currentAppLanguage: string;
}

export function ExamSetupModal({
  isOpen,
  onClose,
  currentDetails,
  onSave,
  currentAppLanguage,
}: ExamSetupModalProps) {
  const [formState, setFormState] = useState<ExamDetails>(currentDetails);

  useEffect(() => {
    if (isOpen) {
      let initialStartTime = currentDetails.examStartTime || "08:30";
      let initialDuration = currentDetails.durationMinutes >= 0 ? currentDetails.durationMinutes : 90;
      let initialEndTime = currentDetails.examEndTime || calculateEndTime(initialStartTime, initialDuration);

      if ((!currentDetails.examEndTime && initialStartTime && initialDuration >= 0) || (currentDetails.examEndTime !== calculateEndTime(initialStartTime, initialDuration))) {
        initialEndTime = calculateEndTime(initialStartTime, initialDuration);
      }

      const initialTitle = currentDetails.title || deriveTitle(currentDetails.subject, currentDetails.paper, currentAppLanguage);

      setFormState({
        ...currentDetails,
        title: initialTitle,
        examStartTime: initialStartTime,
        durationMinutes: initialDuration,
        examEndTime: initialEndTime,
      });
    }
  }, [currentDetails, isOpen, currentAppLanguage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormState(prevFormState => {
      const updatedFormState = { ...prevFormState, [name]: value };

      if (name === "durationMinutes") {
        const newDuration = Math.max(0, parseInt(value, 10) || 0);
        updatedFormState.durationMinutes = newDuration;
        updatedFormState.examEndTime = calculateEndTime(updatedFormState.examStartTime, newDuration);
      } else if (name === "examStartTime") {
        updatedFormState.examEndTime = calculateEndTime(value, updatedFormState.durationMinutes);
      }

      if (name === "subject" || name === "paper") {
        updatedFormState.title = deriveTitle(updatedFormState.subject, updatedFormState.paper, currentAppLanguage);
      }
      return updatedFormState;
    });
  }, [currentAppLanguage]);

  const adjustDuration = (amount: number) => {
    setFormState(prev => {
      const newDuration = Math.max(0, (prev.durationMinutes || 0) + amount);
      const newEndTime = calculateEndTime(prev.examStartTime, newDuration);
      return {
        ...prev,
        durationMinutes: newDuration,
        title: deriveTitle(prev.subject, prev.paper, currentAppLanguage),
        examEndTime: newEndTime,
      };
    });
  };

  const handleExamLanguageChange = (lang: 'en' | 'zh-hk') => {
    setFormState(prev => ({ ...prev, examLanguage: lang }));
  };

  const handleSave = () => {
    let finalDetails = { ...formState };
    finalDetails.title = deriveTitle(finalDetails.subject, finalDetails.paper, currentAppLanguage);
    if (!finalDetails.title.trim()) {
      finalDetails.title = currentAppLanguage === 'zh-hk' ? '自訂考試' : 'Custom Exam';
    }
    finalDetails.examEndTime = calculateEndTime(finalDetails.examStartTime, finalDetails.durationMinutes);
    onSave(finalDetails);
    onClose();
  };

  const T = {
    modalTitle: currentAppLanguage === 'zh-hk' ? '考試設定' : 'Exam Setup',
    centreInformationTitle: currentAppLanguage === 'zh-hk' ? '中心資訊' : 'Centre Information',
    centreNameLabel: currentAppLanguage === 'zh-hk' ? '考埸名稱:' : 'Centre Name:',
    centreNumberLabel: currentAppLanguage === 'zh-hk' ? '考埸編號:' : 'Centre Number:',
    examDetailsTitle: currentAppLanguage === 'zh-hk' ? '考試詳情' : 'Exam Details',
    subjectLabel: currentAppLanguage === 'zh-hk' ? '科目:' : 'Subject:',
    paperLabel: currentAppLanguage === 'zh-hk' ? '試卷:' : 'Paper:',
    timingTitle: currentAppLanguage === 'zh-hk' ? '時間安排' : 'Timing',
    durationMinutesLabel: currentAppLanguage === 'zh-hk' ? '時長 (分鐘):' : 'Duration (Minutes):',
    examTimeLabel: currentAppLanguage === 'zh-hk' ? '考試時間:' : 'Exam Time:',
    examStartTimeLabel: currentAppLanguage === 'zh-hk' ? '由' : 'From',
    examEndTimeLabel: currentAppLanguage === 'zh-hk' ? '至' : 'To',
    examLanguageTitle: currentAppLanguage === 'zh-hk' ? '試卷語言' : 'Exam Language',
    languageLabel: currentAppLanguage === 'zh-hk' ? '語言:' : 'Language:',
    langZhHkButton: currentAppLanguage === 'zh-hk' ? '中文' : '中文',
    langEnButton: currentAppLanguage === 'zh-hk' ? 'English' : 'English',
    cancelButton: currentAppLanguage === 'zh-hk' ? '取消' : 'Cancel',
    confirmAndCloseButton: currentAppLanguage === 'zh-hk' ? '確認並關閉' : 'Confirm & Close',
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{T.modalTitle}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1 pr-3"> {/* Reduced right padding for scroll area */}
          <div className="space-y-4 py-3 pr-1"> {/* Reduced py and pr, reduced space-y */}

            <div className="space-y-3 p-3 border rounded-md"> {/* Reduced p and space-y */}
              <h3 className="text-lg font-semibold text-foreground">{T.centreInformationTitle}</h3>
              <div>
                <Label htmlFor="centreName" className="text-foreground/90 text-sm">{T.centreNameLabel}</Label>
                <Input id="centreName" name="centreName" value={formState.centreName} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border h-9 text-sm" /> {/* Reduced height and text size */}
              </div>
              <div>
                <Label htmlFor="centreNumber" className="text-foreground/90 text-sm">{T.centreNumberLabel}</Label>
                <Input id="centreNumber" name="centreNumber" value={formState.centreNumber} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border h-9 text-sm" />
              </div>
            </div>

            <div className="space-y-3 p-3 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.examDetailsTitle}</h3>
              <div>
                <Label htmlFor="subject" className="text-foreground/90 text-sm">{T.subjectLabel}</Label>
                <Input id="subject" name="subject" value={formState.subject} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border h-9 text-sm" />
              </div>
              <div>
                <Label htmlFor="paper" className="text-foreground/90 text-sm">{T.paperLabel}</Label>
                <Input id="paper" name="paper" value={formState.paper} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border h-9 text-sm" />
              </div>
            </div>

            <div className="space-y-3 p-3 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.timingTitle}</h3>
              <div>
                <Label htmlFor="durationMinutes" className="text-foreground/90 text-sm">{T.durationMinutesLabel}</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => adjustDuration(-1)} aria-label={currentAppLanguage === 'zh-hk' ? '減少1分鐘' : 'Decrease 1 minute'}>
                    <Icons.Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="durationMinutes"
                    name="durationMinutes"
                    type="number"
                    value={formState.durationMinutes}
                    onChange={handleInputChange}
                    className="bg-input text-input-foreground border-border text-center flex-1 h-9 text-sm"
                    min="0"
                  />
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => adjustDuration(1)} aria-label={currentAppLanguage === 'zh-hk' ? '增加1分鐘' : 'Increase 1 minute'}>
                    <Icons.Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-foreground/90 text-sm">{T.examTimeLabel}</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input id="examStartTime" name="examStartTime" type="time" value={formState.examStartTime} onChange={handleInputChange} className="bg-input text-input-foreground border-border h-9 text-sm" aria-label={T.examStartTimeLabel} />
                  <span className="text-sm">-</span>
                  <Input id="examEndTime" name="examEndTime" type="time" value={formState.examEndTime} readOnly className="bg-input text-input-foreground border-border h-9 text-sm" aria-label={T.examEndTimeLabel}/>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3 border rounded-md"> {/* Reduced p */}
              <h3 className="text-lg font-semibold text-foreground">{T.examLanguageTitle}</h3>
              <Label className="text-foreground/90 text-sm">{T.languageLabel}</Label>
              <div className="flex space-x-2 mt-1">
                <Button
                  variant={formState.examLanguage === 'zh-hk' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('zh-hk')}
                  size="sm" /* Smaller button */
                >
                  {T.langZhHkButton}
                </Button>
                <Button
                  variant={formState.examLanguage === 'en' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('en')}
                  size="sm" /* Smaller button */
                >
                  {T.langEnButton}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex-col sm:flex-row sm:justify-end pt-3"> {/* Reduced pt */}
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} size="sm">{T.cancelButton}</Button>
            <Button onClick={handleSave} size="sm">{T.confirmAndCloseButton}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
