import { describe, expect, it } from "vitest";
import {
  comparePaths,
  findBreakEvenYear,
  resolveBreakEven,
} from "@/lib/engine";
import { getComparisonYear } from "@/lib/results/outcomeDisplay";
import { calculate } from "@/lib/engine";
import { baseScenario } from "./helpers";

describe("comparison", () => {
  it("computes nominal and real deltas from net economic results", () => {
    const comparison = comparePaths(
      [
        {
          year: 1,
          homeValue: 0,
          remainingMortgageBalance: 0,
          mortgagePrincipalPaid: 0,
          mortgageInterestPaid: 0,
          pmiPaid: 0,
          propertyTaxPaid: 0,
          insurancePaid: 0,
          hoaPaid: 0,
          maintenancePaid: 0,
          taxBenefit: 0,
          annualOutflow: 0,
          cumulativeOutflow: 0,
          sellingCosts: 0,
          capitalGainsTax: 0,
          saleProceeds: 110,
          buyerCashflowSavings: 0,
          sidePortfolioValue: 0,
          sidePortfolioLiquidation: 0,
          netEconomicResult: 10,
        },
      ],
      [
        {
          year: 1,
          rentPaid: 0,
          rentersInsurancePaid: 0,
          annualOutflow: 0,
          cumulativeOutflow: 0,
          outflowGap: 0,
          investedSavings: 0,
          withdrawnSavings: 0,
          initialInvestment: 100,
          taxablePortfolioValue: 100,
          taxAdvantagedPortfolioValue: 0,
          portfolioValue: 100,
          liquidationValue: 100,
          taxableBasis: 100,
          capitalGainsTax: 0,
          netEconomicResult: 0,
        },
      ],
      0.1,
    );

    expect(comparison[0].delta).toBe(10);
    expect(comparison[0].realDelta).toBeCloseTo(9.09, 2);
    expect(comparison[0].buyerNetWorth).toBe(110);
    expect(comparison[0].renterNetWorth).toBe(100);
    expect(comparison[0].netWorthDelta).toBe(10);
  });

  it("finds break-even years for net worth independently", () => {
    expect(
      findBreakEvenYear(
        [
          comparisonRow(1, -10, -5),
          comparisonRow(2, -2, -1),
          comparisonRow(3, 1, 2),
          comparisonRow(4, 3, 4),
        ],
        "netWorth",
      ),
    ).toBe(3);
  });

  it("finds the first durable positive break-even year", () => {
    expect(
      findBreakEvenYear([
        comparisonRow(1, -10),
        comparisonRow(2, 5),
        comparisonRow(3, -1),
        comparisonRow(4, 2),
        comparisonRow(5, 3),
      ]),
    ).toBe(4);
  });

  it("falls back to first intersection when durability fails", () => {
    const resolved = resolveBreakEven([
      comparisonRow(1, -10),
      comparisonRow(2, 5),
      comparisonRow(3, -1),
      comparisonRow(4, -2),
      comparisonRow(5, -3),
    ]);

    expect(resolved).toEqual({
      year: 2,
      kind: "firstIntersection",
      deltaAtYear: 5,
    });
  });

  it("falls back to closest-to-even when buying never leads", () => {
    const resolved = resolveBreakEven([
      comparisonRow(1, -5),
      comparisonRow(2, -4),
      comparisonRow(3, -3),
      comparisonRow(4, -2),
      comparisonRow(5, -1),
    ]);

    expect(resolved).toEqual({
      year: 5,
      kind: "closestToEven",
      deltaAtYear: -1,
    });
  });

  it("derives comparison year from resolveBreakEven", () => {
    const results = calculate(baseScenario());

    expect(getComparisonYear(results, "netWorth", "nominal").year).toBeGreaterThan(0);
    expect(getComparisonYear(results, "costAdjusted", "nominal").kind).toBeDefined();
  });
});

function comparisonRow(year: number, delta: number, netWorthDelta = delta) {
  return {
    year,
    buyerNetResult: delta,
    renterNetResult: 0,
    delta,
    realBuyerNetResult: delta,
    realRenterNetResult: 0,
    realDelta: delta,
    buyerNetWorth: netWorthDelta,
    renterNetWorth: 0,
    netWorthDelta,
    realBuyerNetWorth: netWorthDelta,
    realRenterNetWorth: 0,
    realNetWorthDelta: netWorthDelta,
  };
}
