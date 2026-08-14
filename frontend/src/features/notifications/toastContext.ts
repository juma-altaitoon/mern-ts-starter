import { createContext } from 'react'

type ToastVariant = 'success' | 'error' | 'info' | 'warning'

type ToastContextValue = {
  addToast: (title: string, description: string, variant?: ToastVariant) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
export type { ToastContextValue }
