"use client";

import { useId } from "react";
import { InfoTooltip } from "./InfoTooltip";

interface AssumptionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip: string;
}

export function AssumptionToggle({
  label,
  checked,
  onChange,
  tooltip,
}: AssumptionToggleProps) {
  const inputId = useId();

  return (
    <div className="rounded-sm border border-primary/15 bg-secondary/40 p-3">
      <div className="flex items-start gap-3">
        <input
          checked={checked}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary"
          id={inputId}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <label
              className="cursor-pointer text-sm font-semibold leading-snug"
              htmlFor={inputId}
            >
              {label}
            </label>
            <InfoTooltip text={tooltip} />
          </div>
        </div>
      </div>
    </div>
  );
}
