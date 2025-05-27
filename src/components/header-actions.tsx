
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface HeaderActionsProps {
  onOpenUserManual: () => void;
  onOpenExamSetup: () => void;
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
}

export function HeaderActions({ 
  onOpenUserManual, 
  onOpenExamSetup,
  fontScale,
  onFontScaleChange 
}: HeaderActionsProps) {
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();
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

  const handleFontScaleSliderChange = (value: number[]) => {
    onFontScaleChange(value[0]);
  };

  const handleDownloadApp = () => {
    toast({
      title: "Offline Capability",
      description: (
        <div>
          <p>Modern web apps like this one are best made available offline as Progressive Web Apps (PWAs), which allow them to be "installed" and cache data.</p>
          <p>Directly downloading as a single HTML file for full offline use is not typical for this app structure. Consider PWA features for a robust offline experience.</p>
        </div>
      ),
      duration: 10000, // Show for 10 seconds
    });
  };

  return (
    <div className="flex items-center space-x-1 md:space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.ALargeSmall className="h-5 w-5" />
            <span className="sr-only">Adjust font size</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="space-y-2">
            <label htmlFor="font-slider" className="text-sm font-medium leading-none">Font Scale: {fontScale.toFixed(2)}</label>
            <div className="flex items-center space-x-2">
              <Icons.ZoomOut className="h-4 w-4 text-muted-foreground" />
              <Slider
                id="font-slider"
                min={0.8}
                max={1.5}
                step={0.05}
                value={[fontScale]}
                onValueChange={handleFontScaleSliderChange}
                className="w-full"
              />
              <Icons.ZoomIn className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </PopoverContent>
      </Popover>

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

      <Button variant="outline" size="icon" onClick={onOpenExamSetup}>
        <Icons.Settings2 className="h-5 w-5" />
        <span className="sr-only">Exam Setup</span>
      </Button>
      
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

      <Button variant="outline" size="icon" onClick={onOpenUserManual}>
        <Icons.BookOpenText className="h-5 w-5" />
        <span className="sr-only">Open user manual</span>
      </Button>

      <Button variant="outline" size="icon" onClick={handleDownloadApp}>
        <Icons.Download className="h-5 w-5" />
        <span className="sr-only">Download App for Offline Use</span>
      </Button>
    </div>
  );
}
