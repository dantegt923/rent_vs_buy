"use client";

import type { ScenarioResults } from "@/lib/engine";
import {
  getBreakEvenYear,
  getComparisonValues,
  OUTCOME_COPY,
} from "@/lib/results/outcomeDisplay";
import { useScenarioStore, type DisplayMode } from "@/lib/store/scenarioStore";
import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import { OutcomeModeToggle } from "@/components/scenario/OutcomeModeToggle";
import Link from "next/link";
import { formatCurrency } from "./formatters";

interface HeadlineResultProps {
  results: ScenarioResults;
  displayMode: DisplayMode;
  label?: string;
  showOutcomeToggle?: boolean;
}

export function HeadlineResult({
  results,
  displayMode,
  label,
  showOutcomeToggle = true,
}: HeadlineResultProps) {
  const headlineYear = useScenarioStore((state) => state.headlineYear);
  const outcomeMode = useScenarioStore((state) => state.outcomeMode);
  const setHeadlineYear = useScenarioStore((state) => state.setHeadlineYear);
  const row = results.comparison[headlineYear - 1];
  const values = getComparisonValues(row, displayMode, outcomeMode);
  const copy = OUTCOME_COPY[outcomeMode];
  const delta = values.delta;
  const buyerWins = delta >= 0;
  const breakEvenYear = getBreakEvenYear(results, outcomeMode);

  return (
    <section className="operator-panel rounded-sm p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="operator-kicker min-w-0">
          SYS.STATUS: {label ? `${label} · ` : ""}
          {copy.sysStatus}
        </p>
        {showOutcomeToggle ? <OutcomeModeToggle /> : null}
      </div>
      <h2 className="operator-title mt-3 text-2xl leading-[1.05] sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[0.92]">
        At year {headlineYear}, buying leaves you{" "}
        <span className={buyerWins ? "text-primary" : "text-accent drop-shadow-[0_0_18px_hsl(var(--accent)/0.35)]"}>
          {formatCurrency(Math.abs(delta))}
        </span>{" "}
        {buyerWins ? "ahead" : "behind"} versus renting.
      </h2>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{copy.description}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        <Link className="font-semibold text-primary hover:underline" href="/methodology">
          Read the methodology
        </Link>{" "}
        for a full walkthrough of each path.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Break-even year" value={breakEvenYear ?? "None"} />
        <Metric
          label={copy.buyerMetric}
          value={formatCurrency(values.buyer)}
        />
        <Metric
          label={copy.renterMetric}
          value={formatCurrency(values.renter)}
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
