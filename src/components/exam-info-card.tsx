"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ExamDetails } from '@/app/page'; // Assuming type is exported from page.tsx

interface ExamInfoCardProps {
  examDetails: ExamDetails;
}

export function ExamInfoCard({ examDetails }: ExamInfoCardProps) {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Exam Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm md:text-base">
        <div>
          <h3 className="font-semibold text-foreground/90">Exam Title:</h3>
          <p className="text-muted-foreground">{examDetails.title}</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground/90">Exam Code:</h3>
          <p className="text-muted-foreground">{examDetails.code}</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground/90">Subject:</h3>
          <p className="text-muted-foreground">{examDetails.subject}</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground/90">Time Allowed:</h3>
          <p className="text-muted-foreground">{examDetails.timeAllowed}</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground/90">Instructions:</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {examDetails.instructions.map((instr, index) => (
              <li key={index}>{instr}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
