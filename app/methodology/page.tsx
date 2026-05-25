import Link from "next/link";

export default function MethodologyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_at_70%_0%,hsl(var(--primary)/0.24),transparent_38%),radial-gradient(ellipse_at_8%_18%,hsl(var(--accent)/0.12),transparent_28%)]" />
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-primary/20 pb-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="operator-kicker">Documentation</p>
            <h1 className="operator-title text-3xl leading-none sm:text-4xl">
              Methodology
            </h1>
          </div>
          <Link
            className="w-fit rounded-sm border border-primary/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/10 sm:text-xs sm:tracking-[0.18em]"
            href="/"
          >
            Back to calculator
          </Link>
        </header>

        <article className="operator-panel space-y-6 rounded-sm p-4 text-sm leading-relaxed text-muted-foreground sm:space-y-8 sm:p-6">
          <section className="space-y-3">
            <h2 className="operator-title text-2xl text-foreground">
              What this calculator measures
            </h2>
            <p>
              The headline, metrics, and chart can show two different views. Use
              the <strong className="text-foreground">Cost-adjusted / Net worth</strong>{" "}
              toggle in the top-right of the headline panel to switch between them.
              Both use the same inputs and assumptions—the difference is what each
              path subtracts (or does not subtract) from liquidation value.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4">
                <h3 className="font-semibold text-foreground">
                  Cost-adjusted (default)
                </h3>
                <p className="mt-2">
                  An{" "}
                  <strong className="text-foreground">
                    unrecoverable cost-adjusted net position
                  </strong>
                  . If you liquidated at that year, how much would you keep after
                  subtracting housing costs you cannot recover through the home or
                  portfolio?
                </p>
              </div>
              <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4">
                <h3 className="font-semibold text-foreground">Net worth</h3>
                <p className="mt-2">
                  End-state wealth if you liquidated at that year—sale proceeds or
                  portfolio value after tax,{" "}
                  <em>without</em> subtracting cumulative rent or operating
                  ownership costs paid along the way.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="operator-title text-2xl text-foreground">
              Cost-adjusted net position
            </h2>
            <p>
              This is the default view. It answers: after selling the home or
              liquidating the renter&apos;s portfolio at year N, how much is left
              once unrecoverable housing spend is accounted for?
            </p>

            <h3 className="pt-2 font-semibold text-foreground">Buyer path</h3>
            <p>
              Each year we track what you spend on ownership: mortgage payments
              (principal and interest), PMI, property tax, insurance, HOA,
              maintenance, minus any mortgage-interest tax benefit.
            </p>
            <p>
              <strong className="text-foreground">Costs in the net position:</strong>{" "}
              only operating costs—interest, PMI, tax, insurance, HOA,
              maintenance (net of tax benefit).{" "}
              <strong className="text-foreground">Excluded:</strong> down payment,
              closing costs, and mortgage principal. Those dollars are not
              &quot;lost&quot;; they become home equity and come back when you sell.
            </p>
            <p>
              <strong className="text-foreground">Recovery at year N:</strong>{" "}
              estimated net sale proceeds—home value minus remaining mortgage,
              selling costs, and capital gains tax on the sale.
            </p>
            <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4 font-mono text-xs text-foreground">
              Buyer position = sale proceeds (+ optional side portfolio) −
              cumulative operating costs
            </div>

            <h3 className="pt-2 font-semibold text-foreground">Renter path</h3>
            <p>
              The renter starts with a portfolio equal to the buyer&apos;s initial
              cash outlay (down payment + closing costs)—the money the buyer
              puts into the home instead.
            </p>
            <p>
              Each year the renter pays rent and renters insurance. The portfolio
              grows at your expected return (minus tax drag on the taxable
              portion).
            </p>
            <p>
              <strong className="text-foreground">Default behavior:</strong> when
              owning costs more than renting in a year, the renter invests that
              difference. When renting costs more, the renter does{" "}
              <em>not</em> automatically withdraw from the portfolio—the extra
              rent is counted as an unrecoverable cost only.
            </p>
            <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4 font-mono text-xs text-foreground">
              Renter position = portfolio liquidation (after tax) − cumulative
              rent and insurance paid
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="operator-title text-2xl text-foreground">Net worth</h2>
            <p>
              Select <strong className="text-foreground">Net worth</strong> on the
              headline toggle to switch to this view. It shows liquidation value at
              each year only—no subtraction of cumulative housing costs. Break-even
              and the chart use separate net-worth deltas, so crossover years can
              differ from the cost-adjusted view.
            </p>

            <h3 className="pt-2 font-semibold text-foreground">Buyer net worth</h3>
            <p>
              Estimated cash from selling the home at year N, plus any buyer side
              portfolio from the optional cashflow-savings assumption. Side portfolio
              is included only when that toggle is on; it never double-counts down
              payment or principal already in home equity.
            </p>
            <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4 font-mono text-xs text-foreground">
              Buyer net worth = sale proceeds + side portfolio liquidation (after
              tax)
            </div>
            <p className="text-xs">
              Sale proceeds = home value − remaining mortgage − selling costs −
              capital gains tax on the sale.
            </p>

            <h3 className="pt-2 font-semibold text-foreground">Renter net worth</h3>
            <p>
              The renter&apos;s investment portfolio liquidation value at year N
              (after estimated capital gains tax on the taxable portion). Cumulative
              rent and insurance paid are not subtracted—those costs are already
              reflected in a smaller portfolio if the renter had less to invest.
            </p>
            <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4 font-mono text-xs text-foreground">
              Renter net worth = portfolio liquidation (after tax)
            </div>

            <p>
              <strong className="text-foreground">When to use which view:</strong>{" "}
              Cost-adjusted net position is better for comparing total economic
              outcome after housing spend. Net worth is better for comparing
              end-state assets if you sold everything at that year, ignoring the
              path of costs that got you there.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="operator-title text-2xl text-foreground">
              Optional assumptions (Investment section)
            </h2>
            <div className="space-y-4">
              <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4">
                <h3 className="font-semibold text-foreground">
                  Equalize renter housing spend
                </h3>
                <p className="mt-2">
                  Forces both paths to spend the same on housing each year. When
                  rent exceeds ownership costs, the renter withdraws from the
                  portfolio to cover the gap. When ownership costs more, the
                  renter still invests the difference. This assumption tends to
                  favor renting because it prevents rent spikes from counting fully
                  as unrecoverable cost.
                </p>
              </div>
              <div className="rounded-sm border border-primary/15 bg-secondary/40 p-4">
                <h3 className="font-semibold text-foreground">
                  Invest buyer cashflow savings
                </h3>
                <p className="mt-2">
                  When owning costs less than renting, the buyer invests only
                  that year&apos;s cashflow difference in a separate portfolio.
                  The side account starts at zero—it does not include the down
                  payment, closing costs, or mortgage principal, which are
                  already reflected in home equity at sale. This assumption tends
                  to favor buying when ownership is cheaper month-to-month.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="operator-title text-2xl text-foreground">
              Comparing the two paths
            </h2>
            <p>
              In <strong className="text-foreground">cost-adjusted</strong> mode,
              the delta at any year is buyer adjusted position minus renter adjusted
              position. In <strong className="text-foreground">net worth</strong>{" "}
              mode, it is buyer net worth minus renter net worth. Break-even is the
              first year where buying stays ahead for the rest of the horizon (a
              durable crossover, not a one-year blip)—computed separately for each
              mode.
            </p>
            <p>
              Nominal dollars use your inputs as entered. Real (inflation-adjusted)
              dollars deflate results using your inflation assumption so you can
              compare purchasing power over time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="operator-title text-2xl text-foreground">
              What this model does not include
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Transaction timing, moving costs, or rent-vs-buy lifestyle differences</li>
              <li>Rental security deposits or buyer inspection/repair surprises</li>
              <li>Changes in tax law, itemization status, or AMT</li>
              <li>Primary residence exclusion eligibility beyond the simplified cap</li>
              <li>Behavioral factors (forced savings from a mortgage, etc.)</li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}
