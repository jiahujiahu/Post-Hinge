import { useState } from 'react'
import { toast } from 'sonner'
import type { QuoteAnalysis, VendorCategory } from '@/types'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/PageHeader'
import { QuoteUpload } from '@/components/QuoteUpload'
import { LoadingAnalysis } from '@/components/LoadingAnalysis'
import { QuoteAnalysisCard } from '@/components/QuoteAnalysisCard'
import { VendorComparisonTable } from '@/components/VendorComparisonTable'
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
import { ANALYSIS_STEPS, buildMockAnalysis, quoteFromAnalysis } from '@/lib/quoteAnalysis'

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
  const [analysis, setAnalysis] = useState<QuoteAnalysis | null>(data.analyses[0] ?? null)

  const runAnalysis = () => {
    if (!vendorName.trim() || !price) {
      toast.error('Vendor name and quoted price are required')
      return
    }

    setAnalyzing(true)
    setActiveStep(0)
    setAnalysis(null)

    let step = 0
    const interval = window.setInterval(() => {
      step += 1
      setActiveStep(step)
      if (step >= ANALYSIS_STEPS.length) {
        window.clearInterval(interval)
        const result = buildMockAnalysis({
          vendorName,
          category,
          price: Number(price),
          currency: data.wedding.currency,
          notes,
        })
        const quote = quoteFromAnalysis(result, category, notes, fileName)
        addQuote(quote, result)
        setAnalysis(result)
        setAnalyzing(false)
        toast.success('Quote analysis ready')
      }
    }, 550)
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
                <Label>Vendor category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as VendorCategory)}>
                  <SelectTrigger>
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
                <Input id="vendorName" value={vendorName} onChange={(event) => setVendorName(event.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="price">Quoted price ({data.wedding.currency})</Label>
                <Input
                  id="price"
                  type="number"
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
              Tip: Use the prefilled Northlight Photography sample for the hackathon walkthrough.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {analyzing ? <LoadingAnalysis activeStep={Math.min(activeStep, ANALYSIS_STEPS.length - 1)} /> : null}
          {analysis && !analyzing ? (
            <QuoteAnalysisCard
              analysis={analysis}
              onAddToComparison={() => {
                addQuoteToComparison(analysis.quoteId)
                toast.success('Added to comparison')
              }}
              onMarkSelected={() => {
                selectQuote(analysis.quoteId)
                toast.success(`${analysis.vendorName} marked as selected`)
              }}
            />
          ) : null}
          {!analysis && !analyzing ? (
            <Card>
              <CardContent className="p-8 text-sm text-muted-foreground">
                Run an analysis to see included services, risk level, local range estimates, and a negotiation-ready
                recommendation.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <VendorComparisonTable quotes={data.quotes} />
      </div>
    </div>
  )
}
