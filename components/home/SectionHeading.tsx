import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  number?: string;
  lead?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  eyebrow,
  number,
  lead,
  className,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-20 md:mb-28 lg:mb-36",
        centered && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex items-start gap-8 md:gap-12 lg:gap-16",
          centered && "flex-col items-center"
        )}
      >
        {number && (
          <span
            className={cn(
              "shrink-0 font-serif text-6xl leading-none text-accent/25 md:text-8xl lg:text-9xl",
              centered && "text-7xl md:text-9xl"
            )}
            aria-hidden
          >
            {number}
          </span>
        )}
        <div className={cn(centered && "flex flex-col items-center")}>
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.36em] text-accent">
              {eyebrow}
            </p>
          )}
          <h2
            className={cn(
              "font-serif text-[2.75rem] leading-[1.02] text-primary md:text-6xl md:leading-[1.02] lg:text-7xl lg:leading-[1.02]",
              eyebrow && "mt-6 md:mt-8",
              number && !eyebrow && "mt-2"
            )}
          >
            {title}
          </h2>
        </div>
      </div>
      {lead && (
        <p
          className={cn(
            "mt-10 max-w-md text-base leading-relaxed text-text/55 md:mt-12 md:text-lg md:leading-relaxed",
            centered && "mx-auto",
            number && "md:ml-[6.5rem] lg:ml-[8.5rem]",
            centered && number && "md:ml-auto"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
