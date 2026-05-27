"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AssumptionsPanelsContextValue {
  bulkOpen: boolean;
  bulkVersion: number;
  toggleAllPanels: () => void;
}

const AssumptionsPanelsContext = createContext<AssumptionsPanelsContextValue | null>(
  null,
);

export function AssumptionsPanelsProvider({ children }: { children: ReactNode }) {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkVersion, setBulkVersion] = useState(0);

  const value = useMemo(
    () => ({
      bulkOpen,
      bulkVersion,
      toggleAllPanels: () => {
        setBulkOpen((current) => !current);
        setBulkVersion((version) => version + 1);
      },
    }),
    [bulkOpen, bulkVersion],
  );

  return (
    <AssumptionsPanelsContext.Provider value={value}>
      {children}
    </AssumptionsPanelsContext.Provider>
  );
}

export function useAssumptionsPanelState(): {
  open: boolean;
  setOpen: (open: boolean) => void;
} {
  const context = useContext(AssumptionsPanelsContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!context) {
      return;
    }

    setOpen(context.bulkOpen);
  }, [context?.bulkOpen, context?.bulkVersion]);

  if (!context) {
    return { open, setOpen };
  }

  return { open, setOpen };
}

export function AssumptionsCollapseToggle() {
  const context = useContext(AssumptionsPanelsContext);

  if (!context) {
    return null;
  }

  return (
    <button
      aria-expanded={context.bulkOpen}
      aria-label={context.bulkOpen ? "Collapse all sections" : "Expand all sections"}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-primary/15 text-primary transition hover:border-primary/35 hover:bg-primary/10"
      onClick={context.toggleAllPanels}
      type="button"
    >
      <span
        className={`text-sm font-bold transition ${
          context.bulkOpen ? "rotate-180" : "rotate-0"
        }`}
      >
        +
      </span>
    </button>
  );
}
