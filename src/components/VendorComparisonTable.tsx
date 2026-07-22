import { Link } from 'react-router-dom'
import { Store } from 'lucide-react'
import type { VendorQuote } from '@/types'
import { formatCurrency, riskLabel, riskStyles } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/EmptyState'

interface VendorComparisonTableProps {
  quotes: VendorQuote[]
  highlightedIds?: string[]
  onSelect?: (id: string) => void
}

export function VendorComparisonTable({
  quotes,
  highlightedIds = [],
  onSelect,
}: VendorComparisonTableProps) {
  const photographyQuotes = quotes
    .filter((quote) => quote.category === 'Photography')
    .sort((a, b) => {
      if (a.isBestValue) return -1
      if (b.isBestValue) return 1
      return a.price - b.price
    })
    .slice(0, 3)

  return (
    <Card id="comparison">
      <CardHeader>
        <CardTitle className="text-xl">Photographer comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Best overall value is highlighted — not only the cheapest option. Benchmarks are demo estimates.
        </p>
      </CardHeader>
      <CardContent>
        {photographyQuotes.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No photographer quotes yet"
            description="Analyze a quote to populate this comparison with package details and AI recommendations."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-semibold">Vendor</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Hours</th>
                    <th className="pb-3 font-semibold">Second shooter</th>
                    <th className="pb-3 font-semibold">Engagement session</th>
                    <th className="pb-3 font-semibold">Album</th>
                    <th className="pb-3 font-semibold">Risk</th>
                    <th className="pb-3 font-semibold">AI recommendation</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {photographyQuotes.map((quote) => {
                    const inComparison = highlightedIds.includes(quote.id)
                    return (
                      <tr
                        key={quote.id}
                        className={`border-b border-border/70 last:border-0 ${
                          quote.isBestValue ? 'bg-champagne/30' : inComparison ? 'bg-blush/20' : ''
                        }`}
                      >
                        <td className="py-4 pr-3 font-medium">
                          <div className="flex flex-col gap-1">
                            {quote.vendorName}
                            {quote.isBestValue ? <Badge variant="success">Best overall value</Badge> : null}
                            {quote.selected ? <Badge variant="rose">Selected</Badge> : null}
                            {inComparison && !quote.isBestValue ? (
                              <Badge variant="secondary">In comparison</Badge>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 pr-3">{formatCurrency(quote.price, quote.currency)}</td>
                        <td className="py-4 pr-3">{quote.hours ?? '—'}</td>
                        <td className="py-4 pr-3">{quote.secondShooter ? 'Yes' : 'No'}</td>
                        <td className="py-4 pr-3">{quote.engagementSession ? 'Yes' : 'No'}</td>
                        <td className="py-4 pr-3">{quote.album ? 'Yes' : 'No'}</td>
                        <td className="py-4 pr-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyles(quote.risk)}`}
                          >
                            {riskLabel(quote.risk)}
                          </span>
                        </td>
                        <td className="max-w-xs py-4 text-muted-foreground">{quote.aiRecommendation}</td>
                        <td className="py-4">
                          <div className="flex flex-col gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link
                                to={`/emails?purpose=${encodeURIComponent('Quote negotiation')}&vendor=${encodeURIComponent(quote.vendorName)}&autogen=1`}
                              >
                                Email
                              </Link>
                            </Button>
                            {onSelect ? (
                              <Button size="sm" variant="champagne" onClick={() => onSelect(quote.id)}>
                                Select
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {photographyQuotes.map((quote) => (
                <article
                  key={quote.id}
                  className={`rounded-2xl border border-border/80 p-4 ${
                    quote.isBestValue ? 'bg-champagne/30' : 'bg-card'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{quote.vendorName}</h3>
                    {quote.isBestValue ? <Badge variant="success">Best value</Badge> : null}
                    {quote.selected ? <Badge variant="rose">Selected</Badge> : null}
                  </div>
                  <p className="mt-2 font-display text-2xl font-semibold">
                    {formatCurrency(quote.price, quote.currency)}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <dt className="font-semibold text-foreground">Hours</dt>
                      <dd>{quote.hours ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Second shooter</dt>
                      <dd>{quote.secondShooter ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Engagement</dt>
                      <dd>{quote.engagementSession ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Album</dt>
                      <dd>{quote.album ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-sm text-muted-foreground">{quote.aiRecommendation}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link
                        to={`/emails?purpose=${encodeURIComponent('Quote negotiation')}&vendor=${encodeURIComponent(quote.vendorName)}&autogen=1`}
                      >
                        Email
                      </Link>
                    </Button>
                    {onSelect ? (
                      <Button size="sm" variant="champagne" onClick={() => onSelect(quote.id)}>
                        Select
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
