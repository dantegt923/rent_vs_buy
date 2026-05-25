"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { HeadlineResult } from "@/components/results/HeadlineResult";
import { NetWorthChart } from "@/components/results/NetWorthChart";
import { YearByYearTable } from "@/components/results/YearByYearTable";
import { DisplayModeToggle } from "@/components/scenario/DisplayModeToggle";
import { ScenarioPicker } from "@/components/scenario/ScenarioPicker";
import { ThemeToggle } from "@/components/scenario/ThemeToggle";
import { InputRail } from "@/components/sections/InputRail";
import { calculate } from "@/lib/engine";
import { useScenarioStore } from "@/lib/store/scenarioStore";

export function CalculatorApp() {
  const scenario = useScenarioStore((state) => state.scenario);
  const scenarios = useScenarioStore((state) => state.scenarios);
  const activeScenarioId = useScenarioStore((state) => state.activeScenarioId);
  const compareMode = useScenarioStore((state) => state.compareMode);
  const displayMode = useScenarioStore((state) => state.displayMode);
  const themeMode = useScenarioStore((state) => state.themeMode);
  const results = useMemo(() => calculate(scenario), [scenario]);
  const resultsA = useMemo(() => calculate(scenarios.A), [scenarios.A]);
  const resultsB = useMemo(() => calculate(scenarios.B), [scenarios.B]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_at_70%_0%,hsl(var(--primary)/0.24),transparent_38%),radial-gradient(ellipse_at_8%_18%,hsl(var(--accent)/0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute right-6 top-28 hidden h-40 w-px bg-primary/50 xl:block" />
      <p className="pointer-events-none fixed right-3 top-1/2 z-10 hidden origin-center rotate-90 text-[10px] font-bold uppercase tracking-[0.42em] text-primary/70 xl:block">
        Scroll Down
      </p>
      <div className="mx-auto max-w-[1440px]">
        <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-primary/20 bg-background/75 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:mb-6 sm:px-6 sm:py-4 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="operator-kicker text-[9px] sm:text-[10px]">
                Operators · Analysts · Capital Strategy
              </p>
              <h1 className="operator-title text-2xl leading-none sm:text-3xl lg:text-4xl">
                Rent / Buy Spectrum
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
              <Link
                className="rounded-sm border border-primary/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/10 sm:text-xs sm:tracking-[0.18em]"
                href="/methodology"
              >
                Methodology
              </Link>
              <ScenarioPicker />
              <DisplayModeToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div
          className={`relative grid gap-4 sm:gap-6 ${
            compareMode
              ? "xl:grid-cols-[minmax(280px,42%)_minmax(0,1fr)] xl:items-stretch"
              : "lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:items-stretch"
          }`}
        >
          <aside className="min-h-0 lg:flex lg:h-full lg:min-h-full lg:flex-col lg:self-stretch">
            <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
              {compareMode ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <ScenarioRail scenarioId="A" />
                  <ScenarioRail scenarioId="B" />
                </div>
              ) : (
                <ScenarioRail scenarioId={activeScenarioId} />
              )}
            </div>
          </aside>
          <section className="min-h-0 min-w-0 space-y-4 sm:space-y-6">
            {compareMode ? (
              <>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <HeadlineResult displayMode={displayMode} label="Scenario A" results={resultsA} />
                  <HeadlineResult displayMode={displayMode} label="Scenario B" results={resultsB} />
                </div>
                <NetWorthChart
                  compareResults={resultsB}
                  displayMode={displayMode}
                  results={resultsA}
                />
                <YearByYearTable displayMode={displayMode} label="Scenario A" results={resultsA} />
                <YearByYearTable displayMode={displayMode} label="Scenario B" results={resultsB} />
              </>
            ) : (
              <>
                <HeadlineResult displayMode={displayMode} results={results} />
                <NetWorthChart displayMode={displayMode} results={results} />
                <YearByYearTable displayMode={displayMode} results={results} />
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ScenarioRail({ scenarioId }: { scenarioId: "A" | "B" }) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="operator-panel shrink-0 rounded-sm p-4">
        <p className="operator-kicker">Scenario_{scenarioId}</p>
        <h2 className="operator-title mt-1 text-xl sm:text-2xl">
          Assumption Stack
        </h2>
      </div>
      <div className="min-h-0 flex-1">
        <InputRail scenarioId={scenarioId} />
      </div>
    </div>
  );
}
