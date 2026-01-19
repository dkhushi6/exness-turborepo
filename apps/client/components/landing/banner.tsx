import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export const Banner = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          Open an account and start trading{" "}
          <span className="text-primary">in minutes</span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          Join over 2 million traders worldwide. No hidden fees, instant
          deposits, and 24/7 support.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            className="
              group px-8 py-6 text-base font-semibold
              bg-primary text-primary-foreground
              hover:bg-primary/90
              shadow-md hover:shadow-lg
              transition-all
            "
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            className="
              px-8 py-6 text-base font-semibold
              border-border
              hover:bg-muted
              transition-all
            "
          >
            Try Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
