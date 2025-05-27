"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserManualModal({ isOpen, onClose }: UserManualModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Manual</DialogTitle>
          <DialogDescription>
            Welcome to the Exam Info Board. Here's a quick guide:
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1 pr-4">
          <div className="space-y-4 text-sm text-muted-foreground pr-2">
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Overview</h3>
              <p>This application helps you keep track of exam details and manage your time effectively during an exam.</p>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Header Bar</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Clock:</strong> Displays the current system time.</li>
                <li><strong>Theme Toggle (Sun/Moon icon):</strong> Switch between light, dark, and system theme.</li>
                <li><strong>Language Toggle (Languages icon):</strong> Placeholder for language selection.</li>
                <li><strong>Fullscreen Toggle (Expand/Shrink icon):</strong> Enter or exit fullscreen mode.</li>
                <li><strong>User Manual (Book icon):</strong> Opens this guide.</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Exam Information Card</h3>
              <p>Displays details about the current exam, such as title, code, subject, time allowed, and instructions. These can be configured via "Exam Setup".</p>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Exam Timer Card</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Timer Display:</strong> Shows remaining time in HH:MM:SS format. Turns red when 5 minutes or less remain.</li>
                <li><strong>Progress Bar:</strong> Visual representation of time elapsed.</li>
                <li><strong>Start/Stop/Reset:</strong> Control the timer. Reset requires confirmation.</li>
                <li><strong>Adjust Current Time:</strong> Buttons to add or subtract time from the current countdown (+/- 5m, 1m, 30s).</li>
                <li><strong>Adjust Initial Duration:</strong> Buttons to change the total time for the exam (+/- 5m). This will also reset the timer.</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Settings Card</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Font Size:</strong> Use the slider to increase or decrease the application's base font size for better readability.</li>
                <li><strong>Exam Setup:</strong> Opens a modal to edit the details displayed in the Exam Information card.</li>
              </ul>
            </section>
             <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Data Persistence</h3>
              <p>Timer settings (initial duration, current time left, running state) and exam details are saved in your browser's local storage. This means your settings will persist even if you close the browser tab or refresh the page.</p>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Use fullscreen mode for a distraction-free environment.</li>
                <li>Adjust font size for comfort.</li>
                <li>Set up exam details before starting.</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
