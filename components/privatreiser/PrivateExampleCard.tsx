import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface PrivateExampleCardProps {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export function PrivateExampleCard({
  title,
  description,
  href,
  linkLabel,
  imageSrc,
  imageAlt = "",
  className,
}: PrivateExampleCardProps) {
  const content = (
    <>
      {imageSrc ? (
        <div className="relative aspect-[4/3] bg-primary/10">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              href && "group-hover:scale-105"
            )}
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-cream-dark" aria-hidden />
      )}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-serif text-lg leading-snug text-primary md:text-xl">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-text/70">
          {description}
        </p>
        {href && linkLabel && (
          <span className="mt-4 text-xs font-medium tracking-wide text-accent group-hover:text-accent/80">
            {linkLabel} →
          </span>
        )}
      </div>
    </>
  );

  const cardClass = cn(
    "flex h-full flex-col overflow-hidden rounded-lg border border-primary/10 bg-white",
    href && "group transition-shadow hover:shadow-md",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <article className={cardClass}>{content}</article>;
}
