import { calculateInitialBuyerCashOutlay } from "./buyPath";
import {
  contributeToPortfolio,
  createPortfolio,
  growPortfolio,
  snapshotPortfolio,
  withdrawFromPortfolio,
} from "./portfolio";
import { calculateRentAnnualOutflow } from "./rentHelpers";
import type { BuyYearResult, RentYearResult, ScenarioInputs } from "./types";

export function calculateRentPath(
  inputs: ScenarioInputs,
  buyPath: BuyYearResult[],
): RentYearResult[] {
  const initialInvestment = calculateInitialBuyerCashOutlay(inputs);
  let portfolio = createPortfolio(initialInvestment);
  let cumulativeOutflow = 0;
  const rows: RentYearResult[] = [];
  const equalizeRenterCashflow = inputs.investment.equalizeRenterCashflow ?? false;

  for (let year = 1; year <= inputs.horizonYears; year += 1) {
    portfolio = growPortfolio(portfolio, inputs);

    const rentPaid =
      inputs.rent.monthlyRent *
      12 *
      (1 + inputs.rent.annualRentGrowthRate) ** (year - 1);
    const rentersInsurancePaid = inputs.rent.rentersInsuranceMonthly * 12;
    const annualOutflow = rentPaid + rentersInsurancePaid;
    cumulativeOutflow += annualOutflow;

    const outflowGap = buyPath[year - 1].annualOutflow - annualOutflow;
    let investedSavings = 0;
    let withdrawnSavings = 0;

    if (equalizeRenterCashflow) {
      if (outflowGap > 0) {
        investedSavings = outflowGap;
        portfolio = contributeToPortfolio(portfolio, outflowGap, inputs);
      } else if (outflowGap < 0) {
        withdrawnSavings = -outflowGap;
        portfolio = withdrawFromPortfolio(portfolio, withdrawnSavings);
      }
    } else if (outflowGap > 0) {
      investedSavings = outflowGap;
      portfolio = contributeToPortfolio(portfolio, outflowGap, inputs);
    }

    const snapshot = snapshotPortfolio(portfolio, inputs);

    rows.push({
      year,
      rentPaid,
      rentersInsurancePaid,
      annualOutflow,
      cumulativeOutflow,
      outflowGap,
      investedSavings,
      withdrawnSavings,
      initialInvestment,
      taxablePortfolioValue: snapshot.taxablePortfolioValue,
      taxAdvantagedPortfolioValue: snapshot.taxAdvantagedPortfolioValue,
      portfolioValue: snapshot.portfolioValue,
      liquidationValue: snapshot.liquidationValue,
      taxableBasis: snapshot.taxableBasis,
      capitalGainsTax: snapshot.capitalGainsTax,
      netEconomicResult: snapshot.liquidationValue - cumulativeOutflow,
    });
  }

  return rows;
}

export { calculateRentAnnualOutflow };
