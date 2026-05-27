"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Label,
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
  getComparisonValues,
  getComparisonYear,
  OUTCOME_COPY,
} from "@/lib/results/outcomeDisplay";
import { APP_LABELS } from "@/lib/ui/labels";
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

const BREAK_EVEN_COLOR = "hsl(var(--accent))";
const YEARS_STAYING_COLOR = "hsl(210 18% 62%)";

export function NetWorthChart({
  results,
  compareResults,
  displayMode,
}: NetWorthChartProps) {
  const outcomeMode = useScenarioStore((state) => state.outcomeMode);
  const copy = OUTCOME_COPY[outcomeMode];
  const comparison = getComparisonYear(results, outcomeMode, displayMode);
  const breakEvenYear = comparison.breakEven.year;
  const yearsStaying = results.inputs.saleYear;
  const horizonYears = results.inputs.horizonYears;
  const markersOverlap = breakEvenYear === yearsStaying;

  const data: ChartRow[] = useMemo(
    () =>
      results.comparison
        .slice(0, horizonYears)
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
    [compareResults, displayMode, horizonYears, outcomeMode, results.comparison],
  );

  const buyerLineName = compareResults ? `${APP_LABELS.scenarioA} · ${copy.buyerLine}` : copy.buyerLine;
  const renterLineName = compareResults ? `${APP_LABELS.scenarioA} · ${copy.renterLine}` : copy.renterLine;

  return (
    <section className="de-panel rounded-sm p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="de-headline text-xl sm:text-2xl lg:text-3xl">
            {copy.chartTitle}
          </h2>
        </div>
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.22em]">
          {displayMode === "real" ? "Inflation-adjusted" : "Nominal"} dollars
        </p>
      </div>
      <div className="h-[240px] min-h-[240px] w-full min-w-0 sm:h-[300px] lg:h-[360px]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart
            data={data}
            margin={{ bottom: 8, left: 12, right: 28, top: 28 }}
          >
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              domain={[1, horizonYears]}
              tickLine={false}
              type="number"
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              width={72}
            />
            <Tooltip content={<ChartTooltip compareMode={Boolean(compareResults)} />} />
            <ReferenceLine
              stroke={BREAK_EVEN_COLOR}
              strokeDasharray="6 4"
              strokeWidth={2}
              x={breakEvenYear}
            >
              <Label
                content={
                  <ChartMarkerLabel
                    fill={BREAK_EVEN_COLOR}
                    horizonYears={horizonYears}
                    offsetY={markersOverlap ? 0 : 0}
                    text={`Year ${breakEvenYear}`}
                    year={breakEvenYear}
                  />
                }
                position="top"
              />
            </ReferenceLine>
            <ReferenceLine
              stroke={YEARS_STAYING_COLOR}
              strokeDasharray="3 6"
              strokeWidth={2}
              x={yearsStaying}
            >
              <Label
                content={
                  <ChartMarkerLabel
                    fill={YEARS_STAYING_COLOR}
                    horizonYears={horizonYears}
                    offsetY={markersOverlap ? 16 : 0}
                    text={`Year ${yearsStaying}`}
                    year={yearsStaying}
                  />
                }
                position="top"
              />
            </ReferenceLine>
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
                  name={`${APP_LABELS.scenarioB} · ${copy.buyerLine}`}
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
                  name={`${APP_LABELS.scenarioB} · ${copy.renterLine}`}
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

function ChartMarkerLabel({
  viewBox,
  text,
  fill,
  year,
  horizonYears,
  offsetY = 0,
}: {
  viewBox?: { x?: number; y?: number };
  text: string;
  fill: string;
  year: number;
  horizonYears: number;
  offsetY?: number;
}) {
  const x = viewBox?.x ?? 0;
  const y = (viewBox?.y ?? 0) - 10 - offsetY;
  const nearLeftAxis = year <= Math.max(3, Math.round(horizonYears * 0.2));
  const textAnchor = nearLeftAxis ? "start" : "middle";
  const dx = nearLeftAxis ? 6 : 0;

  return (
    <text
      dx={dx}
      dy={0}
      fill={fill}
      fontSize={11}
      fontWeight={700}
      textAnchor={textAnchor}
      x={x}
      y={y}
    >
      {text}
    </text>
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
      <p>{compareMode ? "A buyer" : APP_LABELS.netWorthIfBuy}: {formatCurrency(buyer)}</p>
      <p>{compareMode ? "A renter" : APP_LABELS.netWorthIfRent}: {formatCurrency(renter)}</p>
      <p className="font-semibold">Delta: {formatCurrency(delta)}</p>
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
