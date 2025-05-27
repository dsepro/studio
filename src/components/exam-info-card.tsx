
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamDetails } from '@/app/page'; 

interface ExamInfoCardProps {
  examDetails: ExamDetails;
}

export function ExamInfoCard({ examDetails }: ExamInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Exam Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm md:text-base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
        </div>
        <div>
          <h3 className="font-semibold text-foreground/90">Instructions:</h3>
          {examDetails.instructions && examDetails.instructions.length > 0 ? (
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
              {examDetails.instructions.map((instr, index) => (
                <li key={index}>{instr}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-1">No specific instructions provided.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
