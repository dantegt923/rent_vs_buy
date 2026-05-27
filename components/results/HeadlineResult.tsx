"use client";

import type { ScenarioResults } from "@/lib/engine";
import {
  buildHeadlineCopy,
  getBreakEvenMetricLabel,
  getComparisonYear,
  OUTCOME_COPY,
} from "@/lib/results/outcomeDisplay";
import { APP_LABELS } from "@/lib/ui/labels";
import { useScenarioStore, type DisplayMode } from "@/lib/store/scenarioStore";
import { formatCurrency } from "./formatters";

interface HeadlineResultProps {
  results: ScenarioResults;
  displayMode: DisplayMode;
  label?: string;
}

export function HeadlineResult({
  results,
  displayMode,
  label,
}: HeadlineResultProps) {
  const outcomeMode = useScenarioStore((state) => state.outcomeMode);
  const yearsStaying = results.inputs.saleYear;
  const comparison = getComparisonYear(results, outcomeMode, displayMode);
  const copy = OUTCOME_COPY[outcomeMode];
  const { values, kind } = comparison;
  const buyerWins = values.delta >= 0;
  const headlineText = buildHeadlineCopy(comparison, outcomeMode);

  return (
    <section className="de-panel rounded-sm p-4 sm:p-6 lg:p-8">
      {label ? (
        <p className="de-kicker">{label}</p>
      ) : null}
      <h2 className="de-headline mt-2 text-2xl leading-[1.05] sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[0.92]">
        {headlineText.split(/(\$[\d,]+)/).map((part, index) =>
          part.startsWith("$") ? (
            <span
              className={
                buyerWins
                  ? "text-primary"
                  : "text-accent drop-shadow-[0_0_18px_hsl(var(--accent)/0.35)]"
              }
              key={index}
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </h2>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{copy.description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric
          label={getBreakEvenMetricLabel(kind)}
          value={comparison.breakEven.year}
        />
        <Metric label={copy.buyerMetric} value={formatCurrency(values.buyer)} />
        <Metric label={copy.renterMetric} value={formatCurrency(values.renter)} />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Planned stay: {yearsStaying} years · Horizon: {results.inputs.horizonYears} years
      </p>
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
