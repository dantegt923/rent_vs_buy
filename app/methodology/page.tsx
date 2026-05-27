import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How the rent vs. buy model computes net worth, financial outcome, break-even, and optional investment assumptions.",
};

export default function MethodologyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_at_70%_0%,hsl(var(--primary)/0.12),transparent_38%)]" />
      <div className="relative mx-auto max-w-3xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="de-kicker">Documentation</p>
            <h1 className="de-editorial-title text-3xl sm:text-4xl">Methodology</h1>
          </div>
          <Link className="de-btn-ghost w-fit text-sm" href="/">
            Back to calculator
          </Link>
        </header>

        <article className="de-panel space-y-6 rounded-sm p-4 text-sm leading-relaxed text-muted-foreground sm:space-y-8 sm:p-6">
          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">
              What this calculator measures
            </h2>
            <p>
              The default view is <strong className="text-foreground">net worth</strong> at
              the comparison year: what you would have if you liquidated on each path. Switch
              to <strong className="text-foreground">financial outcome</strong> (formerly
              cost-adjusted net position) in Settings for the unrecoverable-cost view.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">Simple vs. advanced inputs</h2>
            <p>
              Core inputs—ZIP, home price, rent, down payment, mortgage rate, and years
              staying—are always visible. Optional growth rates sit on the same panel.
              Everything else (loan details, ownership costs, taxes, investment assumptions,
              inflation) lives in the collapsed <em>Your assumptions</em> accordion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">Years staying and horizon</h2>
            <p>
              <strong className="text-foreground">Years staying</strong> is how long you plan
              to keep the home before selling. The model horizon matches your loan term (30
              years by default, or the term you set in advanced loan settings). Cash purchases
              use a 30-year horizon.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">Net worth (default)</h2>
            <p>
              Liquidation value at each year without subtracting cumulative housing spend
              along the way.
            </p>
            <div className="rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
              If buying = sale proceeds (+ optional side portfolio)
            </div>
            <div className="rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
              If renting = portfolio liquidation (after tax)
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">
              Financial outcome (optional)
            </h2>
            <p>
              Liquidation value minus unrecoverable housing costs. Down payment, closing
              costs, and mortgage principal are excluded from costs because they return through
              home equity at sale.
            </p>
            <div className="rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
              If buying = sale proceeds (+ side portfolio) − cumulative operating costs
            </div>
            <div className="rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
              If renting = portfolio liquidation (after tax) − cumulative rent and insurance
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">Break-even rule</h2>
            <p>
              The headline and chart anchor on a single comparison year chosen by this
              hierarchy (always resolves to a year):
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Durable break-even</strong> — buying
                pulls ahead and stays ahead through the horizon.
              </li>
              <li>
                <strong className="text-foreground">First year buying leads</strong> — first
                crossover toward buying when durability fails.
              </li>
              <li>
                <strong className="text-foreground">Closest to even</strong> — smallest
                absolute gap when buying never durably leads.
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">
              What this model does not include
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Refinancing, moving costs, or lifestyle differences</li>
              <li>Rental deposits or repair surprises</li>
              <li>Full tax law edge cases and occupancy tests</li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}
