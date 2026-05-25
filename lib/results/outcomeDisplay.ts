import type { ComparisonYearResult } from "@/lib/engine";
import type { DisplayMode, OutcomeMode } from "@/lib/store/scenarioStore";

export interface OutcomeCopy {
  sysStatus: string;
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
    sysStatus: "cost-adjusted net position",
    description:
      "This is an unrecoverable cost-adjusted net position. It measures what you keep after liquidating (home sale or portfolio, after tax) minus housing costs you cannot recover through those assets. Down payment, closing costs, and mortgage principal are excluded from costs because they return through home equity at sale.",
    buyerMetric: "Buyer adjusted position",
    renterMetric: "Renter adjusted position",
    chartTitle: "Cost-Adjusted Net Position: Buy vs. Rent",
    chartDescription:
      "Unrecoverable housing costs minus asset recovery on each path. Optional cashflow assumptions in Investment can shift the renter or buyer line when toggled on.",
    buyerLine: "Buyer adjusted position",
    renterLine: "Renter adjusted position",
  },
  netWorth: {
    sysStatus: "net worth",
    description:
      "This is net worth at the horizon year if you liquidate at that point: estimated home sale proceeds plus any buyer side portfolio, versus the renter's portfolio after tax. It does not subtract cumulative housing costs paid along the way.",
    buyerMetric: "Buyer net worth",
    renterMetric: "Renter net worth",
    chartTitle: "Net Worth: Buy vs. Rent",
    chartDescription:
      "Liquidation value on each path at every year—home sale plus side portfolio for buyers, investment portfolio for renters.",
    buyerLine: "Buyer net worth",
    renterLine: "Renter net worth",
  },
};

export interface ComparisonValues {
  buyer: number;
  renter: number;
  delta: number;
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

export function getBreakEvenYear(
  results: { breakEvenYear: number | null; netWorthBreakEvenYear: number | null },
  outcomeMode: OutcomeMode,
): number | null {
  return outcomeMode === "netWorth"
    ? results.netWorthBreakEvenYear
    : results.breakEvenYear;
}
