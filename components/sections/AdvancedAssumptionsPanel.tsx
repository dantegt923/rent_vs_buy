"use client";

import { APP_LABELS } from "@/lib/ui/labels";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";
import {
  AssumptionsCollapseToggle,
  AssumptionsPanelsProvider,
} from "./AssumptionsPanelsContext";
import { AppreciationSection } from "./AppreciationSection";
import { InvestmentSection } from "./InvestmentSection";
import { LoanSection } from "./LoanSection";
import { MacroSection } from "./MacroSection";
import { OwnershipCostsSection } from "./OwnershipCostsSection";
import { PropertySection } from "./PropertySection";
import { RentSection } from "./RentSection";
import { TaxSection } from "./TaxSection";

export function AdvancedAssumptionsPanel({ scenarioId }: { scenarioId: ScenarioId }) {
  const showAdvancedAssumptions = useScenarioStore(
    (state) => state.showAdvancedAssumptions,
  );
  const setShowAdvancedAssumptions = useScenarioStore(
    (state) => state.setShowAdvancedAssumptions,
  );

  return (
    <AssumptionsPanelsProvider>
      <details
        className="de-panel rounded-sm"
        onToggle={(event) =>
          setShowAdvancedAssumptions((event.currentTarget as HTMLDetailsElement).open)
        }
        open={showAdvancedAssumptions}
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="de-kicker">Optional</p>
            <h2 className="de-headline mt-1 text-xl uppercase sm:text-2xl">
              {APP_LABELS.assumptionsTitle}
            </h2>
          </div>
          <AssumptionsCollapseToggle />
        </summary>
        <div className="space-y-4 border-t border-primary/15 p-4 sm:p-5">
          <PropertySection mode="advanced" scenarioId={scenarioId} />
          <LoanSection mode="advanced" scenarioId={scenarioId} />
          <OwnershipCostsSection scenarioId={scenarioId} />
          <AppreciationSection mode="advanced" scenarioId={scenarioId} />
          <RentSection mode="advanced" scenarioId={scenarioId} />
          <InvestmentSection scenarioId={scenarioId} />
          <TaxSection scenarioId={scenarioId} />
          <MacroSection scenarioId={scenarioId} />
        </div>
      </details>
    </AssumptionsPanelsProvider>
  );
}
