"use client";

import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";
import { SectionCard } from "./SectionCard";

type SectionMode = "simple" | "advanced";

export function AppreciationSection({
  scenarioId,
  mode = "simple",
}: {
  scenarioId: ScenarioId;
  mode?: SectionMode;
}) {
  const appreciation = useScenarioStore(
    (state) => state.scenarios[scenarioId].appreciation,
  );
  const setAppreciation = useScenarioStore((state) => state.setAppreciation);

  if (mode === "advanced") {
    return (
      <SectionCard eyebrow="Exit assumptions" title="Home Appreciation">
        <NumberSliderInput
          format="percent"
          label="Selling costs"
          max={10}
          min={0}
          onChange={(value) => setAppreciation("sellingCostRate", value / 100, scenarioId)}
          step={0.1}
          value={appreciation.sellingCostRate * 100}
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard eyebrow="Exit assumptions" title="Home Appreciation">
      <NumberSliderInput
        format="percent"
        label="Selling costs"
        max={10}
        min={0}
        onChange={(value) => setAppreciation("sellingCostRate", value / 100, scenarioId)}
        step={0.1}
        value={appreciation.sellingCostRate * 100}
      />
    </SectionCard>
  );
}
