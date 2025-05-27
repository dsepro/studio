
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamDetails } from '@/app/page'; 

interface ExamInfoCardProps {
  examDetails: ExamDetails;
  language: string;
}

export function ExamInfoCard({ examDetails, language }: ExamInfoCardProps) {
  const T = {
    cardTitle: language === 'zh-hk' ? '考試資訊' : 'Exam Information',
    examTitleLabel: language === 'zh-hk' ? '考試名稱:' : 'Exam Title:',
    examCodeLabel: language === 'zh-hk' ? '考試代號:' : 'Exam Code:',
    subjectLabel: language === 'zh-hk' ? '科目:' : 'Subject:',
    timeAllowedLabel: language === 'zh-hk' ? '允許時間:' : 'Time Allowed:',
    instructionsLabel: language === 'zh-hk' ? '考試說明:' : 'Instructions:',
    noInstructions: language === 'zh-hk' ? '未提供具體說明。' : 'No specific instructions provided.',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{T.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm md:text-base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 className="font-semibold text-foreground/90">{T.examTitleLabel}</h3>
            <p className="text-muted-foreground">{examDetails.title}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground/90">{T.examCodeLabel}</h3>
            <p className="text-muted-foreground">{examDetails.code}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground/90">{T.subjectLabel}</h3>
            <p className="text-muted-foreground">{examDetails.subject}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground/90">{T.timeAllowedLabel}</h3>
            <p className="text-muted-foreground">{examDetails.timeAllowed}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground/90">{T.instructionsLabel}</h3>
          {examDetails.instructions && examDetails.instructions.length > 0 ? (
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
              {examDetails.instructions.map((instr, index) => (
                <li key={index}>{instr}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-1">{T.noInstructions}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
