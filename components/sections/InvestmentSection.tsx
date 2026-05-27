"use client";

import { AssumptionToggle } from "@/components/inputs/AssumptionToggle";
import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";
import { SectionCard } from "./SectionCard";

export function InvestmentSection({ scenarioId }: { scenarioId: ScenarioId }) {
  const investment = useScenarioStore(
    (state) => state.scenarios[scenarioId].investment,
  );
  const setInvestment = useScenarioStore((state) => state.setInvestment);
  const setInvestmentAssumption = useScenarioStore(
    (state) => state.setInvestmentAssumption,
  );

  return (
    <SectionCard eyebrow="Alternative return" title="What your money could earn instead">
      <NumberSliderInput
        format="percent"
        label="Expected nominal return"
        max={12}
        min={0}
        onChange={(value) => setInvestment("expectedAnnualReturn", value / 100, scenarioId)}
        step={0.1}
        value={investment.expectedAnnualReturn * 100}
      />
      <NumberSliderInput
        format="percent"
        label="Investment tax drag"
        max={3}
        min={0}
        onChange={(value) => setInvestment("annualTaxDrag", value / 100, scenarioId)}
        step={0.05}
        value={investment.annualTaxDrag * 100}
      />
      <NumberSliderInput
        format="percent"
        label="Tax-advantaged account share"
        max={100}
        min={0}
        onChange={(value) =>
          setInvestment("taxAdvantagedAccountPercent", value / 100, scenarioId)
        }
        step={1}
        value={investment.taxAdvantagedAccountPercent * 100}
      />
      <div className="space-y-3 border-t border-primary/10 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground">
          Optional cashflow assumptions
        </p>
        <AssumptionToggle
          checked={investment.equalizeRenterCashflow ?? false}
          label="Equalize renter housing spend"
          onChange={(value) =>
            setInvestmentAssumption("equalizeRenterCashflow", value, scenarioId)
          }
          tooltip="When renting costs more than owning in a given year, withdraw from the renter's portfolio to cover the gap. When owning costs more, invest the difference. This keeps annual housing cash outflows equal and tends to favor renting."
        />
        <AssumptionToggle
          checked={investment.investBuyerCashflowSavings ?? false}
          label="Invest buyer cashflow savings"
          onChange={(value) =>
            setInvestmentAssumption("investBuyerCashflowSavings", value, scenarioId)
          }
          tooltip="When owning costs less than renting, invest only that year's cashflow difference in a separate portfolio. Down payment, mortgage principal, and home equity stay in the home—not in this side account."
        />
      </div>
    </SectionCard>
  );
}
