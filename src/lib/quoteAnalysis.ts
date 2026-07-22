import type { QuoteAnalysis, VendorCategory, VendorQuote } from '@/types'
import { createId } from '@/lib/utils'

const ANALYSIS_STEPS = [
  'Reading quote',
  'Extracting services',
  'Comparing pricing',
  'Checking hidden fees',
  'Generating recommendation',
] as const

export { ANALYSIS_STEPS }

const KNOWN_QUOTE_IDS: Record<string, string> = {
  'northlight photography': 'quote_1',
  'softframe co.': 'quote_2',
  'softframe co': 'quote_2',
  'lumière studio': 'quote_3',
  'lumiere studio': 'quote_3',
  'bloom & stem': 'quote_4',
}

export function resolveQuoteId(vendorName: string, existingId?: string) {
  const known = KNOWN_QUOTE_IDS[vendorName.trim().toLowerCase()]
  return existingId || known || createId('quote')
}

export function buildMockAnalysis(input: {
  vendorName: string
  category: VendorCategory
  price: number
  currency: string
  notes?: string
  quoteId?: string
}): QuoteAnalysis {
  const quoteId = resolveQuoteId(input.vendorName, input.quoteId)
  const isNorthlight = input.vendorName.toLowerCase().includes('northlight')
  const isPhotography = input.category === 'Photography'

  if (isNorthlight || (isPhotography && input.price >= 4000)) {
    const range = { min: 2800, max: 3600 }
    const percentAboveRange = Math.max(
      0,
      Math.round(((input.price - range.max) / range.max) * 100),
    )
    return {
      id: `analysis_${quoteId}`,
      quoteId,
      vendorName: input.vendorName || 'Northlight Photography',
      quotedPrice: input.price || 4200,
      currency: input.currency,
      estimatedRange: range,
      riskLevel: percentAboveRange >= 15 ? 'medium-high' : 'medium',
      included: [
        'Eight hours of coverage',
        'Second photographer',
        'Online gallery',
        'Engagement session',
      ],
      concerns: [
        'Travel fees are not clearly defined',
        'Album is not included',
        'Overtime rate is high',
        'Deposit is non-refundable',
      ],
      recommendation:
        'The package is approximately 24% above the typical local range. The second photographer and engagement session add value, but you should ask whether the travel fee can be waived and whether an album can be included before accepting.',
      percentAboveRange: percentAboveRange || 24,
    }
  }

  if (isPhotography) {
    const range = { min: 2800, max: 3600 }
    const percentAboveRange = Math.max(
      0,
      Math.round(((input.price - range.max) / range.max) * 100),
    )
    return {
      id: `analysis_${quoteId}`,
      quoteId,
      vendorName: input.vendorName,
      quotedPrice: input.price,
      currency: input.currency,
      estimatedRange: range,
      riskLevel: percentAboveRange >= 15 ? 'medium-high' : percentAboveRange > 0 ? 'medium' : 'low',
      included: [
        'Coverage package',
        input.price >= 3400 ? 'Second photographer' : 'Primary photographer',
        'Online gallery',
        input.price >= 3000 ? 'Engagement session or album option' : 'Digital deliverables',
      ],
      concerns: [
        input.notes || 'Confirm overtime and travel fees in writing',
        'Local price benchmarks in this demo are estimates',
      ],
      recommendation:
        input.price <= 3400
          ? 'This package sits near the demo local range and balances coverage with extras. Strong candidate for comparison.'
          : `This package is about ${percentAboveRange || 10}% above the demo local top range. Negotiate inclusions before accepting.`,
      percentAboveRange,
    }
  }

  const rangeMax = Math.round(input.price * 0.9)
  const rangeMin = Math.round(input.price * 0.7)
  return {
    id: `analysis_${quoteId}`,
    quoteId,
    vendorName: input.vendorName,
    quotedPrice: input.price,
    currency: input.currency,
    estimatedRange: { min: rangeMin, max: rangeMax },
    riskLevel: 'medium',
    included: ['Core package services', 'Standard consultation', 'Digital deliverables'],
    concerns: [
      input.notes || 'Some fees may be listed separately from the base package',
      'Local price benchmarks in this demo are estimates',
    ],
    recommendation: `This ${input.category.toLowerCase()} quote sits above the demo local estimate of $${rangeMin.toLocaleString()}–$${rangeMax.toLocaleString()} ${input.currency}. Ask for a clearer fee breakdown before accepting.`,
    percentAboveRange: 12,
  }
}

export function quoteFromAnalysis(
  analysis: QuoteAnalysis,
  category: VendorCategory,
  notes?: string,
  fileName?: string,
  existing?: VendorQuote,
): VendorQuote {
  const isPhoto = category === 'Photography'
  return {
    id: analysis.quoteId,
    vendorId: existing?.vendorId || createId('vendor'),
    vendorName: analysis.vendorName,
    category,
    price: analysis.quotedPrice,
    currency: analysis.currency,
    hours: isPhoto ? existing?.hours ?? 8 : existing?.hours,
    secondShooter: isPhoto ? existing?.secondShooter ?? true : existing?.secondShooter,
    engagementSession: isPhoto ? existing?.engagementSession ?? true : existing?.engagementSession,
    album: isPhoto ? existing?.album ?? false : existing?.album,
    notes,
    fileName,
    risk: analysis.riskLevel,
    aiRecommendation:
      analysis.recommendation.slice(0, 120) + (analysis.recommendation.length > 120 ? '…' : ''),
    isBestValue: existing?.isBestValue,
    selected: existing?.selected ?? false,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }
}
