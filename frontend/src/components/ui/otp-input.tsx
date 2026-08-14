import * as React from 'react'
import { cn } from '@/lib/utils'

type OtpInputProps = {
  id?: string
  value?: string
  onChange: (value: string) => void
  error?: boolean
  length?: number
}

export const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(
  ({ id, value = '', onChange, error = false, length = 6 }, ref) => {
    const [digits, setDigits] = React.useState<string[]>(
      Array.from({ length }, (_, index) => value.charAt(index) ?? '')
    )

    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

    React.useEffect(() => {
      setDigits(Array.from({ length }, (_, index) => value.charAt(index) ?? ''))
    }, [value, length])

    const updateDigits = (nextDigits: string[]) => {
      setDigits(nextDigits)
      onChange(nextDigits.join(''))
    }

    const handleChange = (index: number, nextValue: string) => {
      if (!/^[0-9]*$/.test(nextValue)) return

      const digit = nextValue.slice(-1)
      const nextDigits = [...digits]
      nextDigits[index] = digit
      updateDigits(nextDigits)

      if (digit && index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        if (digits[index]) {
          const nextDigits = [...digits]
          nextDigits[index] = ''
          updateDigits(nextDigits)
          return
        }

        if (index > 0) {
          inputsRef.current[index - 1]?.focus()
          const nextDigits = [...digits]
          nextDigits[index - 1] = ''
          updateDigits(nextDigits)
        }
      }

      if (event.key === 'ArrowLeft' && index > 0) {
        inputsRef.current[index - 1]?.focus()
      }

      if (event.key === 'ArrowRight' && index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }

    return (
      <div className="grid grid-cols-6 gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element
              if (index === 0 && ref) {
                if (typeof ref === 'function') {
                  ref(element)
                } else {
                  ref.current = element
                }
              }
            }}
            id={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className={cn(
              'h-12 w-full rounded-2xl border bg-surface text-center text-lg font-medium text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20',
              error ? 'border-destructive text-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border'
            )}
          />
        ))}
      </div>
    )
  }
)
OtpInput.displayName = 'OtpInput'
