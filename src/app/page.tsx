
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
  code: string;
  subject: string;
  timeAllowed: string;
  instructions: string[];
}

const initialExamDetails: ExamDetails = {
  title: "DSE Mathematics Compulsory Part Paper 1",
  code: "MATH CP P1",
  subject: "Mathematics Compulsory Part",
  timeAllowed: "2 hours 15 minutes",
  instructions: [
    "Attempt ALL questions.",
    "Unless otherwise specified, all working must be clearly shown.",
    "Unless otherwise specified, numerical answers should be either exact or correct to 3 significant figures.",
  ],
};


export default function Home() {
  const [fontScale, setFontScale] = useLocalStorage<number>('fontScale', 1);
  const [examDetails, setExamDetails] = useLocalStorage<ExamDetails>('examDetails', initialExamDetails);
  const [language, setLanguage] = useLocalStorage<string>('language', 'en'); // 'en' or 'zh'

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

  const appTitle = language === 'zh' ? '考试信息板' : 'Exam Info Board';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <MainClock />
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

      <main className="flex-grow container mx-auto max-w-2xl p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6">
          <TimerCard 
            onOpenConfirmation={handleOpenConfirmation} 
            initialDurationMinutes={parseDurationToMinutes(examDetails.timeAllowed)}
            language={language}
          />
          <ExamInfoCard examDetails={examDetails} language={language} />
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} {appTitle}. {language === 'zh' ? '版权所有.' : 'All rights reserved.'}
      </footer>

      <UserManualModal isOpen={isUserManualOpen} onClose={() => setIsUserManualOpen(false)} language={language} />
      <ExamSetupModal
        isOpen={isExamSetupOpen}
        onClose={() => setIsExamSetupOpen(false)}
        currentDetails={examDetails}
        onSave={(newDetails) => setExamDetails(newDetails)}
        language={language}
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

function parseDurationToMinutes(durationStr: string): number {
  let totalMinutes = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*hours?/i);
  const minutesMatch = durationStr.match(/(\d+)\s*minutes?/i);

  if (hoursMatch && hoursMatch[1]) {
    totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  }
  if (minutesMatch && minutesMatch[1]) {
    totalMinutes += parseInt(minutesMatch[1], 10);
  }
  
  return totalMinutes > 0 ? totalMinutes : 135; // Default to 135 minutes (2h 15m) if parsing fails
}
