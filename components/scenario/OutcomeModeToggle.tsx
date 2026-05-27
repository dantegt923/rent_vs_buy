"use client";

import { APP_LABELS } from "@/lib/ui/labels";
import { useScenarioStore, type OutcomeMode } from "@/lib/store/scenarioStore";

export function OutcomeModeToggle() {
  const outcomeMode = useScenarioStore((state) => state.outcomeMode);
  const setOutcomeMode = useScenarioStore((state) => state.setOutcomeMode);

  return (
    <div className="flex shrink-0 items-center rounded-sm border border-primary/25 bg-card/80 p-1 text-[10px] font-bold uppercase tracking-[0.12em] shadow-[0_0_24px_hsl(var(--primary)/0.08)] sm:text-xs sm:tracking-[0.16em]">
      <ToggleButton
        active={outcomeMode === "netWorth"}
        label={APP_LABELS.netWorth}
        value="netWorth"
        onClick={setOutcomeMode}
      />
      <ToggleButton
        active={outcomeMode === "costAdjusted"}
        label={APP_LABELS.netResult}
        value="costAdjusted"
        onClick={setOutcomeMode}
      />
    </div>
  );
}

function ToggleButton({
  active,
  label,
  value,
  onClick,
}: {
  active: boolean;
  label: string;
  value: OutcomeMode;
  onClick: (value: OutcomeMode) => void;
}) {
  return (
    <button
      className={`rounded-sm px-2 py-1.5 transition sm:px-3 ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
      }`}
      type="button"
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
}
