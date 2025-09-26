"use client";

import { useAccessibility } from "./AccessibilityProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings2 } from "lucide-react";
import React from "react";

export default function AccessibilityPanel() {
  const { fontScale, setFontScale, highContrast, setHighContrast, reduceMotion, setReduceMotion, screenReaderHints, setScreenReaderHints } = useAccessibility();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open accessibility settings">
          <Settings2 className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" aria-label="Accessibility settings panel">
        <SheetHeader>
          <SheetTitle>Accessibility settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <Label htmlFor="font-scale">Font size</Label>
            <div className="mt-3">
              <Slider
                id="font-scale"
                value={[Math.round(fontScale * 100)]}
                onValueChange={(v) => setFontScale((v?.[0] ?? 100) / 100)}
                min={75}
                max={200}
                step={5}
                aria-label="Font size percentage"
              />
              <div className="mt-2 text-sm text-muted-foreground" aria-live="polite">{Math.round(fontScale * 100)}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High contrast theme</Label>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reduce-motion">Reduce motion</Label>
            <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sr-hints">Screen reader hints</Label>
            <Switch id="sr-hints" checked={screenReaderHints} onCheckedChange={setScreenReaderHints} />
          </div>

          <div className="pt-2">
            <Button onClick={() => { setFontScale(1); setHighContrast(false); setReduceMotion(false); setScreenReaderHints(true); }} variant="secondary" className="w-full">
              Reset to defaults
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}