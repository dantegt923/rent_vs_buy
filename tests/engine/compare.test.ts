import { describe, expect, it } from "vitest";
import { comparePaths, findBreakEvenYear } from "@/lib/engine";

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
});

function comparisonRow(year: number, delta: number) {
  return {
    year,
    buyerNetResult: delta,
    renterNetResult: 0,
    delta,
    realBuyerNetResult: delta,
    realRenterNetResult: 0,
    realDelta: delta,
  };
}
