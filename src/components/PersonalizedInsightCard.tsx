import { Link } from 'react-router-dom'
import type { PersonalizedInsight } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { archetypeLabel } from '@/lib/personalization'

interface PersonalizedInsightCardProps {
  insight: PersonalizedInsight
}

export function PersonalizedInsightCard({ insight }: PersonalizedInsightCardProps) {
  return (
    <Card className="h-full transition-transform hover:-translate-y-0.5">
      <CardContent className="flex h-full flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-burgundy">Made for you</p>
        <h3 className="mt-2 font-display text-2xl font-semibold">{insight.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{insight.description}</p>
        <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-xs text-muted-foreground">
          Why: {insight.reason}
          {insight.relatedArchetype ? ` · ${archetypeLabel(insight.relatedArchetype)}` : ''}
        </p>
        {insight.actionLabel && insight.actionTo ? (
          <Button asChild variant="outline" size="sm" className="mt-4 w-fit">
            <Link to={insight.actionTo}>{insight.actionLabel}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
