import type { ScenarioInputs } from "./types";

export function calculateRentAnnualOutflow(
  inputs: ScenarioInputs,
  year: number,
): number {
  const rentPaid =
    inputs.rent.monthlyRent *
    12 *
    (1 + inputs.rent.annualRentGrowthRate) ** (year - 1);
  const rentersInsurancePaid = inputs.rent.rentersInsuranceMonthly * 12;

  return rentPaid + rentersInsurancePaid;
}
