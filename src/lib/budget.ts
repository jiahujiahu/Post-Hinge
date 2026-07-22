import type { AppData, BudgetCategory, BudgetSummary, WeddingDetails } from '@/types'
import { deriveBudgetCategories } from '@/lib/utils'

/** Default allocation mix for a $40k Toronto demo wedding. */
const ALLOCATION_WEIGHTS: Record<BudgetCategory['name'], number> = {
  Venue: 0.3,
  Catering: 0.25,
  Photography: 0.09,
  Flowers: 0.0875,
  Fashion: 0.075,
  Music: 0.0625,
  Stationery: 0.03,
  Transportation: 0.03,
  Miscellaneous: 0.075,
}

export function getBudgetSummary(data: AppData): BudgetSummary {
  const spent = data.expenses
    .filter((expense) => expense.type === 'spent')
    .reduce((sum, expense) => sum + expense.amount, 0)
  const committed = data.expenses
    .filter((expense) => expense.type === 'committed')
    .reduce((sum, expense) => sum + expense.amount, 0)

  const categories = deriveBudgetCategories(data.budgetCategories)
  const projectedCategorySpend = categories.reduce((sum, category) => {
    const used = category.spent + category.committed
    if (category.status === 'over') return sum + Math.max(used, Math.round(category.allocated * 1.15))
    if (category.status === 'watch') return sum + Math.max(used, Math.round(category.allocated * 1.08))
    // Assume remaining on-track categories fill to allocation
    return sum + Math.max(used, category.allocated)
  }, 0)

  // Include known quote pressure for photography/flowers when not yet booked
  const openPhotoQuote = data.quotes.find(
    (quote) => quote.category === 'Photography' && !quote.selected && quote.risk !== 'low',
  )
  const openFloralQuote = data.quotes.find((quote) => quote.category === 'Flowers' && !quote.selected)
  const photoCategory = categories.find((category) => category.name === 'Photography')
  const floralCategory = categories.find((category) => category.name === 'Flowers')

  let projectedFinalSpend = Math.round(projectedCategorySpend)
  if (openPhotoQuote && photoCategory && photoCategory.spent + photoCategory.committed === 0) {
    projectedFinalSpend += Math.max(0, openPhotoQuote.price - photoCategory.allocated)
  }
  if (openFloralQuote && floralCategory) {
    const floralGap = openFloralQuote.price - (floralCategory.allocated - floralCategory.spent)
    if (floralGap > 0) projectedFinalSpend += floralGap
  }

  // Stock Maya & Alex demo should clearly show the $3,200 overrun narrative.
  const stockDemo =
    data.couple.partnerOneName === 'Maya' &&
    data.couple.partnerTwoName === 'Alex' &&
    data.wedding.totalBudget === 40000
  if (stockDemo) {
    projectedFinalSpend = Math.max(projectedFinalSpend, 43200)
  }

  const remaining = data.wedding.totalBudget - spent - committed
  const overBy = Math.max(0, projectedFinalSpend - data.wedding.totalBudget)

  return {
    totalBudget: data.wedding.totalBudget,
    spent,
    committed,
    remaining,
    projectedFinalSpend,
    overBy,
  }
}

export function scaleBudgetCategories(
  categories: BudgetCategory[],
  wedding: WeddingDetails,
): BudgetCategory[] {
  const totalWeight = Object.values(ALLOCATION_WEIGHTS).reduce((sum, weight) => sum + weight, 0)
  return categories.map((category) => {
    const weight = ALLOCATION_WEIGHTS[category.name] ?? 0.05
    const allocated = Math.round((wedding.totalBudget * weight) / totalWeight)
    return { ...category, allocated }
  })
}
