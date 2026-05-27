import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How the rent vs. buy model computes net worth, net result, break-even, and optional investment assumptions.",
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
              your planned stay. Switch to <strong className="text-foreground">net result</strong>{" "}
              (formerly cost-adjusted net position) in Display settings for the
              unrecoverable-cost view.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">Simple vs. advanced inputs</h2>
            <p>
              Core inputs—ZIP, home price, rent, down payment, mortgage rate, and years
              staying—are always visible. Growth rates and other details live in the collapsed{" "}
              <em>Advanced — Assumptions</em> accordion (home appreciation under Property, rent
              growth under Rent).
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
              Net worth if you buy = sale proceeds (+ optional side portfolio)
            </div>
            <div className="rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
              Net worth if you rent = portfolio liquidation (after tax)
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">Net result (optional)</h2>
            <p>
              Liquidation value minus unrecoverable housing costs. Down payment, closing
              costs, and mortgage principal are excluded from costs because they return through
              home equity at sale.
            </p>
            <div className="rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
              Net result if you buy = sale proceeds (+ side portfolio) − cumulative operating costs
            </div>
            <div className="rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs text-foreground">
              Net result if you rent = portfolio liquidation (after tax) − cumulative rent and insurance
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="de-headline text-2xl text-foreground">Break-even rule</h2>
            <p>
              The headline uses your planned stay as the primary decision year. When paths
              cross, a secondary line shows when buying becomes better.
            </p>
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
