import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button.styles"

/**
 * Button is the app's shared button primitive.
 *
 * We use a single Button component so we can keep hover, focus,
 * disabled, and sizing behavior consistent across the UI.
 *
 * `asChild` allows this component to render a different element
 * while preserving the shared styling and behavior.
 */

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
  const Comp = asChild ? Slot : "button"

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

export { Button }
