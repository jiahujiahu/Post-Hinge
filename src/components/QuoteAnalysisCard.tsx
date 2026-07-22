import { Link } from 'react-router-dom'
import type { QuoteAnalysis } from '@/types'
import { formatCurrency, riskLabel, riskStyles } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuoteAnalysisCardProps {
  analysis: QuoteAnalysis
  onAddToComparison: () => void
  onMarkSelected: () => void
}

export function QuoteAnalysisCard({
  analysis,
  onAddToComparison,
  onMarkSelected,
}: QuoteAnalysisCardProps) {
  const emailHref = `/emails?purpose=${encodeURIComponent('Quote negotiation')}&vendor=${encodeURIComponent(analysis.vendorName)}&autogen=1`

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-2xl">{analysis.vendorName}</CardTitle>
          <Badge className={riskStyles(analysis.riskLevel)}>Risk: {riskLabel(analysis.riskLevel)}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Quoted price:{' '}
          <span className="font-semibold text-foreground">
            {formatCurrency(analysis.quotedPrice, analysis.currency)}
          </span>
          {' · '}
          Estimated local range: {formatCurrency(analysis.estimatedRange.min, analysis.currency)}–
          {formatCurrency(analysis.estimatedRange.max, analysis.currency)}
        </p>
        <p className="text-xs text-muted-foreground">
          Local price benchmarks are demo estimates, not verified market data.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Included
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {analysis.included.map((item) => (
              <li key={item} className="rounded-xl bg-secondary/70 px-3 py-2 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Potential concerns
          </h4>
          <ul className="space-y-2">
            {analysis.concerns.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                • {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-blush/50 p-4">
          <h4 className="font-semibold text-burgundy">Recommendation</h4>
          <p className="mt-2 text-sm leading-relaxed">{analysis.recommendation}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to={emailHref}>Generate negotiation email</Link>
          </Button>
          <Button variant="outline" onClick={onAddToComparison}>
            Add to comparison
          </Button>
          <Button variant="champagne" onClick={onMarkSelected}>
            Mark as selected
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
