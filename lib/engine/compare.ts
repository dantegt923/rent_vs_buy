import { toRealDollars } from "./inflation";
import type {
  BuyYearResult,
  ComparisonYearResult,
  RentYearResult,
} from "./types";

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

export function findBreakEvenYear(
  comparison: ComparisonYearResult[],
  mode: "costAdjusted" | "netWorth" = "costAdjusted",
): number | null {
  const getDelta = (row: ComparisonYearResult) =>
    mode === "netWorth" ? row.netWorthDelta : row.delta;

  const firstDurablePositiveYear = comparison.find((row, index) => {
    if (getDelta(row) <= 0) {
      return false;
    }

    return comparison.slice(index).every((futureRow) => getDelta(futureRow) > 0);
  });

  return firstDurablePositiveYear?.year ?? null;
}
