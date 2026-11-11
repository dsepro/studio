
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import useLocalStorage from "@/hooks/use-local-storage";
import type { ExamDetails } from '@/app/page';
import { formatDurationFromMinutes } from "@/lib/utils";

interface ExamInfoCardProps {
  examDetails: ExamDetails;
  language: string;
}

// Exam-info-only text size steps. The header +/- still scales the whole app;
// this control only scales this card, so students can read the details from
// the back of the room without shrinking/oversizing the timer.
const TEXT_SCALES = [1, 1.15, 1.3, 1.5];

const LABEL_CLASS = "text-[0.95em] font-semibold leading-snug text-foreground";
const VALUE_CLASS = "text-[1.15em] font-medium leading-snug text-foreground";

export function ExamInfoCard({ examDetails, language }: ExamInfoCardProps) {
  const [storedTextStep, setTextStep] = useLocalStorage<number>('examInfoTextStep', 0);
  const parsedStep = Number(storedTextStep);
  const textStep = Number.isFinite(parsedStep)
    ? Math.min(Math.max(Math.round(parsedStep), 0), TEXT_SCALES.length - 1)
    : 0;
  const textScale = TEXT_SCALES[textStep];

  const T = {
    cardTitle: language === 'zh-hk' ? '考試資訊' : 'Examination Information',
    centreNameLabel: language === 'zh-hk' ? '試場：' : 'Centre Name:',
    centreNumberLabel: language === 'zh-hk' ? '試場編號：' : 'Centre Number:',
    subjectLabel: language === 'zh-hk' ? '科目：' : 'Subject:',
    paperLabel: language === 'zh-hk' ? '試卷：' : 'Paper:',
    durationLabel: language === 'zh-hk' ? '時長：' : 'Duration:',
    startTimeLabel: language === 'zh-hk' ? '開始時間：' : 'Start Time:',
    endTimeLabel: language === 'zh-hk' ? '結束時間：' : 'End Time:',
    examLanguageLabel: language === 'zh-hk' ? '應考語言：' : 'Exam Language:',
    textSizeLabel: language === 'zh-hk' ? '字體' : 'Text',
    decreaseTextSize: language === 'zh-hk' ? '縮小考試資訊字型' : 'Decrease exam info text size',
    increaseTextSize: language === 'zh-hk' ? '放大考試資訊字型' : 'Increase exam info text size',
    currentTextSize: language === 'zh-hk'
      ? '目前考試資訊字型：' + Math.round(textScale * 100) + '%'
      : 'Current exam info text size: ' + Math.round(textScale * 100) + '%',
    langEn: language === 'zh-hk' ? '英文' : 'English',
    langZhHk: language === 'zh-hk' ? '中文' : 'Chinese',
  };

  const displayDuration = formatDurationFromMinutes(examDetails.durationMinutes, language);  
  
  let displayExamLanguage = language === 'zh-hk' ? '不適用' : 'N/A';  
  if (examDetails.examLanguage === 'en') {
    displayExamLanguage = T.langEn;
  } else if (examDetails.examLanguage === 'zh-hk') {
    displayExamLanguage = T.langZhHk;
  }

  const displayCentreName = language === 'zh-hk' && examDetails.centreName === "香城中學" ? "香城中學" : (language === 'en' && examDetails.centreName === "香城中學" ? "ABC Secondary School" : (examDetails.centreName || (language === 'zh-hk' ? '不適用' : 'N/A')));
  const displaySubject = language === 'zh-hk' && examDetails.subject === "中國語文" ? "中國語文" : (examDetails.subject || (language === 'zh-hk' ? '不適用' : 'N/A'));  
  const displayPaper = language === 'zh-hk' && examDetails.paper === "試卷一" ? "試卷一" : (language === 'en' && examDetails.paper === "試卷一" ? "Paper 1" : (examDetails.paper || (language === 'zh-hk' ? '不適用' : 'N/A')));

  const fields = [
    { label: T.centreNameLabel, value: displayCentreName },
    { label: T.centreNumberLabel, value: examDetails.centreNumber || (language === 'zh-hk' ? '不適用' : 'N/A') },
    { label: T.subjectLabel, value: displaySubject },
    { label: T.paperLabel, value: displayPaper },
    { label: T.durationLabel, value: displayDuration },
    { label: T.startTimeLabel, value: examDetails.examStartTime || (language === 'zh-hk' ? '不適用' : 'N/A') },
    { label: T.endTimeLabel, value: examDetails.examEndTime || (language === 'zh-hk' ? '不適用' : 'N/A') },
    { label: T.examLanguageLabel, value: displayExamLanguage },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <CardTitle className="text-xl md:text-2xl">{T.cardTitle}</CardTitle>
          <div className="flex items-center gap-1">
            <span className="mr-1 text-xs text-muted-foreground">{T.textSizeLabel}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setTextStep(Math.max(0, textStep - 1))}
              disabled={textStep === 0}
              aria-label={T.decreaseTextSize}
              title={T.decreaseTextSize}
            >
              <Icons.Minus className="h-4 w-4" />
            </Button>
            <span className="w-11 text-center text-xs font-medium tabular-nums text-muted-foreground">
              {Math.round(textScale * 100)}%
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setTextStep(Math.min(TEXT_SCALES.length - 1, textStep + 1))}
              disabled={textStep === TEXT_SCALES.length - 1}
              aria-label={T.increaseTextSize}
              title={T.increaseTextSize}
            >
              <Icons.Plus className="h-4 w-4" />
            </Button>
            <span className="sr-only" aria-live="polite">{T.currentTextSize}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0 overflow-y-auto">
        <ScrollArea className="h-full">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 pr-4"
            style={{ fontSize: 'calc(1rem * ' + textScale + ')' }}
          >
            {fields.map((field) => (
              <div key={field.label}>
                <h3 className={LABEL_CLASS}>{field.label}</h3>
                <p className={VALUE_CLASS}>{field.value}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
