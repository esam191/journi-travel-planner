import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-[calc(var(--radius)-2px)] border border-input/90 bg-background/72 px-3.5 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] transition-[border-color,box-shadow,background-color] outline-none supports-[backdrop-filter]:backdrop-blur-sm placeholder:text-muted-foreground/90 focus-visible:border-primary/35 focus-visible:bg-background/88 focus-visible:ring-3 focus-visible:ring-ring/18 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/40 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
