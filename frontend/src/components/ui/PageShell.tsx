import React from 'react'
import { cn } from '@/lib/utils'

type PageShellProps = {
  children: React.ReactNode
  className?: string
}

export const PageShell: React.FC<PageShellProps> = ({ children, className }) => {
  return (
    <div className={cn('mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
