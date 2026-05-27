"use client";

import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import { APP_LABELS } from "@/lib/ui/labels";
import { type ScenarioId, useScenarioStore } from "@/lib/store/scenarioStore";

export function SimpleInputsPanel({ scenarioId }: { scenarioId: ScenarioId }) {
  const scenario = useScenarioStore((state) => state.scenarios[scenarioId]);
  const setZipCode = useScenarioStore((state) => state.setZipCode);
  const setHomePrice = useScenarioStore((state) => state.setHomePrice);
  const setDownPayment = useScenarioStore((state) => state.setDownPayment);
  const setMortgageField = useScenarioStore((state) => state.setMortgageField);
  const setRent = useScenarioStore((state) => state.setRent);
  const setAppreciation = useScenarioStore((state) => state.setAppreciation);
  const setSaleYear = useScenarioStore((state) => state.setSaleYear);

  const purchaseMode = scenario.property.purchaseMode;
  const isMortgage = purchaseMode.kind === "mortgage";
  const downPayment = isMortgage
    ? purchaseMode.downPayment
    : { kind: "percent" as const, value: 100 };

  return (
    <section className="de-panel rounded-sm p-4 sm:p-5">
      <h2 className="de-headline text-xl uppercase sm:text-2xl">Your inputs</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block space-y-2 sm:col-span-2 lg:col-span-1">
          <span className="text-sm font-semibold">ZIP code</span>
          <input
            className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none ring-primary/20 focus:ring-4"
            value={scenario.property.zipCode}
            onChange={(event) => setZipCode(event.target.value, scenarioId)}
          />
        </label>
        <NumberSliderInput
          format="currency"
          label="Home price"
          max={2_500_000}
          min={50_000}
          onChange={(value) => setHomePrice(value, scenarioId)}
          step={5_000}
          value={scenario.property.homePrice}
        />
        <NumberSliderInput
          format="currency"
          label="Current monthly rent"
          max={10_000}
          min={0}
          onChange={(value) => setRent("monthlyRent", value, scenarioId)}
          step={50}
          value={scenario.rent.monthlyRent}
        />
        {isMortgage ? (
          <>
            <div className="space-y-3">
              <div className="flex rounded-lg border bg-secondary p-1 text-sm">
                <button
                  className={`flex-1 rounded-md px-3 py-1.5 ${
                    downPayment.kind === "percent" ? "bg-card shadow-sm" : ""
                  }`}
                  type="button"
                  onClick={() =>
                    setDownPayment(
                      {
                        kind: "percent",
                        value:
                          downPayment.kind === "percent"
                            ? downPayment.value
                            : downPayment.value / scenario.property.homePrice,
                      },
                      scenarioId,
                    )
                  }
                >
                  Percent
                </button>
                <button
                  className={`flex-1 rounded-md px-3 py-1.5 ${
                    downPayment.kind === "amount" ? "bg-card shadow-sm" : ""
                  }`}
                  type="button"
                  onClick={() =>
                    setDownPayment(
                      {
                        kind: "amount",
                        value:
                          downPayment.kind === "amount"
                            ? downPayment.value
                            : downPayment.value * scenario.property.homePrice,
                      },
                      scenarioId,
                    )
                  }
                >
                  Dollars
                </button>
              </div>
              <NumberSliderInput
                format={downPayment.kind === "percent" ? "percent" : "currency"}
                label="Down payment"
                max={downPayment.kind === "percent" ? 100 : scenario.property.homePrice}
                min={0}
                onChange={(value) =>
                  setDownPayment(
                    downPayment.kind === "percent"
                      ? { kind: "percent", value: value / 100 }
                      : { kind: "amount", value },
                    scenarioId,
                  )
                }
                step={downPayment.kind === "percent" ? 1 : 1_000}
                value={
                  downPayment.kind === "percent"
                    ? downPayment.value * 100
                    : downPayment.value
                }
              />
            </div>
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
          </>
        ) : null}
        <NumberSliderInput
          label={APP_LABELS.yearsStaying}
          max={scenario.horizonYears}
          min={1}
          onChange={(value) => setSaleYear(value, scenarioId)}
          step={1}
          suffix="years"
          value={scenario.saleYear}
        />
        <NumberSliderInput
          format="percent"
          label="Annual home appreciation"
          max={10}
          min={-2}
          onChange={(value) => setAppreciation("annualRate", value / 100, scenarioId)}
          step={0.1}
          value={scenario.appreciation.annualRate * 100}
        />
        <NumberSliderInput
          format="percent"
          label="Annual rent growth"
          max={10}
          min={0}
          onChange={(value) => setRent("annualRentGrowthRate", value / 100, scenarioId)}
          step={0.1}
          value={scenario.rent.annualRentGrowthRate * 100}
        />
      </div>
    </section>
  );
}
