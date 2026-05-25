import { describe, expect, it } from "vitest";
import { calculate } from "@/lib/engine";
import { baseScenario } from "./helpers";

describe("investment assumption toggles", () => {
  it("withdraws from the renter portfolio when equalize renter cashflow is enabled", () => {
    const scenario = baseScenario({
      rent: {
        monthlyRent: 8_000,
        annualRentGrowthRate: 0.03,
        rentersInsuranceMonthly: 25,
      },
      investment: {
        expectedAnnualReturn: 0,
        annualTaxDrag: 0,
        taxAdvantagedAccountPercent: 0,
        equalizeRenterCashflow: true,
        investBuyerCashflowSavings: false,
      },
    });

    const results = calculate(scenario);
    const rent = results.rentPath[0];

    expect(rent.outflowGap).toBeLessThan(0);
    expect(rent.withdrawnSavings).toBeGreaterThan(0);
    expect(rent.investedSavings).toBe(0);
    expect(rent.portfolioValue).toBeLessThan(rent.initialInvestment);
  });

  it("does not withdraw by default when renting costs more than owning", () => {
    const scenario = baseScenario({
      rent: {
        monthlyRent: 8_000,
        annualRentGrowthRate: 0.03,
        rentersInsuranceMonthly: 25,
      },
      investment: {
        expectedAnnualReturn: 0.07,
        annualTaxDrag: 0.005,
        taxAdvantagedAccountPercent: 0,
        equalizeRenterCashflow: false,
        investBuyerCashflowSavings: false,
      },
    });

    const results = calculate(scenario);

    expect(results.rentPath[0].withdrawnSavings).toBe(0);
    expect(results.rentPath[0].investedSavings).toBe(0);
  });

  it("adds a buyer side portfolio without double-counting home equity", () => {
    const withoutToggle = calculate(
      baseScenario({
        investment: {
          expectedAnnualReturn: 0.07,
          annualTaxDrag: 0,
          taxAdvantagedAccountPercent: 0,
          equalizeRenterCashflow: false,
          investBuyerCashflowSavings: false,
        },
      }),
    );
    const withToggle = calculate(
      baseScenario({
        investment: {
          expectedAnnualReturn: 0.07,
          annualTaxDrag: 0,
          taxAdvantagedAccountPercent: 0,
          equalizeRenterCashflow: false,
          investBuyerCashflowSavings: true,
        },
      }),
    );
    const year = 35;

    expect(withToggle.buyPath[year - 1].buyerCashflowSavings).toBeGreaterThan(0);
    expect(withToggle.buyPath[year - 1].sidePortfolioLiquidation).toBeGreaterThan(0);
    expect(withoutToggle.buyPath[year - 1].sidePortfolioLiquidation).toBe(0);
    expect(withToggle.comparison[year - 1].buyerNetResult).toBeGreaterThan(
      withoutToggle.comparison[year - 1].buyerNetResult,
    );
    expect(withToggle.buyPath[year - 1].saleProceeds).toBeCloseTo(
      withoutToggle.buyPath[year - 1].saleProceeds,
      0,
    );
  });
});
