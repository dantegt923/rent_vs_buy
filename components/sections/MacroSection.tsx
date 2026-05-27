"use client";

import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";
import { SectionCard } from "./SectionCard";

export function MacroSection({ scenarioId }: { scenarioId: ScenarioId }) {
  const scenario = useScenarioStore((state) => state.scenarios[scenarioId]);
  const setInflationRate = useScenarioStore((state) => state.setInflationRate);
  return (
    <SectionCard eyebrow="Macro" title="Inflation">
      <NumberSliderInput
        format="percent"
        label="Inflation rate"
        max={10}
        min={0}
        onChange={(value) => setInflationRate(value / 100, scenarioId)}
        step={0.1}
        value={scenario.macro.inflationRate * 100}
      />
    </SectionCard>
  );
}
