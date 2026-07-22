import { ANALYSIS_STEPS } from '@/lib/quoteAnalysis'
import { cn } from '@/lib/utils'

interface LoadingAnalysisProps {
  activeStep: number
}

export function LoadingAnalysis({ activeStep }: LoadingAnalysisProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Analyzing quote
      </p>
      <ul className="mt-5 space-y-3">
        {ANALYSIS_STEPS.map((step, index) => {
          const done = index < activeStep
          const active = index === activeStep
          return (
            <li
              key={step}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                active && 'bg-secondary scale-[1.01]',
                done && 'text-success',
                !done && !active && 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold',
                  done && 'border-success bg-success/10',
                  active && 'border-burgundy bg-burgundy text-primary-foreground animate-pulse',
                )}
              >
                {done ? '✓' : index + 1}
              </span>
              {step}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
