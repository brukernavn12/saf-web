import Image from "next/image";
import { cn } from "@/lib/utils";

interface LanguedocSectionProps {
  title?: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function LanguedocSection({
  title,
  imageSrc,
  imageAlt,
  reverse = false,
  children,
  className,
}: LanguedocSectionProps) {
  return (
    <section
      className={cn(
        "border-t border-primary/10 py-16 md:py-24",
        className
      )}
    >
      <div
        className={cn(
          "grid items-center gap-10 md:grid-cols-2 md:gap-16",
          reverse && "md:[&>*:first-child]:order-2"
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-primary/10 md:aspect-[5/4]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          {title && (
            <h2 className="font-serif text-3xl text-primary md:text-4xl">
              {title}
            </h2>
          )}
          <div
            className={cn(
              "space-y-5 text-base leading-[1.85] text-text/75 md:text-lg",
              title && "mt-6"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
