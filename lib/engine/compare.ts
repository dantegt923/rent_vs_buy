import { toRealDollars } from "./inflation";
import type {
  BreakEvenKind,
  BreakEvenResult,
  BuyYearResult,
  ComparisonYearResult,
  RentYearResult,
} from "./types";

export type OutcomeComparisonMode = "costAdjusted" | "netWorth";

export function comparePaths(
  buyPath: BuyYearResult[],
  rentPath: RentYearResult[],
  inflationRate: number,
): ComparisonYearResult[] {
  return buyPath.map((buyYear, index) => {
    const rentYear = rentPath[index];
    const buyerNetWorth = buyYear.saleProceeds + buyYear.sidePortfolioLiquidation;
    const renterNetWorth = rentYear.liquidationValue;
    const delta = buyYear.netEconomicResult - rentYear.netEconomicResult;
    const netWorthDelta = buyerNetWorth - renterNetWorth;

    return {
      year: buyYear.year,
      buyerNetResult: buyYear.netEconomicResult,
      renterNetResult: rentYear.netEconomicResult,
      delta,
      realBuyerNetResult: toRealDollars(
        buyYear.netEconomicResult,
        inflationRate,
        buyYear.year,
      ),
      realRenterNetResult: toRealDollars(
        rentYear.netEconomicResult,
        inflationRate,
        buyYear.year,
      ),
      realDelta: toRealDollars(delta, inflationRate, buyYear.year),
      buyerNetWorth,
      renterNetWorth,
      netWorthDelta,
      realBuyerNetWorth: toRealDollars(
        buyerNetWorth,
        inflationRate,
        buyYear.year,
      ),
      realRenterNetWorth: toRealDollars(
        renterNetWorth,
        inflationRate,
        buyYear.year,
      ),
      realNetWorthDelta: toRealDollars(netWorthDelta, inflationRate, buyYear.year),
    };
  });
}

function getDeltaForMode(
  row: ComparisonYearResult,
  mode: OutcomeComparisonMode,
  useReal: boolean,
): number {
  if (mode === "netWorth") {
    return useReal ? row.realNetWorthDelta : row.netWorthDelta;
  }

  return useReal ? row.realDelta : row.delta;
}

export function resolveBreakEven(
  comparison: ComparisonYearResult[],
  mode: OutcomeComparisonMode = "costAdjusted",
  useReal = false,
): BreakEvenResult {
  if (comparison.length === 0) {
    return { year: 1, kind: "closestToEven", deltaAtYear: 0 };
  }

  const getDelta = (row: ComparisonYearResult) =>
    getDeltaForMode(row, mode, useReal);

  const durableYear = comparison.find((row, index) => {
    if (getDelta(row) <= 0) {
      return false;
    }

    return comparison.slice(index).every((futureRow) => getDelta(futureRow) > 0);
  });

  if (durableYear) {
    return {
      year: durableYear.year,
      kind: "durable",
      deltaAtYear: getDelta(durableYear),
    };
  }

  for (let index = 0; index < comparison.length; index += 1) {
    const row = comparison[index];
    const delta = getDelta(row);
    const previousDelta = index === 0 ? 0 : getDelta(comparison[index - 1]);

    if (delta > 0 && previousDelta <= 0) {
      return {
        year: row.year,
        kind: "firstIntersection",
        deltaAtYear: delta,
      };
    }
  }

  let closestRow = comparison[0];
  let closestAbs = Math.abs(getDelta(closestRow));

  for (const row of comparison.slice(1)) {
    const absDelta = Math.abs(getDelta(row));

    if (absDelta < closestAbs || (absDelta === closestAbs && row.year < closestRow.year)) {
      closestRow = row;
      closestAbs = absDelta;
    }
  }

  return {
    year: closestRow.year,
    kind: "closestToEven",
    deltaAtYear: getDelta(closestRow),
  };
}

export function findBreakEvenYear(
  comparison: ComparisonYearResult[],
  mode: OutcomeComparisonMode = "costAdjusted",
): number | null {
  const resolved = resolveBreakEven(comparison, mode);

  return resolved.kind === "durable" ? resolved.year : null;
}

export function getBreakEvenKindLabel(kind: BreakEvenKind): string {
  switch (kind) {
    case "durable":
      return "Break-even year";
    case "firstIntersection":
      return "First year buying leads";
    case "closestToEven":
      return "Closest to even";
    default:
      return "Comparison year";
  }
}

export type { BreakEvenKind, BreakEvenResult };
