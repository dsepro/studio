
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
import { Textarea } from "@/components/ui/textarea";
import type { ExamDetails } from '@/app/page';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { examPresets, formatDurationFromMinutes, type ExamPreset } from '@/lib/exam-presets';

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: ExamDetails;
  onSave: (newDetails: ExamDetails) => void;
  language: string;
}

export function ExamSetupModal({ isOpen, onClose, currentDetails, onSave, language }: ExamSetupModalProps) {
  const [details, setDetails] = useState<ExamDetails>(currentDetails);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  useEffect(() => {
    setDetails(currentDetails);
    const matchedPreset = examPresets.find(p => 
      (language === 'zh-hk' ? p.zhTitle : p.enTitle) === currentDetails.title &&
      formatDurationFromMinutes(p.durationMinutes, language) === currentDetails.timeAllowed
    );
    setSelectedPresetId(matchedPreset ? matchedPreset.id : "");
  }, [currentDetails, isOpen, language]);

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const selectedPreset = examPresets.find(p => p.id === presetId);
    if (selectedPreset) {
      const title = language === 'zh-hk' ? selectedPreset.zhTitle : selectedPreset.enTitle;
      setDetails({
        title: title,
        code: "PRESET", 
        subject: title, 
        timeAllowed: formatDurationFromMinutes(selectedPreset.durationMinutes, language),
        instructions: [], 
      });
    } else {
      setDetails(currentDetails); 
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedPresetId(""); 
    if (name === "instructions") {
      setDetails(prev => ({ ...prev, instructions: value.split('\n') }));
    } else {
      setDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(details);
    onClose();
  };

  const T = {
    modalTitle: language === 'zh-hk' ? '考試設定' : 'Exam Setup',
    modalDescription: language === 'zh-hk' ? '配置目前考試的詳細資訊，或從預設集中選擇。' : 'Configure the details for the current exam, or choose from a preset.',
    selectPresetLabel: language === 'zh-hk' ? '選擇預設考試' : 'Select Preset Exam',
    selectPresetPlaceholder: language === 'zh-hk' ? '選擇一個預設...' : 'Select a preset...',
    customPresetOption: language === 'zh-hk' ? '自訂輸入' : 'Custom Input',
    examTitleLabel: language === 'zh-hk' ? '考試名稱' : 'Exam Title',
    examCodeLabel: language === 'zh-hk' ? '考試代號' : 'Exam Code',
    subjectLabel: language === 'zh-hk' ? '科目' : 'Subject',
    timeAllowedLabel: language === 'zh-hk' ? '允許時間 (例如: 2 小時 15 分鐘)' : 'Time Allowed (e.g., 2 hours 15 minutes)',
    instructionsLabel: language === 'zh-hk' ? '考試說明 (每行一條)' : 'Instructions (one per line)',
    cancelButton: language === 'zh-hk' ? '取消' : 'Cancel',
    saveButton: language === 'zh-hk' ? '儲存變更' : 'Save Changes',
  };

  const displayedPresets = useMemo(() => {
    return examPresets.map(preset => ({
      ...preset,
      displayTitle: language === 'zh-hk' ? preset.zhTitle : preset.enTitle,
    })).sort((a,b) => a.displayTitle.localeCompare(b.displayTitle));
  }, [language]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{T.modalTitle}</DialogTitle>
          <DialogDescription>
            {T.modalDescription}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1 pr-4">
        <div className="space-y-4 py-4 pr-2">
          <div>
            <Label htmlFor="preset-select" className="text-foreground/90">{T.selectPresetLabel}</Label>
            <Select value={selectedPresetId} onValueChange={handlePresetChange}>
              <SelectTrigger id="preset-select" className="w-full mt-1">
                <SelectValue placeholder={T.selectPresetPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{T.customPresetOption}</SelectItem>
                {displayedPresets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.displayTitle} ({formatDurationFromMinutes(preset.durationMinutes, language)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title" className="text-foreground/90">{T.examTitleLabel}</Label>
            <Input id="title" name="title" value={details.title} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="code" className="text-foreground/90">{T.examCodeLabel}</Label>
            <Input id="code" name="code" value={details.code} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="subject" className="text-foreground/90">{T.subjectLabel}</Label>
            <Input id="subject" name="subject" value={details.subject} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="timeAllowed" className="text-foreground/90">{T.timeAllowedLabel}</Label>
            <Input id="timeAllowed" name="timeAllowed" value={details.timeAllowed} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="instructions" className="text-foreground/90">{T.instructionsLabel}</Label>
            <Textarea
              id="instructions"
              name="instructions"
              value={details.instructions.join('\n')}
              onChange={handleChange}
              className="mt-1 min-h-[100px] bg-input text-input-foreground border-border"
              rows={5}
            />
          </div>
        </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{T.cancelButton}</Button>
          <Button onClick={handleSave}>{T.saveButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
