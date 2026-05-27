import { describe, expect, it } from "vitest";
import { calculate } from "@/lib/engine";
import { baseScenario } from "./helpers";

describe("net economic result model", () => {
  it("increases buyer net cost when property tax rises", () => {
    const base = baseScenario();
    const lowTax = calculate(
      baseScenario({
        ownershipCosts: { ...base.ownershipCosts, propertyTaxRate: 0.005 },
      }),
    );
    const highTax = calculate(
      baseScenario({
        ownershipCosts: { ...base.ownershipCosts, propertyTaxRate: 0.025 },
      }),
    );
    const year = 15;

    expect(highTax.buyPath[year - 1].cumulativeOutflow).toBeGreaterThan(
      lowTax.buyPath[year - 1].cumulativeOutflow,
    );
    expect(highTax.comparison[year - 1].buyerNetResult).toBeLessThan(
      lowTax.comparison[year - 1].buyerNetResult,
    );
  });

  it("avoids post-payoff portfolio withdrawals when rent exceeds ownership costs", () => {
    const results = calculate(
      baseScenario({
        horizonYears: 35,
        property: {
          ...baseScenario().property,
          purchaseMode: {
            kind: "mortgage",
            downPayment: { kind: "percent", value: 0.2 },
            mortgageRate: 0.07,
            loanTermYears: 30,
            pmiRate: 0.005,
            extraMonthlyPayment: 0,
            lumpSumPrepayments: [],
          },
        },
      }),
    );
    const portfolioGain30 =
      results.rentPath[29].portfolioValue - results.rentPath[28].portfolioValue;
    const portfolioGain31 =
      results.rentPath[30].portfolioValue - results.rentPath[29].portfolioValue;

    expect(results.rentPath[30].investedSavings).toBe(0);
    expect(results.rentPath[30].outflowGap).toBeLessThan(0);
    expect(portfolioGain31).toBeGreaterThan(portfolioGain30 * 0.6);
  });

  it("matches liquidation minus cumulative rent at year 1", () => {
    const results = calculate(baseScenario());
    const rent = results.rentPath[0];

    expect(rent.netEconomicResult).toBeCloseTo(
      rent.liquidationValue - rent.cumulativeOutflow,
      2,
    );
    expect(rent.netEconomicResult).toBeGreaterThan(90_000);
    expect(rent.netEconomicResult).toBeLessThan(110_000);
  });

  it("excludes down payment and principal from buyer net at mortgage payoff", () => {
    const results = calculate(baseScenario());
    const buy = results.buyPath[29];
    const downPayment = results.inputs.property.homePrice * 0.2;
    let cumulativePrincipalPaid = 0;

    for (let year = 0; year < 30; year += 1) {
      cumulativePrincipalPaid += results.buyPath[year].mortgagePrincipalPaid;
    }

    const operatingOutflow =
      buy.cumulativeOutflow - downPayment - cumulativePrincipalPaid;

    expect(buy.remainingMortgageBalance).toBe(0);
    expect(buy.netEconomicResult).toBeCloseTo(
      buy.saleProceeds - operatingOutflow,
      0,
    );
    expect(buy.netEconomicResult).toBeGreaterThan(-150_000);
    expect(buy.netEconomicResult).toBeLessThan(50_000);
  });
});
