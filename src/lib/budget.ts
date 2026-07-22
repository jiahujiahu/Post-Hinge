import type { AppData, BudgetSummary } from '@/types'
import { deriveBudgetCategories } from '@/lib/utils'

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
    // Demo projection: assume remaining allocation fills to 108% of plan for watch/over categories
    if (category.status === 'over') return sum + Math.max(used, category.allocated * 1.15)
    if (category.status === 'watch') return sum + Math.max(used, category.allocated * 1.08)
    return sum + Math.max(used, category.allocated)
  }, 0)

  const projectedFinalSpend = Math.max(43200, Math.round(projectedCategorySpend))
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
