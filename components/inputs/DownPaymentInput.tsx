"use client";

import { useState } from "react";
import { NumberSliderInput } from "@/components/inputs/NumberSliderInput";
import type { DownPaymentInput as DownPaymentValue } from "@/lib/engine";

interface DownPaymentInputProps {
  downPayment: DownPaymentValue;
  homePrice: number;
  onChange: (downPayment: DownPaymentValue) => void;
}

export function DownPaymentInput({
  downPayment,
  homePrice,
  onChange,
}: DownPaymentInputProps) {
  const [useDollars, setUseDollars] = useState(downPayment.kind === "amount");

  const activeDownPayment =
    downPayment.kind === "percent"
      ? downPayment
      : { kind: "percent" as const, value: downPayment.value / homePrice };

  const dollarDownPayment =
    downPayment.kind === "amount"
      ? downPayment
      : { kind: "amount" as const, value: downPayment.value * homePrice };

  return (
    <div className="space-y-2">
      {useDollars ? (
        <>
          <NumberSliderInput
            format="currency"
            label="Down payment"
            max={homePrice}
            min={0}
            onChange={(value) => onChange({ kind: "amount", value })}
            step={1_000}
            value={dollarDownPayment.value}
          />
          <button
            className="text-[11px] font-semibold text-primary hover:underline"
            type="button"
            onClick={() => {
              setUseDollars(false);
              onChange(activeDownPayment);
            }}
          >
            Enter as percent instead
          </button>
        </>
      ) : (
        <>
          <NumberSliderInput
            format="percent"
            label="Down payment"
            max={100}
            min={0}
            onChange={(value) => onChange({ kind: "percent", value: value / 100 })}
            step={1}
            value={activeDownPayment.value * 100}
          />
          <button
            className="text-[11px] font-semibold text-primary hover:underline"
            type="button"
            onClick={() => {
              setUseDollars(true);
              onChange(dollarDownPayment);
            }}
          >
            Enter dollar amount instead
          </button>
        </>
      )}
    </div>
  );
}
