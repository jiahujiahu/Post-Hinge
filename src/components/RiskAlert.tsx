import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RiskAlertProps {
  title: string
  description?: string
  action?: ReactNode
  variant?: 'warning' | 'danger'
}

export function RiskAlert({ title, description, action, variant = 'warning' }: RiskAlertProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-start',
        variant === 'danger'
          ? 'border-destructive/30 bg-destructive/5'
          : 'border-rose/40 bg-blush/40',
      )}
    >
      <div className={cn('mt-0.5', variant === 'danger' ? 'text-destructive' : 'text-burgundy')}>
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('font-semibold', variant === 'danger' ? 'text-destructive' : 'text-burgundy')}>
          {title}
        </p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  )
}
