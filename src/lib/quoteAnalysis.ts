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

export function buildMockAnalysis(input: {
  vendorName: string
  category: VendorCategory
  price: number
  currency: string
  notes?: string
}): QuoteAnalysis {
  const isNorthlight =
    input.vendorName.toLowerCase().includes('northlight') ||
    (input.category === 'Photography' && input.price >= 4000)

  if (isNorthlight || input.category === 'Photography') {
    const range = { min: 2800, max: 3600 }
    const percentAboveRange = Math.max(
      0,
      Math.round(((input.price - range.max) / range.max) * 100),
    )
    return {
      id: createId('analysis'),
      quoteId: createId('quote'),
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

  const rangeMax = Math.round(input.price * 0.9)
  const rangeMin = Math.round(input.price * 0.7)
  return {
    id: createId('analysis'),
    quoteId: createId('quote'),
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
): VendorQuote {
  return {
    id: analysis.quoteId,
    vendorId: createId('vendor'),
    vendorName: analysis.vendorName,
    category,
    price: analysis.quotedPrice,
    currency: analysis.currency,
    hours: category === 'Photography' ? 8 : undefined,
    secondShooter: category === 'Photography' ? true : undefined,
    engagementSession: category === 'Photography' ? true : undefined,
    album: category === 'Photography' ? false : undefined,
    notes,
    fileName,
    risk: analysis.riskLevel,
    aiRecommendation: analysis.recommendation.slice(0, 120) + (analysis.recommendation.length > 120 ? '…' : ''),
    selected: false,
    createdAt: new Date().toISOString(),
  }
}
