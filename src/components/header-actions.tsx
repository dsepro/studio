
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
  const { setTheme, theme, themes } = useTheme();
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    const currentThemeIndex = themes.indexOf(theme || 'system');
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[nextThemeIndex]);
  }, [theme, themes, setTheme]);

  const toggleLanguage = useCallback(() => {
    const newLanguage = currentLanguage === "en" ? "zh" : "en";
    onLanguageChange(newLanguage);
    toast({
      title: newLanguage === 'zh' ? "语言已切换" : "Language Switched",
      description: newLanguage === 'zh' ? `语言已设为中文` : `Language set to English.`,
      duration: 2000,
    })
  }, [currentLanguage, onLanguageChange, toast]);

  const handleFontScaleSliderChange = (value: number[]) => {
    onFontScaleChange(value[0]);
  };

  const handleAppInstallInfo = () => {
    toast({
      title: currentLanguage === 'zh' ? "应用安装 (PWA)" : "App Installation (PWA)",
      description: (
        <div>
          <p>{currentLanguage === 'zh' ? "此应用程序是一个渐进式网络应用 (PWA)，可以安装在您的设备上。" : "This application is a Progressive Web App (PWA) and can be installed on your device."}</p>
          <p>{currentLanguage === 'zh' ? "在浏览器的菜单中查找“安装”、“添加到主屏幕”或类似选项，即可离线使用并获得类似原生应用的体验。" : "Look for an \"Install,\" \"Add to Home Screen,\" or similar option in your browser's menu to use it offline and like a native app."}</p>
        </div>
      ),
      duration: 10000,
    });
  };

  const getThemeIcon = () => {
    if (theme === "light") return <Icons.Sun className="h-5 w-5" />;
    if (theme === "dark") return <Icons.Moon className="h-5 w-5" />;
    return <Icons.Laptop className="h-5 w-5" />; // System theme
  };
  
  const T = {
    adjustFontSize: currentLanguage === 'zh' ? '调整字号' : 'Adjust font size',
    fontScale: currentLanguage === 'zh' ? '字号缩放' : 'Font Scale',
    cycleTheme: currentLanguage === 'zh' ? `切换主题 (当前为 ${theme})` : `Cycle theme (Currently ${theme})`,
    examSetup: currentLanguage === 'zh' ? '考试设置' : 'Exam Setup',
    toggleLanguage: currentLanguage === 'zh' ? `切换语言 (当前为 ${currentLanguage === 'zh' ? '中文' : 'EN'})` : `Toggle language (Currently ${currentLanguage === 'zh' ? '中文' : 'EN'})`,
    toggleFullscreen: currentLanguage === 'zh' ? '切换全屏' : 'Toggle fullscreen',
    openUserManual: currentLanguage === 'zh' ? '打开用户手册' : 'Open user manual',
    installApp: currentLanguage === 'zh' ? '安装应用 / 离线使用信息' : 'Install App / Offline Use Info',
  };

  return (
    <div className="flex items-center space-x-1 md:space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
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

      <Button variant="outline" size="icon" onClick={onOpenExamSetup}>
        <Icons.Settings2 className="h-5 w-5" />
        <span className="sr-only">{T.examSetup}</span>
      </Button>
      
      <Button variant="outline" size="icon" onClick={toggleLanguage} aria-label={T.toggleLanguage}>
        {/* <Icons.Languages className="h-5 w-5" /> */}
        <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center">{currentLanguage === 'zh' ? '中' : 'EN'}</span>
        <span className="sr-only">{T.toggleLanguage}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={toggleFullScreen}>
        {isFullScreen ? <Icons.Shrink className="h-5 w-5" /> : <Icons.Expand className="h-5 w-5" />}
        <span className="sr-only">{T.toggleFullscreen}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={onOpenUserManual}>
        <Icons.BookOpenText className="h-5 w-5" />
        <span className="sr-only">{T.openUserManual}</span>
      </Button>

      <Button variant="outline" size="icon" onClick={handleAppInstallInfo}>
        <Icons.Download className="h-5 w-5" />
        <span className="sr-only">{T.installApp}</span>
      </Button>
    </div>
  );
}
