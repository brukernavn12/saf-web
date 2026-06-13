import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  eyebrow,
  className,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-14 md:mb-20",
        centered && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif text-4xl leading-[1.08] text-primary md:text-5xl lg:text-[3.25rem]",
          eyebrow && "mt-5"
        )}
      >
        {title}
      </h2>
    </div>
  );
}
