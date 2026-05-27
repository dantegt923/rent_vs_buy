"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Settings } from "lucide-react";
import { DisplayModeToggle } from "@/components/scenario/DisplayModeToggle";
import { OutcomeModeToggle } from "@/components/scenario/OutcomeModeToggle";
import { ThemeToggle } from "@/components/scenario/ThemeToggle";
import { APP_LABELS } from "@/lib/ui/labels";

export function SettingsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label={APP_LABELS.displaySettings}
        className="inline-flex h-10 items-center gap-2 rounded-sm border border-primary/25 bg-card/80 px-3 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-[0_0_24px_hsl(var(--primary)/0.08)] transition hover:bg-primary/10 sm:tracking-[0.16em]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">{APP_LABELS.displaySettings}</span>
      </button>
      {open ? (
        <div className="fixed inset-x-4 top-20 z-50 max-h-[calc(100vh-6rem)] overflow-auto rounded-sm border border-primary/25 bg-card/95 p-4 shadow-[0_0_32px_hsl(var(--primary)/0.18)] backdrop-blur sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-80">
          <p className="de-kicker">{APP_LABELS.displaySettings}</p>
          <div className="mt-4 space-y-4">
            <SettingGroup label="Display dollars">
              <DisplayModeToggle />
            </SettingGroup>
            <SettingGroup label="Theme">
              <ThemeToggle />
            </SettingGroup>
            <SettingGroup label="Results view">
              <OutcomeModeToggle />
            </SettingGroup>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SettingGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
