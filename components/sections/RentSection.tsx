"use client";

import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";
import { SectionCard } from "./SectionCard";

type SectionMode = "simple" | "advanced";

export function RentSection({
  scenarioId,
  mode = "simple",
}: {
  scenarioId: ScenarioId;
  mode?: SectionMode;
}) {
  const rent = useScenarioStore((state) => state.scenarios[scenarioId].rent);
  const setRent = useScenarioStore((state) => state.setRent);

  if (mode === "advanced") {
    return (
      <SectionCard eyebrow="Rental path" title="Rent">
        <NumberSliderInput
          format="percent"
          label="Annual rent growth"
          max={10}
          min={0}
          onChange={(value) => setRent("annualRentGrowthRate", value / 100, scenarioId)}
          step={0.1}
          value={rent.annualRentGrowthRate * 100}
        />
        <NumberSliderInput
          format="currency"
          label="Renter's insurance monthly"
          max={250}
          min={0}
          onChange={(value) => setRent("rentersInsuranceMonthly", value, scenarioId)}
          step={5}
          value={rent.rentersInsuranceMonthly}
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard eyebrow="Rental path" title="Rent">
      <NumberSliderInput
        format="currency"
        label="Current monthly rent"
        max={10_000}
        min={0}
        onChange={(value) => setRent("monthlyRent", value, scenarioId)}
        step={50}
        value={rent.monthlyRent}
      />
      <NumberSliderInput
        format="currency"
        label="Renter's insurance monthly"
        max={250}
        min={0}
        onChange={(value) => setRent("rentersInsuranceMonthly", value, scenarioId)}
        step={5}
        value={rent.rentersInsuranceMonthly}
      />
    </SectionCard>
  );
}
