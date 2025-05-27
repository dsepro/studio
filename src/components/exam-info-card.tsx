
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ExamDetails } from '@/app/page'; 
import { formatDurationFromMinutes } from "@/lib/utils";

interface ExamInfoCardProps {
  examDetails: ExamDetails;
  language: string; 
}

export function ExamInfoCard({ examDetails, language }: ExamInfoCardProps) {
  const T = {
    cardTitle: language === 'zh-hk' ? '考試資訊' : 'Exam Information',
    centreNameLabel: language === 'zh-hk' ? '試場：' : 'Centre Name:',
    centreNumberLabel: language === 'zh-hk' ? '試場編號：' : 'Centre Number:',
    subjectLabel: language === 'zh-hk' ? '科目：' : 'Subject:',
    paperLabel: language === 'zh-hk' ? '試卷：' : 'Paper:',
    durationLabel: language === 'zh-hk' ? '時長：' : 'Duration:',
    startTimeLabel: language === 'zh-hk' ? '開始時間：' : 'Start Time:',
    endTimeLabel: language === 'zh-hk' ? '結束時間：' : 'End Time:',
    examLanguageLabel: language === 'zh-hk' ? '應考語言:' : 'Exam Language:',
    langEn: language === 'zh-hk' ? '英文' : 'English',
    langZhHk: language === 'zh-hk' ? '中文' : 'Chinese',
  };

  const displayDuration = formatDurationFromMinutes(examDetails.durationMinutes, language);
  const displayExamLanguage = examDetails.examLanguage === 'en' ? T.langEn : 
                              examDetails.examLanguage === 'zh-hk' ? T.langZhHk : (language === 'zh-hk' ? '不適用' : 'N/A');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{T.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm md:text-base pr-4">
            <div>
              <h3 className="font-semibold text-foreground/90">{T.centreNameLabel}</h3>
              <p className="text-muted-foreground">{examDetails.centreName || (language === 'zh-hk' ? '不適用' : 'N/A')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">{T.centreNumberLabel}</h3>
              <p className="text-muted-foreground">{examDetails.centreNumber || (language === 'zh-hk' ? '不適用' : 'N/A')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">{T.subjectLabel}</h3>
              <p className="text-muted-foreground">{examDetails.subject || (language === 'zh-hk' ? '不適用' : 'N/A')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">{T.paperLabel}</h3>
              <p className="text-muted-foreground">{examDetails.paper || (language === 'zh-hk' ? '不適用' : 'N/A')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">{T.durationLabel}</h3>
              <p className="text-muted-foreground">{displayDuration}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">{T.startTimeLabel}</h3>
              <p className="text-muted-foreground">{examDetails.examStartTime || (language === 'zh-hk' ? '不適用' : 'N/A')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">{T.endTimeLabel}</h3>
              <p className="text-muted-foreground">{examDetails.examEndTime || (language === 'zh-hk' ? '不適用' : 'N/A')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">{T.examLanguageLabel}</h3>
              <p className="text-muted-foreground">{displayExamLanguage}</p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
