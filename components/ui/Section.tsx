import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  narrow?: boolean;
}

export function Section({ children, className, id, narrow }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div
        className={cn(
          "mx-auto px-6",
          narrow ? "max-w-3xl" : "max-w-6xl"
        )}
      >
        {children}
      </div>
    </section>
  );
}
