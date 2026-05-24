import { calculateInitialBuyerCashOutlay } from "./buyPath";
import type { BuyYearResult, RentYearResult, ScenarioInputs } from "./types";

export function calculateRentPath(
  inputs: ScenarioInputs,
  buyPath: BuyYearResult[],
): RentYearResult[] {
  const initialInvestment = calculateInitialBuyerCashOutlay(inputs);
  let taxablePortfolioValue = initialInvestment;
  let taxableBasis = initialInvestment;
  let taxAdvantagedPortfolioValue = 0;
  let taxAdvantagedBasis = 0;
  let cumulativeOutflow = 0;
  const rows: RentYearResult[] = [];

  for (let year = 1; year <= inputs.horizonYears; year += 1) {
    taxablePortfolioValue *= 1 + inputs.investment.expectedAnnualReturn;
    taxAdvantagedPortfolioValue *= 1 + inputs.investment.expectedAnnualReturn;
    taxablePortfolioValue *= 1 - inputs.investment.annualTaxDrag;

    const rentPaid =
      inputs.rent.monthlyRent *
      12 *
      (1 + inputs.rent.annualRentGrowthRate) ** (year - 1);
    const rentersInsurancePaid = inputs.rent.rentersInsuranceMonthly * 12;
    const annualOutflow = rentPaid + rentersInsurancePaid;
    cumulativeOutflow += annualOutflow;

    const outflowGap = buyPath[year - 1].annualOutflow - annualOutflow;
    const investedSavings = Math.max(0, outflowGap);

    if (investedSavings > 0) {
      const taxAdvantagedContribution =
        investedSavings * inputs.investment.taxAdvantagedAccountPercent;
      const taxableContribution = investedSavings - taxAdvantagedContribution;
      taxablePortfolioValue += taxableContribution;
      taxableBasis += taxableContribution;
      taxAdvantagedPortfolioValue += taxAdvantagedContribution;
      taxAdvantagedBasis += taxAdvantagedContribution;
    }

    const taxableGain = Math.max(0, taxablePortfolioValue - taxableBasis);
    const capitalGainsTax =
      taxableGain *
      (inputs.taxes.longTermCapitalGainsRate +
        inputs.taxes.stateCapitalGainsRate +
        inputs.taxes.niitRate);
    const portfolioValue = taxablePortfolioValue + taxAdvantagedPortfolioValue;
    const liquidationValue = portfolioValue - capitalGainsTax;

    rows.push({
      year,
      rentPaid,
      rentersInsurancePaid,
      annualOutflow,
      cumulativeOutflow,
      outflowGap,
      investedSavings,
      initialInvestment,
      taxablePortfolioValue,
      taxAdvantagedPortfolioValue,
      portfolioValue,
      liquidationValue,
      taxableBasis,
      capitalGainsTax,
      netEconomicResult: liquidationValue - cumulativeOutflow,
    });
  }

  return rows;
}
