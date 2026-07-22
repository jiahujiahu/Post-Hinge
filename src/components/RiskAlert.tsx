import { AlertTriangle } from 'lucide-react'

interface RiskAlertProps {
  title: string
  description?: string
}

export function RiskAlert({ title, description }: RiskAlertProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-rose/40 bg-blush/40 p-4">
      <div className="mt-0.5 text-burgundy">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-burgundy">{title}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  )
}
