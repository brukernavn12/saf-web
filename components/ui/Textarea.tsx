import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-text/80"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "min-h-[140px] w-full resize-y border border-primary/15 bg-white px-4 py-3 text-text placeholder:text-text/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30",
          className
        )}
        {...props}
      />
    </div>
  );
}
