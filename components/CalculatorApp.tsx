"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { HeadlineResult } from "@/components/results/HeadlineResult";
import { NetWorthChart } from "@/components/results/NetWorthChart";
import { YearByYearTable } from "@/components/results/YearByYearTable";
import { SettingsMenu } from "@/components/scenario/SettingsMenu";
import { AdvancedAssumptionsPanel } from "@/components/sections/AdvancedAssumptionsPanel";
import { SimpleInputsPanel } from "@/components/sections/SimpleInputsPanel";
import { APP_LABELS } from "@/lib/ui/labels";
import { calculate } from "@/lib/engine";
import { useScenarioStore } from "@/lib/store/scenarioStore";

export function CalculatorApp() {
  const scenario = useScenarioStore((state) => state.scenario);
  const scenarios = useScenarioStore((state) => state.scenarios);
  const compareMode = useScenarioStore((state) => state.compareMode);
  const displayMode = useScenarioStore((state) => state.displayMode);
  const themeMode = useScenarioStore((state) => state.themeMode);
  const setCompareMode = useScenarioStore((state) => state.setCompareMode);
  const results = useMemo(() => calculate(scenario), [scenario]);
  const resultsA = useMemo(() => calculate(scenarios.A), [scenarios.A]);
  const resultsB = useMemo(() => calculate(scenarios.B), [scenarios.B]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_at_70%_0%,hsl(var(--primary)/0.22),transparent_38%),radial-gradient(ellipse_at_8%_18%,hsl(var(--accent)/0.1),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1200px]">
        <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-primary/20 bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:mb-6 sm:px-6 sm:py-4 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="de-kicker text-[9px] sm:text-[10px]">Housing decision tool</p>
              <h1 className="de-headline text-2xl uppercase leading-none sm:text-3xl lg:text-4xl">
                Rent vs. buy
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:justify-end sm:gap-3">
              <button
                className={`rounded-sm border border-primary/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-[0_0_24px_hsl(var(--primary)/0.08)] ${
                  compareMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/80 text-primary"
                }`}
                type="button"
                onClick={() => setCompareMode(!compareMode)}
              >
                {APP_LABELS.compareScenarios}
              </button>
              <SettingsMenu />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[960px] space-y-4 sm:space-y-6">
          {compareMode ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <SimpleInputsPanel scenarioId="A" />
              <SimpleInputsPanel scenarioId="B" />
            </div>
          ) : (
            <SimpleInputsPanel scenarioId="A" />
          )}

          {compareMode ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <HeadlineResult displayMode={displayMode} label={APP_LABELS.scenarioA} results={resultsA} />
              <HeadlineResult displayMode={displayMode} label={APP_LABELS.scenarioB} results={resultsB} />
            </div>
          ) : (
            <HeadlineResult displayMode={displayMode} results={results} />
          )}

          <NetWorthChart
            compareResults={compareMode ? resultsB : undefined}
            displayMode={displayMode}
            results={compareMode ? resultsA : results}
          />

          {compareMode ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <AdvancedAssumptionsPanel scenarioId="A" />
              <AdvancedAssumptionsPanel scenarioId="B" />
            </div>
          ) : (
            <AdvancedAssumptionsPanel scenarioId="A" />
          )}

          {compareMode ? (
            <>
              <YearByYearTable displayMode={displayMode} label={APP_LABELS.scenarioA} results={resultsA} />
              <YearByYearTable displayMode={displayMode} label={APP_LABELS.scenarioB} results={resultsB} />
            </>
          ) : (
            <YearByYearTable displayMode={displayMode} results={results} />
          )}

          <footer className="pb-8 pt-2 text-center">
            <Link
              className="text-sm font-semibold text-primary hover:underline"
              href="/methodology"
            >
              {APP_LABELS.methodology}
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
