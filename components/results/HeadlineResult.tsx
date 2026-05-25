"use client";

import type { ScenarioResults } from "@/lib/engine";
import { useScenarioStore, type DisplayMode } from "@/lib/store/scenarioStore";
import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import Link from "next/link";
import { formatCurrency } from "./formatters";

interface HeadlineResultProps {
  results: ScenarioResults;
  displayMode: DisplayMode;
  label?: string;
}

export function HeadlineResult({ results, displayMode, label }: HeadlineResultProps) {
  const headlineYear = useScenarioStore((state) => state.headlineYear);
  const setHeadlineYear = useScenarioStore((state) => state.setHeadlineYear);
  const row = results.comparison[headlineYear - 1];
  const delta = displayMode === "real" ? row.realDelta : row.delta;
  const buyerWins = delta >= 0;

  return (
    <section className="operator-panel rounded-sm p-4 sm:p-6">
      <p className="operator-kicker">
        SYS.STATUS: {label ?? "cost-adjusted net position"}
      </p>
      <h2 className="operator-title mt-3 text-2xl leading-[1.05] sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[0.92]">
        At year {headlineYear}, buying leaves you{" "}
        <span className={buyerWins ? "text-primary" : "text-accent drop-shadow-[0_0_18px_hsl(var(--accent)/0.35)]"}>
          {formatCurrency(Math.abs(delta))}
        </span>{" "}
        {buyerWins ? "ahead" : "behind"} versus renting.
      </h2>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
        This is an{" "}
        <span className="font-semibold text-foreground">
          unrecoverable cost-adjusted net position
        </span>
        , not net worth at the horizon year. It measures what you keep after
        liquidating (home sale or portfolio, after tax) minus housing costs you
        cannot recover through those assets. Down payment, closing costs, and
        mortgage principal are excluded from costs because they return through
        home equity at sale.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        <Link className="font-semibold text-primary hover:underline" href="/methodology">
          Read the methodology
        </Link>{" "}
        for a full walkthrough of each path.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Break-even year" value={results.breakEvenYear ?? "None"} />
        <Metric
          label="Buyer adjusted position"
          value={formatCurrency(
            displayMode === "real" ? row.realBuyerNetResult : row.buyerNetResult,
          )}
        />
        <Metric
          label="Renter adjusted position"
          value={formatCurrency(
            displayMode === "real" ? row.realRenterNetResult : row.renterNetResult,
          )}
        />
      </div>
      <div className="mt-6">
        <NumberSliderInput
          label="Headline year"
          max={results.inputs.horizonYears}
          min={1}
          onChange={setHeadlineYear}
          step={1}
          suffix="years"
          value={headlineYear}
        />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-primary/15 bg-secondary/60 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-serif text-2xl font-bold tabular-nums sm:text-3xl">{value}</p>
    </div>
  );
}
