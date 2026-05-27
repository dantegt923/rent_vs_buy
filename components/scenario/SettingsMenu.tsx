"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Settings } from "lucide-react";
import { DisplayModeToggle } from "@/components/scenario/DisplayModeToggle";
import { OutcomeModeToggle } from "@/components/scenario/OutcomeModeToggle";
import { ThemeToggle } from "@/components/scenario/ThemeToggle";
import { APP_LABELS } from "@/lib/ui/labels";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const activeScenarioId = useScenarioStore((state) => state.activeScenarioId);
  const savedScenarios = useScenarioStore((state) => state.savedScenarios);
  const saveNamedScenario = useScenarioStore((state) => state.saveNamedScenario);
  const loadSavedScenario = useScenarioStore((state) => state.loadSavedScenario);
  const duplicateSavedScenario = useScenarioStore(
    (state) => state.duplicateSavedScenario,
  );
  const deleteSavedScenario = useScenarioStore((state) => state.deleteSavedScenario);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label={APP_LABELS.settings}
        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-primary/25 bg-card/80 text-primary shadow-[0_0_24px_hsl(var(--primary)/0.08)] transition hover:bg-primary/10"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <Settings className="h-4 w-4" />
      </button>
      {open ? (
        <div className="fixed inset-x-4 top-20 z-50 max-h-[calc(100vh-6rem)] overflow-auto rounded-sm border border-primary/25 bg-card/95 p-4 shadow-[0_0_32px_hsl(var(--primary)/0.18)] backdrop-blur sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96">
          <p className="de-kicker">{APP_LABELS.settings}</p>
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
            <SettingGroup label="Saved scenarios">
              <div className="flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-sm border-primary/15 bg-background/45 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em]"
                  placeholder={`Name Scenario ${activeScenarioId}`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <button
                  className="rounded-sm bg-primary px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground"
                  type="button"
                  onClick={() => {
                    saveNamedScenario(name || `Scenario ${activeScenarioId}`);
                    setName("");
                  }}
                >
                  Save
                </button>
              </div>
              <div className="mt-3 max-h-56 space-y-2 overflow-auto">
                {savedScenarios.length === 0 ? (
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    No saved scenarios yet.
                  </p>
                ) : null}
                {savedScenarios.map((savedScenario) => (
                  <div
                    className="rounded-sm border border-primary/10 bg-secondary/40 p-2"
                    key={savedScenario.id}
                  >
                    <p className="font-bold uppercase tracking-[0.12em]">
                      {savedScenario.name}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.12em]">
                      {(["A", "B"] as ScenarioId[]).map((scenarioId) => (
                        <button
                          key={scenarioId}
                          type="button"
                          onClick={() => loadSavedScenario(savedScenario.id, scenarioId)}
                        >
                          Load {scenarioId}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => duplicateSavedScenario(savedScenario.id)}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedScenario(savedScenario.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
