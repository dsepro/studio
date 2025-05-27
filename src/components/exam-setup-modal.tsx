"use client";

import { useState, useEffect } from 'react';
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

interface ExamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: ExamDetails;
  onSave: (newDetails: ExamDetails) => void;
}

export function ExamSetupModal({ isOpen, onClose, currentDetails, onSave }: ExamSetupModalProps) {
  const [details, setDetails] = useState<ExamDetails>(currentDetails);

  useEffect(() => {
    setDetails(currentDetails);
  }, [currentDetails, isOpen]); // Reset form when modal opens or currentDetails change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Exam Setup</DialogTitle>
          <DialogDescription>
            Configure the details for the current exam.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1 pr-4">
        <div className="space-y-4 py-4 pr-2">
          <div>
            <Label htmlFor="title" className="text-foreground/90">Exam Title</Label>
            <Input id="title" name="title" value={details.title} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="code" className="text-foreground/90">Exam Code</Label>
            <Input id="code" name="code" value={details.code} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="subject" className="text-foreground/90">Subject</Label>
            <Input id="subject" name="subject" value={details.subject} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="timeAllowed" className="text-foreground/90">Time Allowed</Label>
            <Input id="timeAllowed" name="timeAllowed" value={details.timeAllowed} onChange={handleChange} className="mt-1 bg-input text-input-foreground border-border" />
          </div>
          <div>
            <Label htmlFor="instructions" className="text-foreground/90">Instructions (one per line)</Label>
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
