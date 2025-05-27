
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useCallback } from "react";

interface HeaderActionsProps {
  onOpenUserManual: () => void;
  onOpenExamSetup: () => void;
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function HeaderActions({ 
  onOpenUserManual, 
  onOpenExamSetup,
  fontScale,
  onFontScaleChange,
  currentLanguage,
  onLanguageChange
}: HeaderActionsProps) {
  const { setTheme, theme } = useTheme(); // themes array is no longer needed from useTheme
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Available themes for cycling (System theme removed)
  const availableThemes = ["light", "dark"];

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

  const cycleTheme = useCallback(() => {
    const currentThemeIndex = availableThemes.indexOf(theme || availableThemes[0]);
    const nextThemeIndex = (currentThemeIndex + 1) % availableThemes.length;
    setTheme(availableThemes[nextThemeIndex]);
  }, [theme, setTheme, availableThemes]);

  const toggleLanguage = useCallback(() => {
    const newLanguage = currentLanguage === "en" ? "zh-hk" : "en";
    onLanguageChange(newLanguage);
    toast({
      title: newLanguage === 'zh-hk' ? "語言已切換" : "Language Switched",
      description: newLanguage === 'zh-hk' ? `語言已設為繁體中文（香港）。` : `Language set to English.`,
      duration: 2000,
    })
  }, [currentLanguage, onLanguageChange, toast]);

  const handleFontScaleSliderChange = (value: number[]) => {
    onFontScaleChange(value[0]);
  };

  const handleAppInstallInfo = () => {
    toast({
      title: currentLanguage === 'zh-hk' ? "應用程式安裝 (PWA)" : "App Installation (PWA)",
      description: (
        <div>
          <p>{currentLanguage === 'zh-hk' ? "此應用程式是一個漸進式網絡應用程式 (PWA)，可以安裝在您的裝置上。" : "This application is a Progressive Web App (PWA) and can be installed on your device."}</p>
          <p>{currentLanguage === 'zh-hk' ? "在瀏覽器的選單中查找「安裝」、「新增至主畫面」或類似選項，即可離線使用並獲得類似原生應用程式的體驗。" : "Look for an \"Install,\" \"Add to Home Screen,\" or similar option in your browser's menu to use it offline and like a native app."}</p>
        </div>
      ),
      duration: 10000,
    });
  };

  const getThemeIcon = () => {
    if (theme === "light") return <Icons.Sun className="h-5 w-5" />;
    if (theme === "dark") return <Icons.Moon className="h-5 w-5" />;
    // Fallback or if theme is somehow undefined initially, though Popover should ensure it's set
    return <Icons.Sun className="h-5 w-5" />; 
  };
  
  const T = {
    adjustFontSize: currentLanguage === 'zh-hk' ? '調整字型大小' : 'Adjust font size',
    fontScale: currentLanguage === 'zh-hk' ? '字型縮放' : 'Font Scale',
    cycleTheme: currentLanguage === 'zh-hk' ? `切換主題 (目前為 ${theme === 'light' ? '淺色' : '深色'})` : `Cycle theme (Currently ${theme === 'light' ? 'Light' : 'Dark'})`,
    examSetup: currentLanguage === 'zh-hk' ? '考試設定' : 'Exam Setup',
    toggleLanguage: currentLanguage === 'zh-hk' ? `切換語言 (目前為 繁)` : `Toggle language (Currently EN)`,
    toggleFullscreen: currentLanguage === 'zh-hk' ? '切換全螢幕' : 'Toggle fullscreen',
    openUserManual: currentLanguage === 'zh-hk' ? '開啟用戶手冊' : 'Open user manual',
    installApp: currentLanguage === 'zh-hk' ? '安裝應用程式 / 離線使用資訊' : 'Install App / Offline Use Info',
  };

  return (
    <div className="flex items-center space-x-1 md:space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label={T.adjustFontSize}>
            <Icons.ALargeSmall className="h-5 w-5" />
            <span className="sr-only">{T.adjustFontSize}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="space-y-2">
            <label htmlFor="font-slider" className="text-sm font-medium leading-none">{T.fontScale}: {fontScale.toFixed(2)}</label>
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

      <Button variant="outline" size="icon" onClick={cycleTheme} aria-label={T.cycleTheme}>
        {getThemeIcon()}
        <span className="sr-only">{T.cycleTheme}</span>
      </Button>
      
      <Button variant="outline" size="icon" onClick={onOpenExamSetup} aria-label={T.examSetup}>
        <Icons.Settings2 className="h-5 w-5" />
        <span className="sr-only">{T.examSetup}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={toggleLanguage} aria-label={T.toggleLanguage}>
        <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center">{currentLanguage === 'zh-hk' ? '繁' : 'EN'}</span>
        <span className="sr-only">{T.toggleLanguage}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={toggleFullScreen} aria-label={T.toggleFullscreen}>
        {isFullScreen ? <Icons.Shrink className="h-5 w-5" /> : <Icons.Expand className="h-5 w-5" />}
        <span className="sr-only">{T.toggleFullscreen}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={onOpenUserManual} aria-label={T.openUserManual}>
        <Icons.BookOpenText className="h-5 w-5" />
        <span className="sr-only">{T.openUserManual}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={handleAppInstallInfo} aria-label={T.installApp}>
        <Icons.Download className="h-5 w-5" />
        <span className="sr-only">{T.installApp}</span>
      </Button>
    </div>
  );
}

