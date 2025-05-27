
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";

interface HeaderActionsProps {
  onOpenUserManual: () => void;
  onOpenExamSetup: () => void;
}

export function HeaderActions({ onOpenUserManual, onOpenExamSetup }: HeaderActionsProps) {
  const { setTheme, theme } = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("EN"); // Placeholder

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    // Add actual language change logic here if needed
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {theme === "light" ? <Icons.Sun className="h-5 w-5" /> : <Icons.Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Icons.Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Icons.Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Icons.Laptop className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.Languages className="h-5 w-5" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toggleLanguage("EN")}>
            {currentLanguage === "EN" && <Icons.Check className="mr-2 h-4 w-4" />}
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleLanguage("ZH")}>
            {currentLanguage === "ZH" && <Icons.Check className="mr-2 h-4 w-4" />}
            中文 (Placeholder)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="icon" onClick={toggleFullScreen}>
        {isFullScreen ? <Icons.Shrink className="h-5 w-5" /> : <Icons.Expand className="h-5 w-5" />}
        <span className="sr-only">Toggle fullscreen</span>
      </Button>

      <Button variant="outline" size="icon" onClick={onOpenExamSetup}>
        <Icons.Settings2 className="h-5 w-5" />
        <span className="sr-only">Exam Setup</span>
      </Button>

      <Button variant="outline" size="icon" onClick={onOpenUserManual}>
        <Icons.BookOpenText className="h-5 w-5" />
        <span className="sr-only">Open user manual</span>
      </Button>
    </div>
  );
}
