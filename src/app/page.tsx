
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { HeaderActions } from '@/components/header-actions';
import { ExamInfoCard } from '@/components/exam-info-card';
import { TimerCard } from '@/components/timer-card';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { UserManualModal } from '@/components/user-manual-modal';
import { ExamSetupModal } from '@/components/exam-setup-modal';
import useLocalStorage from '@/hooks/use-local-storage';
import { Icons } from '@/components/icons';


export interface ExamDetails {
  title: string;
  centreName: string;
  centreNumber: string;
  subject: string;
  paper: string;
  durationMinutes: number;
  examStartTime: string;
  examEndTime: string;
  examLanguage: 'en' | 'zh-hk';
}

const initialExamDetails: ExamDetails = {
  title: "中國語文 試卷一",
  centreName: "香城中學",
  centreNumber: "A1234",
  subject: "中國語文",
  paper: "試卷一",
  durationMinutes: 90,
  examStartTime: "08:30",
  examEndTime: "10:00",
  examLanguage: 'zh-hk',
};


export default function Home() {
  const [fontScale, setFontScale] = useLocalStorage<number>('fontScale', 1);
  const [examDetails, setExamDetails] = useLocalStorage<ExamDetails>('examDetails', initialExamDetails);
  const [language, setLanguage] = useLocalStorage<string>('language', 'zh-hk'); 

  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [isExamSetupOpen, setIsExamSetupOpen] = useState(false);
  // Deliberately not persisted: a reload always brings the top bar back.
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);

  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale-factor', fontScale.toString());
  }, [fontScale]);

  // Keyboard shortcut for desktop: "h" toggles the top bar.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (event.key.toLowerCase() !== 'h') return;
      setIsTopBarHidden(previous => !previous);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleOpenConfirmation = useCallback((title: string, description: string, onConfirm: () => void) => {
    setConfirmationState({ isOpen: true, title, description, onConfirm });
  }, []);

  const handleCloseConfirmation = useCallback(() => {
    setConfirmationState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const appFooterCreator = language === 'zh-hk' ? '由鍾永老師製作' : 'Created by Mr. Louis Chung';
  const appTitle = language === 'zh-hk' ? '考試資訊' : 'Examination Information';

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background text-foreground transition-colors duration-300">
      {!isTopBarHidden && (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
            <div className="flex min-h-16 flex-wrap items-center justify-end gap-y-1 py-1">
              <div className="flex w-full flex-wrap items-center justify-end gap-1 md:gap-2">
                <HeaderActions
                  onOpenUserManual={() => setIsUserManualOpen(true)}
                  onOpenExamSetup={() => setIsExamSetupOpen(true)}
                  fontScale={fontScale}
                  onFontScaleChange={setFontScale}
                  currentLanguage={language}
                  onLanguageChange={setLanguage}
                  language={language}
                  onHideTopBar={() => setIsTopBarHidden(true)}
                />
              </div>
            </div>
          </div>
        </header>
      )}

      {isTopBarHidden && (
        // Touch-first restore handle: always visible while the bar is hidden,
        // 44px tall so it is comfortably tappable on an iPad.
        <button
          type="button"
          onClick={() => setIsTopBarHidden(false)}
          aria-label={language === 'zh-hk' ? '顯示頂部工具列' : 'Show top bar'}
          title={language === 'zh-hk' ? '顯示頂部工具列 (H)' : 'Show top bar (H)'}
          className="fixed left-1/2 top-0 z-50 flex h-11 w-20 -translate-x-1/2 items-center justify-center rounded-b-2xl border border-t-0 bg-background/70 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-background/95 hover:text-foreground"
        >
          <Icons.ChevronDown className="h-5 w-5" />
        </button>
      )}

      <main className="flex-grow flex flex-col container mx-auto max-w-full p-4 md:p-6 lg:p-8 w-full">
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex-[2_2_0%] min-h-0">
            <TimerCard
              initialDurationMinutes={examDetails.durationMinutes}
              language={language}
              onOpenConfirmation={handleOpenConfirmation}
            />
          </div>
          <div className="flex-[1_1_0%] min-h-0">
            <ExamInfoCard
              key={`exam-info-${language}`} 
              examDetails={examDetails}
              language={language}
            />
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        {appFooterCreator}
      </footer>

      <UserManualModal isOpen={isUserManualOpen} onClose={() => setIsUserManualOpen(false)} language={language} />
      <ExamSetupModal
        isOpen={isExamSetupOpen}
        onClose={() => setIsExamSetupOpen(false)}
        currentDetails={examDetails}
        onSave={(newDetails) => {
          setExamDetails(newDetails);
          // If the timer is not running, update its duration to match new exam details
          // This assumes TimerCard will pick up new initialDurationMinutes if it's not running
        }}
        currentAppLanguage={language}
      />
      <ConfirmationDialog
        isOpen={confirmationState.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        language={language}
      />
    </div>
  );
}
