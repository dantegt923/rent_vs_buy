import {
  getBreakEvenKindLabel,
  resolveBreakEven,
  type BreakEvenKind,
  type BreakEvenResult,
  type ScenarioResults,
} from "@/lib/engine";
import type { ComparisonYearResult } from "@/lib/engine";
import { APP_LABELS } from "@/lib/ui/labels";
import type { DisplayMode, OutcomeMode } from "@/lib/store/scenarioStore";

export interface OutcomeCopy {
  headlineFraming: string;
  description: string;
  buyerMetric: string;
  renterMetric: string;
  chartTitle: string;
  chartDescription: string;
  buyerLine: string;
  renterLine: string;
}

export const OUTCOME_COPY: Record<OutcomeMode, OutcomeCopy> = {
  costAdjusted: {
    headlineFraming: "net result",
    description:
      "Net result measures what you keep after liquidating (home sale or portfolio, after tax) minus housing costs you cannot recover through those assets. Down payment, closing costs, and mortgage principal are excluded from costs because they return through home equity at sale.",
    buyerMetric: APP_LABELS.netWorthIfBuy,
    renterMetric: APP_LABELS.netWorthIfRent,
    chartTitle: APP_LABELS.chartTitleResult,
    chartDescription:
      "Unrecoverable housing costs minus asset recovery on each path. Optional cashflow assumptions in Investment can shift the renter or buyer line when toggled on.",
    buyerLine: APP_LABELS.netWorthIfBuy,
    renterLine: APP_LABELS.netWorthIfRent,
  },
  netWorth: {
    headlineFraming: "net worth",
    description:
      "Net worth at your planned stay if you liquidate at that point: estimated home sale proceeds plus any buyer side portfolio, versus the renter's portfolio after tax. It does not subtract cumulative housing costs paid along the way.",
    buyerMetric: APP_LABELS.netWorthIfBuy,
    renterMetric: APP_LABELS.netWorthIfRent,
    chartTitle: APP_LABELS.chartTitleWealth,
    chartDescription:
      "Liquidation value on each path at every year—home sale plus side portfolio for buyers, investment portfolio for renters.",
    buyerLine: APP_LABELS.netWorthIfBuy,
    renterLine: APP_LABELS.netWorthIfRent,
  },
};

export interface ComparisonValues {
  buyer: number;
  renter: number;
  delta: number;
}

export interface ComparisonYearContext {
  year: number;
  kind: BreakEvenKind;
  values: ComparisonValues;
  breakEven: BreakEvenResult;
}

export interface ClearVerdict {
  kind: "clear";
  message: string;
  buyerWins: boolean;
}

export interface SplitVerdict {
  kind: "split";
  crossoverYear: number | null;
  stayYear: number;
  amount: number;
  buyerWinsAtStay: boolean;
}

export type Verdict = ClearVerdict | SplitVerdict;

export function getComparisonValues(
  row: ComparisonYearResult,
  displayMode: DisplayMode,
  outcomeMode: OutcomeMode,
): ComparisonValues {
  if (outcomeMode === "netWorth") {
    return {
      buyer: displayMode === "real" ? row.realBuyerNetWorth : row.buyerNetWorth,
      renter: displayMode === "real" ? row.realRenterNetWorth : row.renterNetWorth,
      delta: displayMode === "real" ? row.realNetWorthDelta : row.netWorthDelta,
    };
  }

  return {
    buyer: displayMode === "real" ? row.realBuyerNetResult : row.buyerNetResult,
    renter: displayMode === "real" ? row.realRenterNetResult : row.renterNetResult,
    delta: displayMode === "real" ? row.realDelta : row.delta,
  };
}

export function getBreakEvenResult(
  results: ScenarioResults,
  outcomeMode: OutcomeMode,
  displayMode: DisplayMode,
): BreakEvenResult {
  const useReal = displayMode === "real";
  return resolveBreakEven(results.comparison, outcomeMode, useReal);
}

export function getBreakEvenYear(
  results: ScenarioResults,
  outcomeMode: OutcomeMode,
  displayMode: DisplayMode = "nominal",
): number {
  return getBreakEvenResult(results, outcomeMode, displayMode).year;
}

export function getComparisonYear(
  results: ScenarioResults,
  outcomeMode: OutcomeMode,
  displayMode: DisplayMode,
): ComparisonYearContext {
  const breakEven = getBreakEvenResult(results, outcomeMode, displayMode);
  const row = results.comparison[breakEven.year - 1];

  return {
    year: breakEven.year,
    kind: breakEven.kind,
    values: getComparisonValues(row, displayMode, outcomeMode),
    breakEven,
  };
}

export function getBreakEvenMetricLabel(kind: BreakEvenKind): string {
  return getBreakEvenKindLabel(kind);
}

function getHorizonComparison(
  results: ScenarioResults,
  outcomeMode: OutcomeMode,
  displayMode: DisplayMode,
): ComparisonValues[] {
  return results.comparison
    .slice(0, results.inputs.horizonYears)
    .map((row) => getComparisonValues(row, displayMode, outcomeMode));
}

function findBuyingCrossoverYear(
  results: ScenarioResults,
  outcomeMode: OutcomeMode,
  displayMode: DisplayMode,
): number | null {
  const rows = results.comparison.slice(0, results.inputs.horizonYears);

  for (let index = 0; index < rows.length; index += 1) {
    const delta = getComparisonValues(rows[index], displayMode, outcomeMode).delta;
    const previousDelta =
      index === 0 ? 0 : getComparisonValues(rows[index - 1], displayMode, outcomeMode).delta;

    if (delta > 0 && previousDelta <= 0) {
      return rows[index].year;
    }
  }

  return null;
}

export function buildVerdict(
  results: ScenarioResults,
  outcomeMode: OutcomeMode,
  displayMode: DisplayMode,
): Verdict {
  const horizonValues = getHorizonComparison(results, outcomeMode, displayMode);
  const stayYear = results.inputs.saleYear;
  const stayValues = getComparisonValues(
    results.comparison[stayYear - 1],
    displayMode,
    outcomeMode,
  );
  const buyerWinsAtStay = stayValues.delta >= 0;

  const allBuyerWins = horizonValues.every((values) => values.delta >= 0);
  const allRenterWins = horizonValues.every((values) => values.delta <= 0);

  if (allBuyerWins) {
    return {
      kind: "clear",
      message: "Buying stays better across the full loan term",
      buyerWins: true,
    };
  }

  if (allRenterWins) {
    return {
      kind: "clear",
      message: "Renting stays better across the full loan term",
      buyerWins: false,
    };
  }

  return {
    kind: "split",
    crossoverYear: findBuyingCrossoverYear(results, outcomeMode, displayMode),
    stayYear,
    amount: Math.abs(stayValues.delta),
    buyerWinsAtStay,
  };
}
