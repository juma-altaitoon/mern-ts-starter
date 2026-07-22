import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'info' | 'warning'

type ToastItem = {
  id: string
  title: string
  description: string
  variant: ToastVariant
}

type ToastContextValue = {
  addToast: (title: string, description: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900',
  error: 'border-red-500/30 bg-red-500/10 text-red-900',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-900',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-900',
}

const variantIcons: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  warning: AlertTriangle,
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const addToast = (title: string, description: string, variant: ToastVariant = 'info') => {
    const id = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const toast: ToastItem = { id, title, description, variant }

    setToasts((current) => [...current, toast])

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 5000)
  }

  const value = useMemo(() => ({ addToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isMounted && createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
          {toasts.map((toast) => {
            const Icon = variantIcons[toast.variant]
            return (
              <div
                key={toast.id}
                className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-3xl border p-4 shadow-2xl shadow-black/10 ${variantStyles[toast.variant]}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    <p className="text-sm leading-6 text-current/80">{toast.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                    className="text-current/70 transition hover:text-current"
                    aria-label="Dismiss notification"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
