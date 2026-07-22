import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Route } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'afterhinge_walkthrough_dismissed'

const steps = [
  { label: 'Review your couple profile', to: '/profile', hint: 'Wild Adventurers · travel & food' },
  { label: 'Analyze photographer quote', to: '/vendors', hint: 'See “Fit for your wedding”' },
  { label: 'Compare vendor packages', to: '/vendors#comparison', hint: 'Best value is highlighted' },
  { label: 'Generate a personality-matched email', to: '/emails?purpose=Quote%20negotiation&vendor=Northlight%20Photography&autogen=1', hint: 'Tone: Match our personality' },
  { label: 'Rebalance the priority budget', to: '/budget', hint: 'Protect photo, food, experiences' },
  { label: 'Ask how to make it feel like you', to: '/assistant?q=How%20can%20we%20make%20the%20wedding%20feel%20more%20like%20us%3F', hint: 'Profile-aware answer' },
]

interface DemoWalkthroughProps {
  className?: string
}

export function DemoWalkthrough({ className }: DemoWalkthroughProps) {
  const [dismissed, setDismissed] = useState(true)
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1')
    try {
      const raw = localStorage.getItem('afterhinge_walkthrough_steps')
      setCompleted(raw ? (JSON.parse(raw) as string[]) : [])
    } catch {
      setCompleted([])
    }
  }, [])

  if (dismissed) return null

  return (
    <Card className={cn('border-burgundy/15 bg-gradient-to-br from-card via-card to-blush/30', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-burgundy">
            <Route className="h-3.5 w-3.5" />
            Presenter walkthrough
          </div>
          <CardTitle className="text-xl">Demo the full product story</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow these steps for a smooth hackathon presentation.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, '1')
            setDismissed(true)
          }}
        >
          Dismiss
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step, index) => {
          const done = completed.includes(step.to)
          return (
            <div
              key={step.to}
              className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card/80 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-burgundy">
                  {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {index + 1}. {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.hint}</p>
                </div>
              </div>
              <Button asChild size="sm" variant={done ? 'outline' : 'secondary'}>
                <Link
                  to={step.to}
                  onClick={() => {
                    const next = Array.from(new Set([...completed, step.to]))
                    setCompleted(next)
                    localStorage.setItem('afterhinge_walkthrough_steps', JSON.stringify(next))
                  }}
                >
                  Open
                </Link>
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
