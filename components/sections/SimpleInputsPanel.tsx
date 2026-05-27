"use client";

import type { ReactNode } from "react";
import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import { DownPaymentInput } from "@/components/inputs/DownPaymentInput";
import { cn } from "@/lib/utils";
import { APP_LABELS } from "@/lib/ui/labels";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";

export function SimpleInputsPanel({ scenarioId }: { scenarioId: ScenarioId }) {
  const scenario = useScenarioStore((state) => state.scenarios[scenarioId]);
  const setZipCode = useScenarioStore((state) => state.setZipCode);
  const setHomePrice = useScenarioStore((state) => state.setHomePrice);
  const setDownPayment = useScenarioStore((state) => state.setDownPayment);
  const setMortgageField = useScenarioStore((state) => state.setMortgageField);
  const setRent = useScenarioStore((state) => state.setRent);
  const setSaleYear = useScenarioStore((state) => state.setSaleYear);

  const purchaseMode = scenario.property.purchaseMode;
  const isMortgage = purchaseMode.kind === "mortgage";
  const downPayment = isMortgage
    ? purchaseMode.downPayment
    : { kind: "percent" as const, value: 100 };

  return (
    <section className="de-panel rounded-sm p-4 sm:p-5">
      <h2 className="de-headline text-xl uppercase sm:text-2xl">Your inputs</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InputCard>
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em]">ZIP code</span>
            <input
              className="w-full rounded-sm border border-primary/15 bg-background/45 px-3 py-2 text-sm font-semibold tabular-nums outline-none ring-primary/20 focus:ring-2"
              value={scenario.property.zipCode}
              onChange={(event) => setZipCode(event.target.value, scenarioId)}
            />
          </label>
        </InputCard>
        <InputCard>
          <NumberSliderInput
            format="currency"
            label="Home price"
            max={2_500_000}
            min={50_000}
            onChange={(value) => setHomePrice(value, scenarioId)}
            step={5_000}
            value={scenario.property.homePrice}
          />
        </InputCard>
        <InputCard>
          <NumberSliderInput
            format="currency"
            label="Current monthly rent"
            max={10_000}
            min={0}
            onChange={(value) => setRent("monthlyRent", value, scenarioId)}
            step={50}
            value={scenario.rent.monthlyRent}
          />
        </InputCard>
        {isMortgage ? (
          <>
            <InputCard className="sm:col-span-2 lg:col-span-1">
              <DownPaymentInput
                downPayment={downPayment}
                homePrice={scenario.property.homePrice}
                onChange={(value) => setDownPayment(value, scenarioId)}
              />
            </InputCard>
            <InputCard>
              <NumberSliderInput
                format="percent"
                label="Mortgage rate"
                max={15}
                min={0}
                onChange={(value) =>
                  setMortgageField("mortgageRate", value / 100, scenarioId)
                }
                step={0.05}
                value={purchaseMode.mortgageRate * 100}
              />
            </InputCard>
          </>
        ) : null}
        <InputCard>
          <NumberSliderInput
            label={APP_LABELS.yearsStaying}
            max={scenario.horizonYears}
            min={1}
            onChange={(value) => setSaleYear(value, scenarioId)}
            step={1}
            suffix="years"
            value={scenario.saleYear}
          />
        </InputCard>
      </div>
    </section>
  );
}

function InputCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border border-primary/15 bg-secondary/35 p-3 shadow-[inset_0_1px_0_hsl(var(--primary)/0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
