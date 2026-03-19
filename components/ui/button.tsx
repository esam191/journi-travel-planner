import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[calc(var(--radius)-2px)] border bg-clip-padding text-sm font-medium tracking-[0.01em] whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color] duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary/80 bg-primary text-primary-foreground shadow-[0_16px_40px_-24px_color-mix(in_oklab,var(--primary)_82%,transparent)] hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-[0_22px_46px_-26px_color-mix(in_oklab,var(--primary)_90%,transparent)]",
        outline:
          "border-border/80 bg-background/70 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-sm hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/82 hover:text-foreground aria-expanded:border-primary/30 aria-expanded:bg-secondary/82 aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] hover:-translate-y-0.5 hover:bg-secondary/88 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "border-transparent bg-transparent hover:bg-secondary/72 hover:text-foreground aria-expanded:bg-secondary/72 aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "border-destructive/20 bg-destructive text-white shadow-[0_14px_36px_-26px_rgba(154,52,36,0.72)] hover:-translate-y-0.5 hover:bg-destructive/92 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/90 dark:hover:bg-destructive dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-[min(var(--radius-md),8px)] px-2.5 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[min(var(--radius-md),10px)] px-3 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-11 gap-2 px-5 text-[0.95rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
