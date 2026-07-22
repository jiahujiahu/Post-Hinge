import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-gradient-to-b from-card/80 to-secondary/30 px-6 py-12 text-center shadow-soft md:py-14">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-burgundy shadow-soft">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
