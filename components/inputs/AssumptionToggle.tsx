"use client";

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
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-primary/15 bg-secondary/40 p-3">
      <input
        checked={checked}
        className="mt-1 h-4 w-4 shrink-0 accent-primary"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-semibold leading-snug">
          {label}
          <span className="group relative inline-flex">
            <span
              aria-label="More information"
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-primary/30 text-[10px] font-bold text-primary"
            >
              ?
            </span>
            <span
              className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-30 hidden w-72 -translate-x-1/2 rounded-sm border border-primary/25 bg-card p-3 text-xs font-normal normal-case tracking-normal text-muted-foreground shadow-[0_0_28px_hsl(var(--primary)/0.16)] group-hover:block"
              role="tooltip"
            >
              {tooltip}
            </span>
          </span>
        </span>
      </span>
    </label>
  );
}
