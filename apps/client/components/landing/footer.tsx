export const Footer = () => {
  return (
    <footer className="border-t border-border bg-[#171618]">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold  text-[#FFDE01]">exness</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              Trade global markets with confidence on a secure and
              high-performance trading platform.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            Regulated • Secure • Trusted
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} exness. All rights reserved.
          </p>

          <p className="text-xs text-muted-foreground max-w-xl">
            Trading involves significant risk and may result in the loss of your
            capital. Please trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};
