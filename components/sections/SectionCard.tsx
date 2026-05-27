"use client";

import type { ReactNode } from "react";
import { useAssumptionsPanelState } from "./AssumptionsPanelsContext";

interface SectionCardProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}

export function SectionCard({ title, eyebrow, children }: SectionCardProps) {
  const { open, setOpen } = useAssumptionsPanelState();

  return (
    <details
      className="de-panel group rounded-sm"
      onToggle={(event) => setOpen(event.currentTarget.open)}
      open={open}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-primary/15 px-4 py-3">
        <div>
          {eyebrow ? (
            <p className="de-kicker">{"// "}{eyebrow}</p>
          ) : null}
          <h2 className="de-headline text-xl sm:text-2xl">{title}</h2>
        </div>
        <span className="text-sm font-bold text-primary transition group-open:rotate-180">
          +
        </span>
      </summary>
      <div className="space-y-5 px-4 py-4">{children}</div>
    </details>
  );
}
