import type { VendorQuote } from '@/types'
import { formatCurrency, riskLabel, riskStyles } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface VendorComparisonTableProps {
  quotes: VendorQuote[]
}

export function VendorComparisonTable({ quotes }: VendorComparisonTableProps) {
  const photographyQuotes = quotes.filter((quote) => quote.category === 'Photography').slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Photographer comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Best overall value is highlighted — not only the cheapest option. Benchmarks are demo estimates.
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
            </tr>
          </thead>
          <tbody>
            {photographyQuotes.map((quote) => (
              <tr
                key={quote.id}
                className={`border-b border-border/70 last:border-0 ${quote.isBestValue ? 'bg-champagne/30' : ''}`}
              >
                <td className="py-4 pr-3 font-medium">
                  <div className="flex flex-col gap-1">
                    {quote.vendorName}
                    {quote.isBestValue ? <Badge variant="success">Best overall value</Badge> : null}
                    {quote.selected ? <Badge variant="rose">Selected</Badge> : null}
                  </div>
                </td>
                <td className="py-4 pr-3">{formatCurrency(quote.price, quote.currency)}</td>
                <td className="py-4 pr-3">{quote.hours ?? '—'}</td>
                <td className="py-4 pr-3">{quote.secondShooter ? 'Yes' : 'No'}</td>
                <td className="py-4 pr-3">{quote.engagementSession ? 'Yes' : 'No'}</td>
                <td className="py-4 pr-3">{quote.album ? 'Yes' : 'No'}</td>
                <td className="py-4 pr-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyles(quote.risk)}`}>
                    {riskLabel(quote.risk)}
                  </span>
                </td>
                <td className="max-w-xs py-4 text-muted-foreground">{quote.aiRecommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
