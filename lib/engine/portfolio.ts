import type { ScenarioInputs } from "./types";

export interface PortfolioState {
  taxablePortfolioValue: number;
  taxableBasis: number;
  taxAdvantagedPortfolioValue: number;
  taxAdvantagedBasis: number;
}

export interface PortfolioSnapshot {
  portfolioValue: number;
  liquidationValue: number;
  capitalGainsTax: number;
  taxablePortfolioValue: number;
  taxAdvantagedPortfolioValue: number;
  taxableBasis: number;
}

export function createPortfolio(initialValue: number): PortfolioState {
  return {
    taxablePortfolioValue: initialValue,
    taxableBasis: initialValue,
    taxAdvantagedPortfolioValue: 0,
    taxAdvantagedBasis: 0,
  };
}

export function growPortfolio(
  state: PortfolioState,
  inputs: ScenarioInputs,
): PortfolioState {
  const growthFactor = 1 + inputs.investment.expectedAnnualReturn;
  const afterTaxDrag = 1 - inputs.investment.annualTaxDrag;

  return {
    taxablePortfolioValue: state.taxablePortfolioValue * growthFactor * afterTaxDrag,
    taxableBasis: state.taxableBasis,
    taxAdvantagedPortfolioValue: state.taxAdvantagedPortfolioValue * growthFactor,
    taxAdvantagedBasis: state.taxAdvantagedBasis,
  };
}

export function contributeToPortfolio(
  state: PortfolioState,
  amount: number,
  inputs: ScenarioInputs,
): PortfolioState {
  if (amount <= 0) {
    return state;
  }

  const taxAdvantagedContribution =
    amount * inputs.investment.taxAdvantagedAccountPercent;
  const taxableContribution = amount - taxAdvantagedContribution;

  return {
    taxablePortfolioValue: state.taxablePortfolioValue + taxableContribution,
    taxableBasis: state.taxableBasis + taxableContribution,
    taxAdvantagedPortfolioValue:
      state.taxAdvantagedPortfolioValue + taxAdvantagedContribution,
    taxAdvantagedBasis: state.taxAdvantagedBasis + taxAdvantagedContribution,
  };
}

export function withdrawFromPortfolio(
  state: PortfolioState,
  amount: number,
): PortfolioState {
  if (amount <= 0) {
    return state;
  }

  let remaining = amount;
  let {
    taxablePortfolioValue,
    taxableBasis,
    taxAdvantagedPortfolioValue,
    taxAdvantagedBasis,
  } = state;

  const fromTaxable = Math.min(remaining, taxablePortfolioValue);
  if (fromTaxable > 0) {
    const basisReduction = taxableBasis * (fromTaxable / taxablePortfolioValue);
    taxablePortfolioValue -= fromTaxable;
    taxableBasis -= basisReduction;
    remaining -= fromTaxable;
  }

  const fromAdvantaged = Math.min(remaining, taxAdvantagedPortfolioValue);
  if (fromAdvantaged > 0) {
    const basisReduction =
      taxAdvantagedBasis * (fromAdvantaged / taxAdvantagedPortfolioValue);
    taxAdvantagedPortfolioValue -= fromAdvantaged;
    taxAdvantagedBasis -= basisReduction;
    remaining -= fromAdvantaged;
  }

  return {
    taxablePortfolioValue,
    taxableBasis,
    taxAdvantagedPortfolioValue,
    taxAdvantagedBasis,
  };
}

export function snapshotPortfolio(
  state: PortfolioState,
  inputs: ScenarioInputs,
): PortfolioSnapshot {
  const taxableGain = Math.max(0, state.taxablePortfolioValue - state.taxableBasis);
  const capitalGainsTax =
    taxableGain *
    (inputs.taxes.longTermCapitalGainsRate +
      inputs.taxes.stateCapitalGainsRate +
      inputs.taxes.niitRate);
  const portfolioValue =
    state.taxablePortfolioValue + state.taxAdvantagedPortfolioValue;

  return {
    portfolioValue,
    liquidationValue: portfolioValue - capitalGainsTax,
    capitalGainsTax,
    taxablePortfolioValue: state.taxablePortfolioValue,
    taxAdvantagedPortfolioValue: state.taxAdvantagedPortfolioValue,
    taxableBasis: state.taxableBasis,
  };
}
