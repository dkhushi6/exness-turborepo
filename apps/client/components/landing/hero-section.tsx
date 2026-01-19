import { Button } from "../../components/ui/button";
// import { TradingDashboard } from "../../components/TradingDashboard";
import { Shield, Users, Award } from "lucide-react";

const trustIndicators = [
  { icon: Shield, text: "Regulated & Secure" },
  { icon: Users, text: "2M+ Active Traders" },
  { icon: Award, text: "Award-Winning Platform" },
];

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 lg:pt-0">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Trade global markets with{" "}
                <span className="text-primary">speed and precision</span>
              </h1>

              <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
                Forex, Crypto, Stocks, Indices & Commodities on one powerful
                platform
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
              <Button size="lg" className="px-8">
                Start Trading
              </Button>

              <Button size="lg" variant="outline" className="px-8">
                Try Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              {trustIndicators.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">{/* <TradingDashboard /> */}</div>
        </div>
      </div>
    </section>
  );
};
