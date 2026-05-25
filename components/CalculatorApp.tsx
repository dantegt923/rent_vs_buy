"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const DESKTOP_LAYOUT_QUERY = "(min-width: 1024px)";
const COMPARE_LAYOUT_QUERY = "(min-width: 1280px)";

export function CalculatorApp() {
  const scenario = useScenarioStore((state) => state.scenario);
  const scenarios = useScenarioStore((state) => state.scenarios);
  const activeScenarioId = useScenarioStore((state) => state.activeScenarioId);
  const compareMode = useScenarioStore((state) => state.compareMode);
  const displayMode = useScenarioStore((state) => state.displayMode);
  const themeMode = useScenarioStore((state) => state.themeMode);
  const headlineYear = useScenarioStore((state) => state.headlineYear);
  const results = useMemo(() => calculate(scenario), [scenario]);
  const resultsA = useMemo(() => calculate(scenarios.A), [scenarios.A]);
  const resultsB = useMemo(() => calculate(scenarios.B), [scenarios.B]);
  const resultsColumnRef = useRef<HTMLElement>(null);
  const [assumptionsPanelHeight, setAssumptionsPanelHeight] = useState<number | null>(
    null,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  useEffect(() => {
    const resultsColumn = resultsColumnRef.current;
    if (!resultsColumn) {
      return;
    }

    const layoutQuery = compareMode ? COMPARE_LAYOUT_QUERY : DESKTOP_LAYOUT_QUERY;
    const media = window.matchMedia(layoutQuery);

    const syncAssumptionsHeight = () => {
      if (!media.matches) {
        setAssumptionsPanelHeight(null);
        return;
      }

      setAssumptionsPanelHeight(resultsColumn.getBoundingClientRect().height);
    };

    syncAssumptionsHeight();

    const resizeObserver = new ResizeObserver(syncAssumptionsHeight);
    resizeObserver.observe(resultsColumn);
    media.addEventListener("change", syncAssumptionsHeight);
    window.addEventListener("resize", syncAssumptionsHeight);

    return () => {
      resizeObserver.disconnect();
      media.removeEventListener("change", syncAssumptionsHeight);
      window.removeEventListener("resize", syncAssumptionsHeight);
    };
  }, [compareMode, displayMode, headlineYear, scenario, scenarios]);

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
          className={`relative grid items-start gap-4 sm:gap-6 ${
            compareMode
              ? "xl:grid-cols-[minmax(280px,42%)_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]"
          }`}
        >
          <aside className="min-h-0 min-w-0">
            <div
              className="lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
              style={
                assumptionsPanelHeight === null
                  ? undefined
                  : { height: assumptionsPanelHeight }
              }
            >
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
          <section
            className="min-h-0 min-w-0 space-y-4 sm:space-y-6"
            ref={resultsColumnRef}
          >
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
    <div className="space-y-4">
      <div className="operator-panel rounded-sm p-4">
        <p className="operator-kicker">Scenario_{scenarioId}</p>
        <h2 className="operator-title mt-1 text-xl sm:text-2xl">
          Assumption Stack
        </h2>
      </div>
      <InputRail scenarioId={scenarioId} />
    </div>
  );
}
