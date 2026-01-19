import { Zap, TrendingDown, Shield, Settings } from "lucide-react";

const advantages = [
  {
    icon: Zap,
    title: "Ultra-Fast Execution",
    description:
      "Execute trades in milliseconds with our high-performance infrastructure",
    stat: "<10ms",
    statLabel: "avg. execution",
  },
  {
    icon: TrendingDown,
    title: "Low & Transparent Spreads",
    description:
      "Competitive spreads from 0.0 pips with no hidden fees or commissions",
    stat: "0.0",
    statLabel: "pips from",
  },
  {
    icon: Shield,
    title: "High Leverage Options",
    description: "Flexible leverage up to 1:200 for qualified traders",
    stat: "1:2000",
    statLabel: "max leverage",
  },
  {
    icon: Settings,
    title: "Advanced Risk Management",
    description:
      "Stop Loss, Take Profit, and margin protection built into every trade",
    stat: "100%",
    statLabel: "protection",
  },
];

export const TradingAdvantages = () => {
  return (
    <section id="conditions" className="py-20 lg:py-28 h-full">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Why Trade With{" "}
            <span className="text-primary font-semibold text-5xl">exness</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Industry-leading technology and conditions designed for serious
            traders
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <advantage.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">{advantage.title}</h3>

              <p className="mb-4 text-sm text-muted-foreground">
                {advantage.description}
              </p>

              <div className="border-t border-border pt-4">
                <span className="text-2xl font-bold text-foreground">
                  {advantage.stat}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {advantage.statLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
