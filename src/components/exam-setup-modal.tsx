
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
// import { useToast } from "@/hooks/use-toast"; // Removed

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: ExamDetails;
  onSave: (newDetails: ExamDetails) => void;
  currentAppLanguage: string; 
}

const deriveTitle = (subject: string, paper: string): string => {
  const s = subject?.trim() || "";
  const p = paper?.trim() || "";
  if (!s && !p) return "";
  return `${s}${p ? ` ${p}` : ""}`.trim();
};

export function ExamSetupModal({ 
  isOpen, 
  onClose, 
  currentDetails, 
  onSave, 
  currentAppLanguage 
}: ExamSetupModalProps) {
  const [formState, setFormState] = useState<ExamDetails>(currentDetails);
  // const { toast } = useToast(); // Removed

  useEffect(() => {
    if (isOpen) {
      let newTitle = currentDetails.title;
      const derived = deriveTitle(currentDetails.subject, currentDetails.paper);
      if (!newTitle && derived) {
        newTitle = derived;
      }
      
      setFormState({
        ...currentDetails,
        title: newTitle,
      });
    }
  }, [currentDetails, isOpen]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumericField = name === "durationMinutes";
    const newValue = isNumericField ? (Math.max(0, parseInt(value, 10)) || 0) : value;

    setFormState(prevFormState => {
      const updatedFormState = {
        ...prevFormState,
        [name]: newValue,
      };

      if (name === "subject" || name === "paper") {
        updatedFormState.title = deriveTitle(updatedFormState.subject, updatedFormState.paper);
      }
      
      return updatedFormState;
    });
  }, []);

  const adjustDuration = (amount: number) => {
    setFormState(prev => ({
      ...prev,
      durationMinutes: Math.max(0, (prev.durationMinutes || 0) + amount)
    }));
  };
  
  const handleExamLanguageChange = (lang: 'en' | 'zh-hk') => {
    setFormState(prev => ({ ...prev, examLanguage: lang }));
  };

  const handleSave = () => {
    let finalDetails = { ...formState };
    
    finalDetails.title = deriveTitle(finalDetails.subject, finalDetails.paper);

    if (!finalDetails.title.trim()) {
      finalDetails.title = currentAppLanguage === 'zh-hk' ? '自訂考試' : 'Custom Exam';
    }
    
    onSave(finalDetails);
    onClose();
  };

  const T = {
    modalTitle: currentAppLanguage === 'zh-hk' ? '考試設定' : 'Exam Setup',
    centreInformationTitle: currentAppLanguage === 'zh-hk' ? '中心資訊' : 'Centre Information',
    centreNameLabel: currentAppLanguage === 'zh-hk' ? '中心:' : 'Centre:',
    centreNumberLabel: currentAppLanguage === 'zh-hk' ? '考場:' : 'Venue:',
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
    // downloadAppButton: currentAppLanguage === 'zh-hk' ? '下載應用程式資訊' : 'App Install Info', // Removed
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
        <ScrollArea className="h-[65vh] p-1 pr-4">
          <div className="space-y-6 py-4 pr-2">
            
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.centreInformationTitle}</h3>
              <div>
                <Label htmlFor="centreName" className="text-foreground/90">{T.centreNameLabel}</Label>
                <Input id="centreName" name="centreName" value={formState.centreName} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
              <div>
                <Label htmlFor="centreNumber" className="text-foreground/90">{T.centreNumberLabel}</Label>
                <Input id="centreNumber" name="centreNumber" value={formState.centreNumber} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.examDetailsTitle}</h3>
              <div>
                <Label htmlFor="subject" className="text-foreground/90">{T.subjectLabel}</Label>
                <Input id="subject" name="subject" value={formState.subject} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
              <div>
                <Label htmlFor="paper" className="text-foreground/90">{T.paperLabel}</Label>
                <Input id="paper" name="paper" value={formState.paper} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.timingTitle}</h3>
              <div>
                <Label htmlFor="durationMinutes" className="text-foreground/90">{T.durationMinutesLabel}</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => adjustDuration(-1)} aria-label={currentAppLanguage === 'zh-hk' ? '減少1分鐘' : 'Decrease 1 minute'}>
                    <Icons.Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    id="durationMinutes" 
                    name="durationMinutes" 
                    type="number" 
                    value={formState.durationMinutes} 
                    onChange={handleInputChange} 
                    className="bg-input text-input-foreground border-border text-center flex-1 h-10" 
                    min="0" 
                  />
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => adjustDuration(1)} aria-label={currentAppLanguage === 'zh-hk' ? '增加1分鐘' : 'Increase 1 minute'}>
                    <Icons.Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-foreground/90">{T.examTimeLabel}</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input id="examStartTime" name="examStartTime" type="time" value={formState.examStartTime} onChange={handleInputChange} className="bg-input text-input-foreground border-border" aria-label={T.examStartTimeLabel} />
                  <span>-</span>
                  <Input id="examEndTime" name="examEndTime" type="time" value={formState.examEndTime} onChange={handleInputChange} className="bg-input text-input-foreground border-border" aria-label={T.examEndTimeLabel}/>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.examLanguageTitle}</h3>
              <Label className="text-foreground/90">{T.languageLabel}</Label>
              <div className="flex space-x-2 mt-1">
                <Button
                  variant={formState.examLanguage === 'zh-hk' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('zh-hk')}
                  className={formState.examLanguage === 'zh-hk' ? 'bg-primary text-primary-foreground' : ''}
                >
                  {T.langZhHkButton}
                </Button>
                <Button
                  variant={formState.examLanguage === 'en' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('en')}
                  className={formState.examLanguage === 'en' ? 'bg-primary text-primary-foreground' : ''}
                >
                  {T.langEnButton}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex-col sm:flex-row sm:justify-end pt-4">
          {/* Download App button removed from here */}
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose}>{T.cancelButton}</Button>
            <Button onClick={handleSave}>{T.confirmAndCloseButton}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
