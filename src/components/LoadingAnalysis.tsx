import { Check } from 'lucide-react'
import { ANALYSIS_STEPS } from '@/lib/quoteAnalysis'
import { cn } from '@/lib/utils'

interface LoadingAnalysisProps {
  activeStep: number
}

export function LoadingAnalysis({ activeStep }: LoadingAnalysisProps) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Analyzing quote
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Extracting package details and comparing demo local benchmarks…
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
                active && 'scale-[1.01] bg-secondary',
                done && 'text-success',
                !done && !active && 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold',
                  done && 'border-success bg-success/10 text-success',
                  active && 'animate-pulse border-burgundy bg-burgundy text-primary-foreground',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </span>
              {step}
              {active ? <span className="sr-only">In progress</span> : null}
              {done ? <span className="sr-only">Complete</span> : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
