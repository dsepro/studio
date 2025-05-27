
"use client";

import { useState, useEffect, useMemo } from 'react';
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
import { Icons } from "@/components/icons"; // For Download icon
import type { ExamDetails } from '@/app/page';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { examPresets, type ExamPreset } from '@/lib/exam-presets';
import { useToast } from "@/hooks/use-toast";


interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: ExamDetails;
  onSave: (newDetails: ExamDetails) => void;
  language: string; // App's current display language ('en' or 'zh-hk')
  currentAppLanguage: string; // To ensure preset titles are displayed correctly
}

export function ExamSetupModal({ isOpen, onClose, currentDetails, onSave, language, currentAppLanguage }: ExamSetupModalProps) {
  const [details, setDetails] = useState<ExamDetails>(currentDetails);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    setDetails(currentDetails);
    // Try to find if currentDetails match any preset to pre-select it
    const matchedPreset = examPresets.find(p => 
      (currentAppLanguage === 'zh-hk' ? p.zhTitle : p.enTitle) === currentDetails.title &&
      p.durationMinutes === currentDetails.durationMinutes
    );
    setSelectedPresetId(matchedPreset ? matchedPreset.id : "");
  }, [currentDetails, isOpen, currentAppLanguage]);

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const selectedPreset = examPresets.find(p => p.id === presetId);
    if (selectedPreset) {
      const presetTitle = currentAppLanguage === 'zh-hk' ? selectedPreset.zhTitle : selectedPreset.enTitle;
      setDetails({
        title: presetTitle,
        subject: presetTitle, // Use preset title as subject
        paper: "", // User to fill paper for presets
        durationMinutes: selectedPreset.durationMinutes,
        centreName: "", 
        centreNumber: "",
        examStartTime: "00:00",
        examEndTime: "00:00",
        examLanguage: currentAppLanguage as 'en' | 'zh-hk', // Default exam language to app language
      });
    } else {
      // If "Custom Input" or no preset is selected, reset to current or allow full manual input
      // For now, let's revert to currentDetails or an empty slate if preferred
      setDetails(currentDetails); 
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedPresetId(""); // Clear preset selection on manual change
    setDetails(prev => ({ 
      ...prev, 
      [name]: name === "durationMinutes" ? (parseInt(value, 10) || 0) : value 
    }));
  };
  
  const handleExamLanguageChange = (lang: 'en' | 'zh-hk') => {
    setSelectedPresetId(""); 
    setDetails(prev => ({ ...prev, examLanguage: lang }));
  };

  const handleSave = () => {
    onSave(details);
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
    // modalDescription: language === 'zh-hk' ? '配置目前考試的詳細資訊，或從預設集中選擇。' : 'Configure the details for the current exam, or choose from a preset.',
    
    centreInformationTitle: language === 'zh-hk' ? '中心資訊' : 'Centre Information',
    centreNameLabel: language === 'zh-hk' ? '中心名稱:' : 'Centre Name:',
    centreNumberLabel: language === 'zh-hk' ? '中心編號:' : 'Centre Number:',

    examDetailsTitle: language === 'zh-hk' ? '考試詳情' : 'Exam Details',
    subjectLabel: language === 'zh-hk' ? '科目:' : 'Subject:',
    paperLabel: language === 'zh-hk' ? '試卷:' : 'Paper:',
    selectPresetLabel: language === 'zh-hk' ? '選擇預設考試:' : 'Select Preset Exam:',
    selectPresetPlaceholder: language === 'zh-hk' ? '選擇或手動輸入...' : 'Select or input manually...',
    customPresetOption: language === 'zh-hk' ? '手動輸入' : 'Manual Input',


    timingTitle: language === 'zh-hk' ? '時間安排' : 'Timing',
    durationMinutesLabel: language === 'zh-hk' ? '時長 (分鐘):' : 'Duration (Minutes):',
    examTimeLabel: language === 'zh-hk' ? '考試時間:' : 'Exam Time:',
    examStartTimeLabel: language === 'zh-hk' ? '由' : 'From',
    examEndTimeLabel: language === 'zh-hk' ? '至' : 'To',
    
    examLanguageTitle: language === 'zh-hk' ? '試卷語言' : 'Exam Language',
    languageLabel: language === 'zh-hk' ? '語言:' : 'Language:',
    langZhHkButton: language === 'zh-hk' ? '中文' : '中文',
    langEnButton: language === 'zh-hk' ? 'English' : 'English',

    downloadAppButton: language === 'zh-hk' ? '下載應用程式' : 'Download App',
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
          {/* <DialogDescription>{T.modalDescription}</DialogDescription> */}
        </DialogHeader>
        <ScrollArea className="h-[65vh] p-1 pr-4">
          <div className="space-y-6 py-4 pr-2">
            
            {/* Preset Selector */}
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

            {/* Centre Information */}
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.centreInformationTitle}</h3>
              <div>
                <Label htmlFor="centreName" className="text-foreground/90">{T.centreNameLabel}</Label>
                <Input id="centreName" name="centreName" value={details.centreName} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
              <div>
                <Label htmlFor="centreNumber" className="text-foreground/90">{T.centreNumberLabel}</Label>
                <Input id="centreNumber" name="centreNumber" value={details.centreNumber} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
            </div>

            {/* Exam Details */}
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.examDetailsTitle}</h3>
              <div>
                <Label htmlFor="subject" className="text-foreground/90">{T.subjectLabel}</Label>
                <Input id="subject" name="subject" value={details.subject} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
              <div>
                <Label htmlFor="paper" className="text-foreground/90">{T.paperLabel}</Label>
                <Input id="paper" name="paper" value={details.paper} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
               {/* Hidden title input for preset consistency, or could be removed if subject+paper is always the title */}
              <Input type="hidden" id="title" name="title" value={details.title} onChange={handleChange} />
            </div>

            {/* Timing */}
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.timingTitle}</h3>
              <div>
                <Label htmlFor="durationMinutes" className="text-foreground/90">{T.durationMinutesLabel}</Label>
                <Input id="durationMinutes" name="durationMinutes" type="number" value={details.durationMinutes} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
              </div>
              <div>
                <Label className="text-foreground/90">{T.examTimeLabel}</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input id="examStartTime" name="examStartTime" type="time" value={details.examStartTime} onChange={handleChange} className="bg-input text-input-foreground border-border" aria-label={T.examStartTimeLabel} />
                  <span>-</span>
                  <Input id="examEndTime" name="examEndTime" type="time" value={details.examEndTime} onChange={handleChange} className="bg-input text-input-foreground border-border" aria-label={T.examEndTimeLabel}/>
                </div>
              </div>
            </div>
            
            {/* Exam Language */}
            <div className="space-y-2 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-foreground">{T.examLanguageTitle}</h3>
              <Label className="text-foreground/90">{T.languageLabel}</Label>
              <div className="flex space-x-2 mt-1">
                <Button
                  variant={details.examLanguage === 'zh-hk' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('zh-hk')}
                >
                  {T.langZhHkButton}
                </Button>
                <Button
                  variant={details.examLanguage === 'en' ? 'default' : 'outline'}
                  onClick={() => handleExamLanguageChange('en')}
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
