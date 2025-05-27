
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MainClock } from '@/components/main-clock';
import { HeaderActions } from '@/components/header-actions';
import { ExamInfoCard } from '@/components/exam-info-card';
import { TimerCard } from '@/components/timer-card';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { UserManualModal } from '@/components/user-manual-modal';
import { ExamSetupModal } from '@/components/exam-setup-modal';
import useLocalStorage from '@/hooks/use-local-storage';

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
  title: "Chinese Language Paper 1",
  centreName: "ABC Secondary School",
  centreNumber: "A1234",
  subject: "Chinese Language",
  paper: "Paper 1",
  durationMinutes: 90,
  examStartTime: "08:30",
  examEndTime: "10:00",
  examLanguage: 'en',
};


export default function Home() {
  const [fontScale, setFontScale] = useLocalStorage<number>('fontScale', 1);
  const [examDetails, setExamDetails] = useLocalStorage<ExamDetails>('examDetails', initialExamDetails);
  const [language, setLanguage] = useLocalStorage<string>('language', 'en');

  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [isExamSetupOpen, setIsExamSetupOpen] = useState(false);

  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale-factor', fontScale.toString());
  }, [fontScale]);

  const handleOpenConfirmation = useCallback((title: string, description: string, onConfirm: () => void) => {
    setConfirmationState({ isOpen: true, title, description, onConfirm });
  }, []);

  const handleCloseConfirmation = useCallback(() => {
    setConfirmationState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const appFooterCreator = language === 'zh-hk' ? '由鍾永老師製作' : 'Created by Mr. Louis Chung';
  const appTitle = language === 'zh-hk' ? '考試資訊' : 'Exam Info';


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"> {/* Increased max-width */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <MainClock language={language} />
              <h1 className="text-xl font-semibold hidden sm:block">{appTitle}</h1>
            </div>
            <HeaderActions
              onOpenUserManual={() => setIsUserManualOpen(true)}
              onOpenExamSetup={() => setIsExamSetupOpen(true)}
              fontScale={fontScale}
              onFontScaleChange={setFontScale}
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col container mx-auto max-w-7xl p-4 md:p-6 lg:p-8 w-full"> {/* Increased max-width */}
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex-[2_2_0%] min-h-0"> {/* TimerCard wrapper */}
            <TimerCard
              initialDurationMinutes={examDetails.durationMinutes}
              language={language}
              onOpenConfirmation={handleOpenConfirmation}
            />
          </div>
          <div className="flex-[1_1_0%] min-h-0"> {/* ExamInfoCard wrapper */}
            <ExamInfoCard examDetails={examDetails} language={language} />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t">
        {appFooterCreator}
      </footer>

      <UserManualModal isOpen={isUserManualOpen} onClose={() => setIsUserManualOpen(false)} language={language} />
      <ExamSetupModal
        isOpen={isExamSetupOpen}
        onClose={() => setIsExamSetupOpen(false)}
        currentDetails={examDetails}
        onSave={(newDetails) => setExamDetails(newDetails)}
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
