"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deriveTax, type StateCode } from "@/lib/data/derive-tax";
import zipToState from "@/lib/data/zip-to-state.json";
import type {
  DownPaymentInput,
  FilingStatus,
  LumpSumPrepayment,
  MaintenanceInput,
  PurchaseMode,
  ScenarioInputs,
} from "@/lib/engine";
import { SCENARIO_STORAGE_KEY } from "./persistence";

export type DisplayMode = "nominal" | "real";
export type OutcomeMode = "costAdjusted" | "netWorth";
export type ThemeMode = "light" | "dark";
export type ScenarioId = "A" | "B";

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string;
  scenario: ScenarioInputs;
}

type ZipCode = keyof typeof zipToState;

interface ScenarioStoreState {
  scenario: ScenarioInputs;
  scenarios: Record<ScenarioId, ScenarioInputs>;
  activeScenarioId: ScenarioId;
  compareMode: boolean;
  savedScenarios: SavedScenario[];
  displayMode: DisplayMode;
  outcomeMode: OutcomeMode;
  themeMode: ThemeMode;
  showAdvancedAssumptions: boolean;
  setActiveScenarioId: (scenarioId: ScenarioId) => void;
  setCompareMode: (compareMode: boolean) => void;
  setDisplayMode: (displayMode: DisplayMode) => void;
  setOutcomeMode: (outcomeMode: OutcomeMode) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setShowAdvancedAssumptions: (showAdvancedAssumptions: boolean) => void;
  saveNamedScenario: (name: string, scenarioId?: ScenarioId) => void;
  loadSavedScenario: (savedScenarioId: string, targetScenarioId?: ScenarioId) => void;
  duplicateSavedScenario: (savedScenarioId: string) => void;
  deleteSavedScenario: (savedScenarioId: string) => void;
  setZipCode: (zipCode: string, scenarioId?: ScenarioId) => void;
  setHomePrice: (homePrice: number, scenarioId?: ScenarioId) => void;
  setClosingCostRate: (closingCostRate: number, scenarioId?: ScenarioId) => void;
  setCashPurchase: (cashPurchase: boolean, scenarioId?: ScenarioId) => void;
  setDownPayment: (downPayment: DownPaymentInput, scenarioId?: ScenarioId) => void;
  setMortgageField: (
    field: keyof Omit<Extract<PurchaseMode, { kind: "mortgage" }>, "kind" | "downPayment" | "lumpSumPrepayments">,
    value: number,
    scenarioId?: ScenarioId,
  ) => void;
  addLumpSumPrepayment: (scenarioId?: ScenarioId) => void;
  updateLumpSumPrepayment: (
    index: number,
    patch: Partial<LumpSumPrepayment>,
    scenarioId?: ScenarioId,
  ) => void;
  removeLumpSumPrepayment: (index: number, scenarioId?: ScenarioId) => void;
  setOwnershipCost: (
    field: Exclude<keyof ScenarioInputs["ownershipCosts"], "maintenance">,
    value: number,
    scenarioId?: ScenarioId,
  ) => void;
  setMaintenance: (maintenance: MaintenanceInput, scenarioId?: ScenarioId) => void;
  setAppreciation: (
    field: keyof ScenarioInputs["appreciation"],
    value: number,
    scenarioId?: ScenarioId,
  ) => void;
  setRent: (field: keyof ScenarioInputs["rent"], value: number, scenarioId?: ScenarioId) => void;
  setInvestment: (
    field: Exclude<
      keyof ScenarioInputs["investment"],
      "equalizeRenterCashflow" | "investBuyerCashflowSavings"
    >,
    value: number,
    scenarioId?: ScenarioId,
  ) => void;
  setInvestmentAssumption: (
    field: "equalizeRenterCashflow" | "investBuyerCashflowSavings",
    value: boolean,
    scenarioId?: ScenarioId,
  ) => void;
  setFilingStatus: (filingStatus: FilingStatus, scenarioId?: ScenarioId) => void;
  setHouseholdIncome: (householdIncome: number, scenarioId?: ScenarioId) => void;
  setInflationRate: (inflationRate: number, scenarioId?: ScenarioId) => void;
  setSaleYear: (saleYear: number, scenarioId?: ScenarioId) => void;
}

const DEFAULT_ZIP = "10001";
const DEFAULT_INCOME = 175_000;

export const defaultScenario: ScenarioInputs = {
  horizonYears: 30,
  saleYear: 15,
  property: {
    zipCode: DEFAULT_ZIP,
    homePrice: 500_000,
    purchaseMode: {
      kind: "mortgage",
      downPayment: { kind: "percent", value: 0.2 },
      mortgageRate: 0.07,
      loanTermYears: 30,
      pmiRate: 0.005,
      extraMonthlyPayment: 0,
      lumpSumPrepayments: [],
    },
    closingCostRate: 0.03,
  },
  ownershipCosts: {
    propertyTaxRate: 0.012,
    propertyTaxGrowthRate: 0,
    insuranceRate: 0.0035,
    insuranceGrowthRate: 0.03,
    hoaMonthly: 0,
    hoaGrowthRate: 0.03,
    maintenance: { kind: "percentOfHomeValue", rate: 0.01 },
    maintenanceGrowthRate: 0,
  },
  appreciation: {
    annualRate: 0.03,
    sellingCostRate: 0.07,
  },
  rent: {
    monthlyRent: 2_500,
    annualRentGrowthRate: 0.03,
    rentersInsuranceMonthly: 25,
  },
  investment: {
    expectedAnnualReturn: 0.07,
    annualTaxDrag: 0.005,
    taxAdvantagedAccountPercent: 0,
    equalizeRenterCashflow: false,
    investBuyerCashflowSavings: false,
  },
  taxes: deriveTax("single", DEFAULT_INCOME, "NY"),
  macro: {
    inflationRate: 0.03,
  },
};

export const useScenarioStore = create<ScenarioStoreState>()(
  persist(
    (set) => ({
      scenario: defaultScenario,
      scenarios: {
        A: defaultScenario,
        B: createScenarioB(),
      },
      activeScenarioId: "A",
      compareMode: false,
      savedScenarios: [],
      displayMode: "nominal",
      outcomeMode: "netWorth",
      themeMode: "dark",
      showAdvancedAssumptions: false,
      setActiveScenarioId: (activeScenarioId) =>
        set((state) => ({
          activeScenarioId,
          scenario: state.scenarios[activeScenarioId],
        })),
      setCompareMode: (compareMode) => set({ compareMode }),
      setDisplayMode: (displayMode) => set({ displayMode }),
      setOutcomeMode: (outcomeMode) => set({ outcomeMode }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setShowAdvancedAssumptions: (showAdvancedAssumptions) =>
        set({ showAdvancedAssumptions }),
      saveNamedScenario: (name, scenarioId) =>
        set((state) => {
          const targetId = scenarioId ?? state.activeScenarioId;
          const trimmedName = name.trim();

          if (!trimmedName) {
            return state;
          }

          return {
            savedScenarios: [
              ...state.savedScenarios,
              {
                id: crypto.randomUUID(),
                name: trimmedName,
                createdAt: new Date().toISOString(),
                scenario: state.scenarios[targetId],
              },
            ],
          };
        }),
      loadSavedScenario: (savedScenarioId, targetScenarioId) =>
        set((state) => {
          const savedScenario = state.savedScenarios.find(
            (candidate) => candidate.id === savedScenarioId,
          );
          const targetId = targetScenarioId ?? state.activeScenarioId;

          if (!savedScenario) {
            return state;
          }

          return replaceScenario(state, targetId, savedScenario.scenario);
        }),
      duplicateSavedScenario: (savedScenarioId) =>
        set((state) => {
          const savedScenario = state.savedScenarios.find(
            (candidate) => candidate.id === savedScenarioId,
          );

          if (!savedScenario) {
            return state;
          }

          return {
            savedScenarios: [
              ...state.savedScenarios,
              {
                ...savedScenario,
                id: crypto.randomUUID(),
                name: `${savedScenario.name} copy`,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
      deleteSavedScenario: (savedScenarioId) =>
        set((state) => ({
          savedScenarios: state.savedScenarios.filter(
            (savedScenario) => savedScenario.id !== savedScenarioId,
          ),
        })),
      setZipCode: (zipCode, scenarioId) =>
        set((state) => {
          const targetId = scenarioId ?? state.activeScenarioId;
          const scenario = state.scenarios[targetId];
          const stateCode = lookupState(zipCode);
          const taxes = stateCode
            ? deriveTax(
                scenario.taxes.filingStatus,
                scenario.taxes.householdIncome,
                stateCode,
              )
            : scenario.taxes;

          return replaceScenario(state, targetId, {
            ...scenario,
            property: { ...scenario.property, zipCode },
            taxes,
          });
        }),
      setHomePrice: (homePrice, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          property: { ...scenario.property, homePrice },
        }))),
      setClosingCostRate: (closingCostRate, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          property: { ...scenario.property, closingCostRate },
        }))),
      setCashPurchase: (cashPurchase, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          horizonYears: cashPurchase ? 30 : getLoanTermYears(scenario),
          property: {
            ...scenario.property,
            purchaseMode: cashPurchase
              ? { kind: "cash" }
              : ensureMortgageMode(scenario.property.purchaseMode),
          },
          saleYear: clampYear(
            scenario.saleYear,
            cashPurchase ? 30 : getLoanTermYears(scenario),
          ),
        }))),
      setDownPayment: (downPayment, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          property: {
            ...scenario.property,
            purchaseMode: {
              ...ensureMortgageMode(scenario.property.purchaseMode),
              downPayment,
            },
          },
        }))),
      setMortgageField: (field, value, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => {
          const mortgage = ensureMortgageMode(scenario.property.purchaseMode);
          const nextMortgage = { ...mortgage, [field]: value };
          const horizonYears =
            field === "loanTermYears" ? value : scenario.horizonYears;

          return {
            ...scenario,
            horizonYears,
            saleYear: clampYear(scenario.saleYear, horizonYears),
            property: {
              ...scenario.property,
              purchaseMode: nextMortgage,
            },
          };
        })),
      addLumpSumPrepayment: (scenarioId) =>
        set((state) => {
          return updateScenario(state, scenarioId, (scenario) => {
            const mortgage = ensureMortgageMode(scenario.property.purchaseMode);
            return {
              ...scenario,
              property: {
                ...scenario.property,
                purchaseMode: {
                  ...mortgage,
                  lumpSumPrepayments: [
                    ...mortgage.lumpSumPrepayments,
                    { year: 10, amount: 10_000 },
                  ],
                },
              },
            };
          });
        }),
      updateLumpSumPrepayment: (index, patch, scenarioId) =>
        set((state) => {
          return updateScenario(state, scenarioId, (scenario) => {
            const mortgage = ensureMortgageMode(scenario.property.purchaseMode);
            return {
              ...scenario,
              property: {
                ...scenario.property,
                purchaseMode: {
                  ...mortgage,
                  lumpSumPrepayments: mortgage.lumpSumPrepayments.map(
                    (prepayment, currentIndex) =>
                      currentIndex === index
                        ? {
                            ...prepayment,
                            ...patch,
                            year: clampYear(
                              patch.year ?? prepayment.year,
                              scenario.horizonYears,
                            ),
                            amount: Math.max(0, patch.amount ?? prepayment.amount),
                          }
                        : prepayment,
                  ),
                },
              },
            };
          });
        }),
      removeLumpSumPrepayment: (index, scenarioId) =>
        set((state) => {
          return updateScenario(state, scenarioId, (scenario) => {
            const mortgage = ensureMortgageMode(scenario.property.purchaseMode);
            return {
              ...scenario,
              property: {
                ...scenario.property,
                purchaseMode: {
                  ...mortgage,
                  lumpSumPrepayments: mortgage.lumpSumPrepayments.filter(
                    (_prepayment, currentIndex) => currentIndex !== index,
                  ),
                },
              },
            };
          });
        }),
      setOwnershipCost: (field, value, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
            ownershipCosts: {
              ...scenario.ownershipCosts,
              [field]: value,
            },
        }))),
      setMaintenance: (maintenance, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
            ownershipCosts: {
              ...scenario.ownershipCosts,
              maintenance,
            },
        }))),
      setAppreciation: (field, value, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          appreciation: { ...scenario.appreciation, [field]: value },
        }))),
      setRent: (field, value, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          rent: { ...scenario.rent, [field]: value },
        }))),
      setInvestment: (field, value, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          investment: { ...scenario.investment, [field]: value },
        }))),
      setInvestmentAssumption: (field, value, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          investment: { ...scenario.investment, [field]: value },
        }))),
      setFilingStatus: (filingStatus, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
            taxes: deriveTax(
              filingStatus,
              scenario.taxes.householdIncome,
              lookupState(scenario.property.zipCode) ?? "NY",
            ),
        }))),
      setHouseholdIncome: (householdIncome, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
            taxes: deriveTax(
              scenario.taxes.filingStatus,
              householdIncome,
              lookupState(scenario.property.zipCode) ?? "NY",
            ),
        }))),
      setInflationRate: (inflationRate, scenarioId) =>
        set((state) => updateScenario(state, scenarioId, (scenario) => ({
          ...scenario,
          macro: { ...scenario.macro, inflationRate },
        }))),
      setSaleYear: (saleYear, scenarioId) =>
        set((state) => {
          const targetId = scenarioId ?? state.activeScenarioId;
          const scenario = state.scenarios[targetId];
          const clampedSaleYear = clampYear(saleYear, scenario.horizonYears);

          return replaceScenario(state, targetId, {
            ...scenario,
            saleYear: clampedSaleYear,
          });
        }),
    }),
    {
      name: SCENARIO_STORAGE_KEY,
      partialize: (state) => ({
        scenario: state.scenario,
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        compareMode: state.compareMode,
        savedScenarios: state.savedScenarios,
        displayMode: state.displayMode,
        outcomeMode: state.outcomeMode,
        themeMode: state.themeMode,
        showAdvancedAssumptions: state.showAdvancedAssumptions,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ScenarioStoreState>;

        return {
          ...currentState,
          ...persisted,
          scenario: normalizeScenario(persisted.scenario ?? currentState.scenario),
          scenarios: {
            A: normalizeScenario(persisted.scenarios?.A ?? currentState.scenarios.A),
            B: normalizeScenario(persisted.scenarios?.B ?? currentState.scenarios.B),
          },
        };
      },
    },
  ),
);

function createScenarioB(): ScenarioInputs {
  return {
    ...defaultScenario,
    property: {
      ...defaultScenario.property,
      homePrice: 575_000,
    },
    rent: {
      ...defaultScenario.rent,
      monthlyRent: 2_900,
    },
  };
}

function updateScenario(
  state: ScenarioStoreState,
  scenarioId: ScenarioId | undefined,
  updater: (scenario: ScenarioInputs) => ScenarioInputs,
): Partial<ScenarioStoreState> {
  const targetId = scenarioId ?? state.activeScenarioId;
  return replaceScenario(state, targetId, updater(state.scenarios[targetId]));
}

function replaceScenario(
  state: ScenarioStoreState,
  scenarioId: ScenarioId,
  scenario: ScenarioInputs,
): Partial<ScenarioStoreState> {
  const normalizedScenario = normalizeScenario(scenario);
  const scenarios = {
    ...state.scenarios,
    [scenarioId]: normalizedScenario,
  };

  return {
    scenarios,
    scenario: scenarios[state.activeScenarioId],
  };
}

function ensureMortgageMode(
  purchaseMode: PurchaseMode,
): Extract<PurchaseMode, { kind: "mortgage" }> {
  if (purchaseMode.kind === "mortgage") {
    return purchaseMode;
  }

  return {
    kind: "mortgage",
    downPayment: { kind: "percent", value: 0.2 },
    mortgageRate: 0.07,
    loanTermYears: 30,
    pmiRate: 0.005,
    extraMonthlyPayment: 0,
    lumpSumPrepayments: [],
  };
}

function lookupState(zipCode: string): StateCode | null {
  if (zipCode in zipToState) {
    return zipToState[zipCode as ZipCode] as StateCode;
  }

  return null;
}

function getLoanTermYears(scenario: ScenarioInputs): number {
  return scenario.property.purchaseMode.kind === "mortgage"
    ? scenario.property.purchaseMode.loanTermYears
    : 30;
}

function normalizeScenario(scenario: ScenarioInputs): ScenarioInputs {
  const horizonYears = getLoanTermYears(scenario);

  return {
    ...scenario,
    horizonYears,
    saleYear: clampYear(scenario.saleYear, horizonYears),
  };
}

function clampYear(year: number, horizonYears: number): number {
  return Math.min(horizonYears, Math.max(1, Math.round(year)));
}
