
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Icons } from "@/components/icons";
import React from "react";

interface SettingsCardProps {
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
}

export function SettingsCard({ fontScale, onFontScaleChange }: SettingsCardProps) {
  const handleSliderChange = (value: number[]) => {
    onFontScaleChange(value[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground/90 mb-2">Font Size</h3>
          <div className="flex items-center space-x-2">
            <Icons.ZoomOut className="h-5 w-5 text-muted-foreground" />
            <Slider
              min={0.8}
              max={1.5}
              step={0.05}
              value={[fontScale]}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <Icons.ZoomIn className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">Current Scale: {fontScale.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
