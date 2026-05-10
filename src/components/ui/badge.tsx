import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs font-medium text-black/70",
        className,
      )}
    >
      {children}
    </span>
  );
}
