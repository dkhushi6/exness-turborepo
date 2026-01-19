import { Check, Clock, Headphones, RefreshCw } from "lucide-react";

const benefits = [
  { icon: RefreshCw, text: "No requotes on any trade" },
  { icon: Clock, text: "Instant deposits & withdrawals" },
  { icon: Headphones, text: "24/7 multilingual support" },
  { icon: Check, text: "Negative balance protection" },
];

const metrics = [
  {
    value: "99.99%",
    label: "Platform Uptime",
    description: "Enterprise-grade reliability",
  },
  {
    value: "<10ms",
    label: "Execution Speed",
    description: "Ultra-low latency",
  },
  {
    value: "$5B+",
    label: "Daily Volume",
    description: "Deep global liquidity",
  },
  {
    value: "2M+",
    label: "Active Traders",
    description: "Worldwide trading community",
  },
];

export const SecurityTrust = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Why Traders <span className="text-primary">Choose Us</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Trusted trading conditions designed for performance and reliability
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border border-border bg-background p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-background p-6 text-center"
              >
                <p className="mb-1 text-3xl font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="font-semibold text-foreground">{metric.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
