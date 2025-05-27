
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { examPresets } from '@/lib/exam-presets';
import { useToast } from "@/hooks/use-toast";

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: ExamDetails;
  onSave: (newDetails: ExamDetails) => void;
  language: string; // App display language (zh-hk or en)
  currentAppLanguage: string; // App display language, passed explicitly for preset title localization
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
  language, 
  currentAppLanguage 
}: ExamSetupModalProps) {
  const [formState, setFormState] = useState<ExamDetails>(currentDetails);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const { toast } = useToast();

  // Effect to initialize form when modal opens or currentDetails/language changes
  useEffect(() => {
    if (isOpen) {
      setFormState(currentDetails);
      const matchedPreset = examPresets.find(p => {
        const presetTitle = currentAppLanguage === 'zh-hk' ? p.zhTitle : p.enTitle;
        return presetTitle === currentDetails.title && p.durationMinutes === currentDetails.durationMinutes;
      });
      setSelectedPresetId(matchedPreset ? matchedPreset.id : "");
    }
  }, [currentDetails, isOpen, currentAppLanguage]);


  const handlePresetChange = useCallback((newPresetId: string) => {
    setSelectedPresetId(newPresetId);
    const selectedPreset = examPresets.find(p => p.id === newPresetId);

    if (selectedPreset) {
      const presetTitle = currentAppLanguage === 'zh-hk' ? selectedPreset.zhTitle : selectedPreset.enTitle;
      setFormState(prev => ({
        ...prev, // Keep existing centreName, centreNumber, examStartTime, examEndTime, examLanguage
        title: presetTitle,
        subject: presetTitle,
        paper: "", // Clear paper when selecting a preset
        durationMinutes: selectedPreset.durationMinutes,
      }));
    } else {
      // Switched to "Manual Input"
      setFormState(prev => ({
        ...prev,
        title: deriveTitle(prev.subject, prev.paper),
      }));
    }
  }, [currentAppLanguage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumericField = name === "durationMinutes";
    const newValue = isNumericField ? (Math.max(0, parseInt(value, 10)) || 0) : value;

    setFormState(prevFormState => {
      const updatedFormState = {
        ...prevFormState,
        [name]: newValue,
      };

      let newSelectedPresetId = selectedPresetId;

      // Invalidate preset if core fields (subject, duration) change
      if (selectedPresetId) {
        const activePreset = examPresets.find(p => p.id === selectedPresetId);
        if (activePreset) {
          const presetSubject = currentAppLanguage === 'zh-hk' ? activePreset.zhTitle : activePreset.enTitle;
          if ( (name === "subject" && updatedFormState.subject !== presetSubject) ||
               (name === "durationMinutes" && updatedFormState.durationMinutes !== activePreset.durationMinutes)
             ) {
            newSelectedPresetId = ""; // Invalidate preset
          }
        }
      }
      
      // If now in manual mode (or was already) and subject/paper changed, update title
      if (newSelectedPresetId === "" && (name === "subject" || name === "paper")) {
        updatedFormState.title = deriveTitle(updatedFormState.subject, updatedFormState.paper);
      } else if (newSelectedPresetId !== "" && (name === "subject" || name === "durationMinutes")) {
        // If a preset is active but subject/duration changed to invalidate it, title should reflect new subject/paper
         updatedFormState.title = deriveTitle(updatedFormState.subject, updatedFormState.paper);
      }


      if (newSelectedPresetId !== selectedPresetId) {
        setSelectedPresetId(newSelectedPresetId);
      }
      
      return updatedFormState;
    });
  }, [selectedPresetId, currentAppLanguage]);
  
  const handleExamLanguageChange = (lang: 'en' | 'zh-hk') => {
    setFormState(prev => ({ ...prev, examLanguage: lang }));
  };

  const handleSave = () => {
    let finalDetails = { ...formState };
    const activePreset = examPresets.find(p => p.id === selectedPresetId);

    if (activePreset) {
      // If a preset is still selected, it implies subject and duration match it.
      // Use its localized title.
      finalDetails.title = currentAppLanguage === 'zh-hk' ? activePreset.zhTitle : activePreset.enTitle;
      finalDetails.subject = finalDetails.title; // Subject should also match preset title
      // Paper can be custom even with a preset, title is primarily from preset.
    } else {
      // Manual mode: derive title from subject and paper.
      finalDetails.title = deriveTitle(finalDetails.subject, finalDetails.paper);
    }

    // If title is still empty (e.g., subject and paper are empty in manual mode), provide a default.
    if (!finalDetails.title.trim()) {
      finalDetails.title = language === 'zh-hk' ? '自訂考試' : 'Custom Exam';
    }
    
    onSave(finalDetails);
    onClose();
  };

  const handleDownloadAppInfo = () => {
    toast({
      title: language === 'zh-hk' ? "應用程式安裝 (PWA)" : "App Installation (PWA)",
      description: (
        <div>
          <p>{language === 'zh-hk' ? "此應用程式是一個漸進式網絡應用程式 (PWA)，可以安裝在您的裝置上。" : "This application is a Progressive Web App (PWA) and can be installed on your device."}</p>
          <p>{language === 'zh-hk' ? "在瀏覽器的選單中查找「安裝」、「新增至主畫面」或類似選項，即可離線使用並獲得類似原生應用程式的體驗。" : "Look for an \"Install,\" \"Add to Home Screen,\" or similar option in your browser's menu to use it offline and like a native app."}</p>
        </div>
      ),
      duration: 10000,
    });
  };

  const T = {
    modalTitle: language === 'zh-hk' ? '考試設定' : 'Exam Setup',
    selectPresetLabel: language === 'zh-hk' ? '選擇預設考試:' : 'Select Preset Exam:',
    selectPresetPlaceholder: language === 'zh-hk' ? '選擇或手動輸入...' : 'Select or input manually...',
    customPresetOption: language === 'zh-hk' ? '手動輸入' : 'Manual Input',
    
    centreInformationTitle: language === 'zh-hk' ? '中心資訊' : 'Centre Information',
    centreNameLabel: language === 'zh-hk' ? '中心名稱:' : 'Centre Name:',
    centreNumberLabel: language === 'zh-hk' ? '中心編號:' : 'Centre Number:',
    
    examDetailsTitle: language === 'zh-hk' ? '考試詳情' : 'Exam Details',
    subjectLabel: language === 'zh-hk' ? '科目:' : 'Subject:',
    paperLabel: language === 'zh-hk' ? '試卷:' : 'Paper:',
    
    timingTitle: language === 'zh-hk' ? '時間安排' : 'Timing',
    durationMinutesLabel: language === 'zh-hk' ? '時長 (分鐘):' : 'Duration (Minutes):',
    examTimeLabel: language === 'zh-hk' ? '考試時間:' : 'Exam Time:',
    examStartTimeLabel: language === 'zh-hk' ? '由' : 'From',
    examEndTimeLabel: language === 'zh-hk' ? '至' : 'To',
    
    examLanguageTitle: language === 'zh-hk' ? '試卷語言' : 'Exam Language',
    languageLabel: language === 'zh-hk' ? '語言:' : 'Language:',
    langZhHkButton: language === 'zh-hk' ? '中文' : '中文',
    langEnButton: language === 'zh-hk' ? 'English' : 'English',
    
    downloadAppButton: language === 'zh-hk' ? '下載應用程式資訊' : 'App Install Info',
    cancelButton: language === 'zh-hk' ? '取消' : 'Cancel',
    confirmAndCloseButton: language === 'zh-hk' ? '確認並關閉' : 'Confirm & Close',
  };

  const displayedPresets = useMemo(() => {
    return examPresets.map(preset => ({
      ...preset,
      displayTitle: currentAppLanguage === 'zh-hk' ? preset.zhTitle : preset.enTitle,
    })).sort((a,b) => a.displayTitle.localeCompare(b.displayTitle));
  }, [currentAppLanguage]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{T.modalTitle}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] p-1 pr-4">
          <div className="space-y-6 py-4 pr-2">
            
            <div>
              <Label htmlFor="preset-select" className="text-foreground/90 text-sm">{T.selectPresetLabel}</Label>
              <Select value={selectedPresetId} onValueChange={handlePresetChange}>
                <SelectTrigger id="preset-select" className="w-full mt-1">
                  <SelectValue placeholder={T.selectPresetPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{T.customPresetOption}</SelectItem>
                  {displayedPresets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.displayTitle} ({preset.durationMinutes} {language === 'zh-hk' ? '分鐘' : 'min'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                <Input id="durationMinutes" name="durationMinutes" type="number" value={formState.durationMinutes} onChange={handleInputChange} className="mt-1 bg-input text-input-foreground border-border" min="0" />
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
        <DialogFooter className="flex-col sm:flex-row sm:justify-between pt-4">
          <Button variant="outline" onClick={handleDownloadAppInfo} className="w-full sm:w-auto">
            <Icons.Download className="mr-2 h-4 w-4" /> {T.downloadAppButton}
          </Button>
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
            <Button variant="outline" onClick={onClose}>{T.cancelButton}</Button>
            <Button onClick={handleSave}>{T.confirmAndCloseButton}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    