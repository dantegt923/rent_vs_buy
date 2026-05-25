"use client";

import type { ScenarioResults } from "@/lib/engine";
import type { DisplayMode } from "@/lib/store/scenarioStore";
import { formatCurrency } from "./formatters";

interface YearByYearTableProps {
  results: ScenarioResults;
  displayMode: DisplayMode;
  label?: string;
}

export function YearByYearTable({
  results,
  displayMode,
  label,
}: YearByYearTableProps) {
  return (
    <details className="operator-panel rounded-sm">
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-5">
        <p className="operator-kicker">{"// "}Details</p>
        <h2 className="operator-title mt-1 text-2xl sm:text-3xl">
          Year-by-Year Output{label ? ` · ${label}` : ""}
        </h2>
      </summary>
      <div className="max-h-[420px] overflow-auto border-t border-primary/15 sm:max-h-[520px]">
        <table className="w-full min-w-[720px] border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 bg-secondary text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3 text-right">Home value</th>
              <th className="px-4 py-3 text-right">Mortgage</th>
              <th className="px-4 py-3 text-right">Buy outflow</th>
              <th className="px-4 py-3 text-right">Rent outflow</th>
              <th className="px-4 py-3 text-right">Invested savings</th>
              <th className="px-4 py-3 text-right">Buyer net</th>
              <th className="px-4 py-3 text-right">Renter net</th>
              <th className="px-4 py-3 text-right">Delta</th>
            </tr>
          </thead>
          <tbody>
            {results.comparison.map((row) => {
              const buy = results.buyPath[row.year - 1];
              const rent = results.rentPath[row.year - 1];
              const buyerNetResult =
                displayMode === "real" ? row.realBuyerNetResult : row.buyerNetResult;
              const renterNetResult =
                displayMode === "real" ? row.realRenterNetResult : row.renterNetResult;
              const delta = displayMode === "real" ? row.realDelta : row.delta;

              return (
                <tr className="border-t border-primary/10" key={row.year}>
                  <td className="px-4 py-3 font-semibold">{row.year}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(buy.homeValue)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(buy.remainingMortgageBalance)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(buy.annualOutflow)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(rent.annualOutflow)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(rent.investedSavings)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(buyerNetResult)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(renterNetResult)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {formatCurrency(delta)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
