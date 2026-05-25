"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScenarioResults } from "@/lib/engine";
import {
  getBreakEvenYear,
  getComparisonValues,
  OUTCOME_COPY,
} from "@/lib/results/outcomeDisplay";
import { useScenarioStore, type DisplayMode } from "@/lib/store/scenarioStore";
import { formatCompactCurrency, formatCurrency } from "./formatters";

interface NetWorthChartProps {
  results: ScenarioResults;
  compareResults?: ScenarioResults;
  displayMode: DisplayMode;
}

interface ChartRow {
  year: number;
  buyer: number;
  renter: number;
  delta: number;
  buyerB?: number;
  renterB?: number;
  deltaB?: number;
}

export function NetWorthChart({
  results,
  compareResults,
  displayMode,
}: NetWorthChartProps) {
  const outcomeMode = useScenarioStore((state) => state.outcomeMode);
  const copy = OUTCOME_COPY[outcomeMode];
  const breakEvenYear = getBreakEvenYear(results, outcomeMode);

  const data: ChartRow[] = useMemo(
    () =>
      results.comparison
        .map((row) => {
          const values = getComparisonValues(row, displayMode, outcomeMode);

          return {
            year: row.year,
            buyer: values.buyer,
            renter: values.renter,
            delta: values.delta,
          };
        })
        .map((row) => {
          const comparisonB = compareResults?.comparison[row.year - 1];

          if (!comparisonB) {
            return row;
          }

          const valuesB = getComparisonValues(comparisonB, displayMode, outcomeMode);

          return {
            ...row,
            buyerB: valuesB.buyer,
            renterB: valuesB.renter,
            deltaB: valuesB.delta,
          };
        }),
    [compareResults, displayMode, outcomeMode, results.comparison],
  );

  const buyerLineName = compareResults ? `A ${copy.buyerLine.toLowerCase()}` : copy.buyerLine;
  const renterLineName = compareResults ? `A ${copy.renterLine.toLowerCase()}` : copy.renterLine;

  return (
    <section className="operator-panel rounded-sm p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="operator-kicker">Unified_Spectrum</p>
          <h2 className="operator-title mt-1 text-xl sm:text-2xl lg:text-3xl">
            {copy.chartTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {copy.chartDescription}
          </p>
        </div>
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.22em]">
          {displayMode === "real" ? "Inflation-adjusted" : "Nominal"} dollars
        </p>
      </div>
      <div className="h-[240px] min-h-[240px] w-full min-w-0 sm:h-[300px] lg:h-[360px]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ bottom: 8, left: 12, right: 20, top: 8 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="year" tickLine={false} />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              width={72}
            />
            <Tooltip content={<ChartTooltip compareMode={Boolean(compareResults)} />} />
            <Legend />
            {breakEvenYear ? (
              <ReferenceLine
                label="Break-even"
                stroke="hsl(var(--accent))"
                x={breakEvenYear}
              />
            ) : null}
            <Line
              animationDuration={0}
              dataKey="buyer"
              dot={false}
              isAnimationActive={false}
              name={buyerLineName}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              animationDuration={0}
              dataKey="renter"
              dot={false}
              isAnimationActive={false}
              name={renterLineName}
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              type="monotone"
            />
            {compareResults ? (
              <>
                <Line
                  animationDuration={0}
                  dataKey="buyerB"
                  dot={false}
                  isAnimationActive={false}
                  name={`B ${copy.buyerLine.toLowerCase()}`}
                  stroke="hsl(var(--primary) / 0.55)"
                  strokeDasharray="8 6"
                  strokeWidth={3}
                  type="monotone"
                />
                <Line
                  animationDuration={0}
                  dataKey="renterB"
                  dot={false}
                  isAnimationActive={false}
                  name={`B ${copy.renterLine.toLowerCase()}`}
                  stroke="hsl(var(--accent) / 0.55)"
                  strokeDasharray="8 6"
                  strokeWidth={3}
                  type="monotone"
                />
              </>
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  compareMode,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: number;
  compareMode: boolean;
}) {
  if (!active || !payload) {
    return null;
  }

  const buyer = payload.find((item) => item.dataKey === "buyer")?.value ?? 0;
  const renter = payload.find((item) => item.dataKey === "renter")?.value ?? 0;
  const buyerB = payload.find((item) => item.dataKey === "buyerB")?.value;
  const renterB = payload.find((item) => item.dataKey === "renterB")?.value;
  const delta = buyer - renter;

  return (
    <div className="rounded-sm border border-primary/30 bg-card/95 p-3 text-sm shadow-[0_0_28px_hsl(var(--primary)/0.16)]">
      <p className="font-semibold">Year {label}</p>
      <p>{compareMode ? "A buyer" : "Buyer"}: {formatCurrency(buyer)}</p>
      <p>{compareMode ? "A renter" : "Renter"}: {formatCurrency(renter)}</p>
      <p className="font-semibold">A delta: {formatCurrency(delta)}</p>
      {buyerB !== undefined && renterB !== undefined ? (
        <>
          <p>B buyer: {formatCurrency(buyerB)}</p>
          <p>B renter: {formatCurrency(renterB)}</p>
          <p className="font-semibold">B delta: {formatCurrency(buyerB - renterB)}</p>
        </>
      ) : null}
    </div>
  );
}
