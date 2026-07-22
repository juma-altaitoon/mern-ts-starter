import * as React from 'react'
import { cn } from '@/lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

/**
 * Input is a controlled text field that provides consistent spacing and states.
 * It is meant to be reused across forms so the app stays visually consistent.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
