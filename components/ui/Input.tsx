import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text/80">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full border border-primary/15 bg-white px-4 py-3 text-text placeholder:text-text/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30",
          className
        )}
        {...props}
      />
    </div>
  );
}
