import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[calc(var(--radius)-2px)] border border-input/90 bg-background/72 px-3.5 py-2 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] transition-[border-color,box-shadow,background-color] outline-none supports-[backdrop-filter]:backdrop-blur-sm file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/90 focus-visible:border-primary/35 focus-visible:bg-background/88 focus-visible:ring-3 focus-visible:ring-ring/18 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/40 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
