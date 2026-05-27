"use client";

import type { ScenarioResults } from "@/lib/engine";
import {
  buildVerdict,
  getBreakEvenMetricLabel,
  getComparisonValues,
  getComparisonYear,
  OUTCOME_COPY,
} from "@/lib/results/outcomeDisplay";
import { APP_LABELS, WINNER_COLORS } from "@/lib/ui/labels";
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
  const verdict = buildVerdict(results, outcomeMode, displayMode);
  const stayValues = getComparisonValues(
    results.comparison[yearsStaying - 1],
    displayMode,
    outcomeMode,
  );
  const winnerClass =
    verdict.kind === "clear"
      ? verdict.buyerWins
        ? WINNER_COLORS.buying
        : WINNER_COLORS.renting
      : verdict.buyerWinsAtStay
        ? WINNER_COLORS.buying
        : WINNER_COLORS.renting;

  return (
    <section className="de-panel rounded-sm p-4 sm:p-6 lg:p-8">
      {label ? (
        <p className="de-kicker">{label}</p>
      ) : null}

      {verdict.kind === "clear" ? (
        <h2
          className={`de-headline mt-2 text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight ${winnerClass}`}
        >
          {verdict.message}
        </h2>
      ) : (
        <div className="mt-2 space-y-3 sm:space-y-4">
          {verdict.crossoverYear !== null ? (
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Buying becomes better at year{" "}
              <span className={winnerClass}>{verdict.crossoverYear}</span>
            </p>
          ) : null}
          <h2 className="de-headline text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-[2.85rem] lg:leading-tight">
            By your planned stay of{" "}
            <span className={winnerClass}>{verdict.stayYear}</span> years, buying leaves you{" "}
            <span className={winnerClass}>{formatCurrency(verdict.amount)}</span>{" "}
            {verdict.buyerWinsAtStay ? "ahead" : "behind"}
          </h2>
        </div>
      )}

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {copy.description}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          label={copy.buyerMetric}
          prominent
          value={formatCurrency(stayValues.buyer)}
        />
        <Metric
          label={copy.renterMetric}
          prominent
          value={formatCurrency(stayValues.renter)}
        />
        <Metric
          label={getBreakEvenMetricLabel(comparison.kind)}
          value={comparison.breakEven.year}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  prominent = false,
}: {
  label: string;
  value: string | number;
  prominent?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-sm border p-3 ${
        prominent
          ? "border-primary/25 bg-secondary/70"
          : "border-primary/15 bg-secondary/50"
      }`}
    >
      <p
        className={`font-bold uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.22em] ${
          prominent ? "text-[10px] sm:text-[11px]" : "text-[10px]"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 truncate font-serif font-bold tabular-nums ${
          prominent ? "text-2xl sm:text-3xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
