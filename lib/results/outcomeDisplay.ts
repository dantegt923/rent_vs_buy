import { getBreakEvenKindLabel, resolveBreakEven, type BreakEvenKind, type BreakEvenResult, type ScenarioResults } from "@/lib/engine";
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
    headlineFraming: "financial outcome",
    description:
      "Financial outcome measures what you keep after liquidating (home sale or portfolio, after tax) minus housing costs you cannot recover through those assets. Down payment, closing costs, and mortgage principal are excluded from costs because they return through home equity at sale.",
    buyerMetric: APP_LABELS.ifBuying,
    renterMetric: APP_LABELS.ifRenting,
    chartTitle: APP_LABELS.chartTitle,
    chartDescription:
      "Unrecoverable housing costs minus asset recovery on each path. Optional cashflow assumptions in Investment can shift the renter or buyer line when toggled on.",
    buyerLine: APP_LABELS.ifBuying,
    renterLine: APP_LABELS.ifRenting,
  },
  netWorth: {
    headlineFraming: "net worth",
    description:
      "Net worth at the comparison year if you liquidate at that point: estimated home sale proceeds plus any buyer side portfolio, versus the renter's portfolio after tax. It does not subtract cumulative housing costs paid along the way.",
    buyerMetric: APP_LABELS.ifBuying,
    renterMetric: APP_LABELS.ifRenting,
    chartTitle: APP_LABELS.chartTitle,
    chartDescription:
      "Liquidation value on each path at every year—home sale plus side portfolio for buyers, investment portfolio for renters.",
    buyerLine: APP_LABELS.ifBuying,
    renterLine: APP_LABELS.ifRenting,
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

export interface HeadlineParts {
  contextLine: string;
  amountLine: string;
  amount: number;
  buyerWins: boolean;
}

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

export function buildHeadlineParts(
  context: ComparisonYearContext,
  outcomeMode: OutcomeMode,
): HeadlineParts {
  const { kind, values } = context;
  const amount = Math.abs(values.delta);
  const buyerWins = values.delta >= 0;
  const direction = buyerWins ? "ahead" : "behind";
  const framing = OUTCOME_COPY[outcomeMode].headlineFraming;
  const formattedAmount = `$${formatPlainCurrency(amount)}`;

  if (kind === "durable") {
    return {
      contextLine: `Break-even is year ${context.breakEven.year}.`,
      amountLine: `At that point, buying leaves you ${formattedAmount} ${direction} on ${framing}.`,
      amount,
      buyerWins,
    };
  }

  if (kind === "firstIntersection") {
    return {
      contextLine: `Buying leads starting in year ${context.breakEven.year}.`,
      amountLine: `At that point, buying leaves you ${formattedAmount} ${direction} on ${framing}.`,
      amount,
      buyerWins,
    };
  }

  return {
    contextLine: `The paths are closest in year ${context.breakEven.year}.`,
    amountLine: `At that point, buying leaves you ${formattedAmount} ${direction} on ${framing}.`,
    amount,
    buyerWins,
  };
}

/** @deprecated Use buildHeadlineParts for structured rendering. */
export function buildHeadlineCopy(
  context: ComparisonYearContext,
  outcomeMode: OutcomeMode,
): string {
  const parts = buildHeadlineParts(context, outcomeMode);
  return `${parts.contextLine} ${parts.amountLine}`;
}

function formatPlainCurrency(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
