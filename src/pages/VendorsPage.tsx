import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Sparkles } from 'lucide-react'
import type { QuoteAnalysis, VendorCategory } from '@/types'
import { useApp } from '@/hooks/useApp'
import { PageHeader } from '@/components/PageHeader'
import { QuoteUpload } from '@/components/QuoteUpload'
import { LoadingAnalysis } from '@/components/LoadingAnalysis'
import { QuoteAnalysisCard } from '@/components/QuoteAnalysisCard'
import { VendorComparisonTable } from '@/components/VendorComparisonTable'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ANALYSIS_STEPS, buildMockAnalysis, quoteFromAnalysis, resolveQuoteId } from '@/lib/quoteAnalysis'
import { personalizeQuoteAnalysis } from '@/lib/personalization'

const categories: VendorCategory[] = [
  'Photography',
  'Catering',
  'Venue',
  'Flowers',
  'Music',
  'Fashion',
  'Stationery',
  'Transportation',
  'Miscellaneous',
]

export function VendorsPage() {
  const { data, addQuote, selectQuote, addQuoteToComparison } = useApp()
  const [category, setCategory] = useState<VendorCategory>('Photography')
  const [vendorName, setVendorName] = useState('Northlight Photography')
  const [price, setPrice] = useState('4200')
  const [notes, setNotes] = useState('Travel fees unclear; overtime rate listed separately.')
  const [fileName, setFileName] = useState<string | undefined>('northlight-quote.pdf')
  const [analyzing, setAnalyzing] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [analysis, setAnalysis] = useState<QuoteAnalysis | null>(() => {
    const first = data.analyses[0]
    if (!first) return null
    const quoteCategory = data.quotes.find((quote) => quote.id === first.quoteId)?.category
    return personalizeQuoteAnalysis(first, data.couple, quoteCategory)
  })
  const comparisonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.location.hash === '#comparison') {
      comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    if (analyzing) return
    setAnalysis((current) => {
      const source =
        (current && data.analyses.find((item) => item.quoteId === current.quoteId)) ||
        data.analyses[0]
      if (!source) return null
      const quoteCategory = data.quotes.find((quote) => quote.id === source.quoteId)?.category
      return personalizeQuoteAnalysis(source, data.couple, quoteCategory)
    })
  }, [data.couple, data.analyses, data.quotes, analyzing])

  const runAnalysis = () => {
    const amount = Number(price)
    if (!vendorName.trim() || !Number.isFinite(amount) || amount <= 0) {
      toast.error('Vendor name and a valid quoted price are required')
      return
    }

    setAnalyzing(true)
    setActiveStep(0)
    setAnalysis(null)

    let step = 0
    const interval = window.setInterval(() => {
      step += 1
      setActiveStep(Math.min(step, ANALYSIS_STEPS.length))
      if (step > ANALYSIS_STEPS.length) {
        window.clearInterval(interval)
        const quoteId = resolveQuoteId(
          vendorName,
          data.quotes.find((quote) => quote.vendorName.toLowerCase() === vendorName.toLowerCase())?.id,
        )
        const existing = data.quotes.find((quote) => quote.id === quoteId)
        const raw = buildMockAnalysis({
          vendorName,
          category,
          price: amount,
          currency: data.wedding.currency,
          notes,
          quoteId,
        })
        const result = personalizeQuoteAnalysis(raw, data.couple, category)
        const quote = quoteFromAnalysis(result, category, notes, fileName, existing)
        addQuote(quote, result)
        setAnalysis(result)
        setAnalyzing(false)
        toast.success('Quote analysis ready')
        window.setTimeout(() => {
          comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 350)
      }
    }, 520)
  }

  return (
    <div>
      <PageHeader
        title="Vendor quote analyzer"
        subtitle="Upload a quote, extract the package details, and compare pricing before you book."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Upload and analyze</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuoteUpload fileName={fileName} onFileSelect={setFileName} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vendor-category">Vendor category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as VendorCategory)}>
                  <SelectTrigger id="vendor-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor name</Label>
                <Input
                  id="vendorName"
                  value={vendorName}
                  onChange={(event) => setVendorName(event.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="price">Quoted price ({data.wedding.currency})</Label>
                <Input
                  id="price"
                  type="number"
                  min={1}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Optional notes</Label>
              <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
            </div>
            <Button className="w-full" onClick={runAnalysis} disabled={analyzing}>
              {analyzing ? 'Analyzing quote…' : 'Analyze quote'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Tip: Keep the prefilled Northlight Photography sample for the hackathon walkthrough.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {analyzing ? (
            <LoadingAnalysis activeStep={Math.min(activeStep, ANALYSIS_STEPS.length - 1)} />
          ) : null}
          {analysis && !analyzing ? (
            <QuoteAnalysisCard
              analysis={analysis}
              onAddToComparison={() => {
                addQuoteToComparison(analysis.quoteId)
                toast.success('Added to comparison')
                comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              onMarkSelected={() => {
                selectQuote(analysis.quoteId)
                toast.success(`${analysis.vendorName} marked as selected`)
              }}
            />
          ) : null}
          {!analysis && !analyzing ? (
            <EmptyState
              icon={Sparkles}
              title="Ready to analyze a quote"
              description="Run the Northlight Photography sample to see included services, risk level, local range estimates, and a negotiation-ready recommendation."
              actionLabel="Analyze sample quote"
              onAction={runAnalysis}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-6" ref={comparisonRef}>
        <VendorComparisonTable
          quotes={data.quotes}
          highlightedIds={data.selectedQuoteIds}
          onSelect={(id) => {
            selectQuote(id)
            const quote = data.quotes.find((item) => item.id === id)
            toast.success(`${quote?.vendorName ?? 'Vendor'} marked as selected`)
          }}
        />
      </div>
    </div>
  )
}
