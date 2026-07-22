import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type {
  Expense,
  PlanningTask,
  QuoteAnalysis,
  VendorQuote,
  CoupleProfile,
  WeddingDetails,
  ChatMessage,
  EmailDraft,
} from '@/types'
import { loadAppData, resetAppData, saveAppData } from '@/lib/storage'
import { getBudgetSummary } from '@/lib/budget'
import { applyOnboardingToAppData } from '@/lib/onboarding'
import { mergePersonalizedTasks, personalizeQuoteAnalysis } from '@/lib/personalization'
import { createId, deriveBudgetCategories } from '@/lib/utils'
import { AppContext, type AppContextValue } from '@/context/app-context'

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(() => loadAppData())

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const update = useCallback((updater: (prev: typeof data) => typeof data) => {
    setData((prev) => updater(prev))
  }, [])

  const value = useMemo<AppContextValue>(() => {
    const budgetCategories = deriveBudgetCategories(data.budgetCategories)
    const budgetSummary = getBudgetSummary({ ...data, budgetCategories })

    const syncAmountSpent = (expenses: Expense[]) =>
      expenses.filter((item) => item.type === 'spent').reduce((sum, item) => sum + item.amount, 0)

    return {
      data,
      budgetSummary,
      budgetCategories,
      updateCouple: (couple) =>
        update((prev) => ({ ...prev, couple: { ...prev.couple, ...couple } })),
      updateWedding: (wedding) =>
        update((prev) => ({ ...prev, wedding: { ...prev.wedding, ...wedding } })),
      completeOnboarding: (couple: CoupleProfile, wedding: WeddingDetails) =>
        update((prev) => applyOnboardingToAppData(prev, couple, wedding)),
      setTasks: (tasks) => update((prev) => ({ ...prev, tasks })),
      upsertTask: (task: PlanningTask) =>
        update((prev) => {
          const exists = prev.tasks.some((item) => item.id === task.id)
          return {
            ...prev,
            tasks: exists
              ? prev.tasks.map((item) => (item.id === task.id ? task : item))
              : [task, ...prev.tasks],
          }
        }),
      deleteTask: (id) =>
        update((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== id) })),
      toggleTaskComplete: (id) =>
        update((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  status: !task.completed ? 'completed' : 'upcoming',
                }
              : task,
          ),
        })),
      addExpense: (expense) =>
        update((prev) => {
          const nextExpense: Expense = { ...expense, id: createId('exp') }
          const expenses = [nextExpense, ...prev.expenses]
          const categories = prev.budgetCategories.map((category) => {
            if (category.name !== expense.category) return category
            if (expense.type === 'spent') {
              return { ...category, spent: category.spent + expense.amount }
            }
            return { ...category, committed: category.committed + expense.amount }
          })
          return {
            ...prev,
            expenses,
            budgetCategories: categories,
            wedding: { ...prev.wedding, amountSpent: syncAmountSpent(expenses) },
          }
        }),
      updateExpense: (expense) =>
        update((prev) => {
          const previous = prev.expenses.find((item) => item.id === expense.id)
          if (!previous) return prev

          const categories = prev.budgetCategories.map((category) => {
            let spent = category.spent
            let committed = category.committed

            if (category.name === previous.category) {
              if (previous.type === 'spent') spent -= previous.amount
              else committed -= previous.amount
            }
            if (category.name === expense.category) {
              if (expense.type === 'spent') spent += expense.amount
              else committed += expense.amount
            }

            return { ...category, spent: Math.max(0, spent), committed: Math.max(0, committed) }
          })

          const expenses = prev.expenses.map((item) => (item.id === expense.id ? expense : item))
          return {
            ...prev,
            expenses,
            budgetCategories: categories,
            wedding: { ...prev.wedding, amountSpent: syncAmountSpent(expenses) },
          }
        }),
      deleteExpense: (id) =>
        update((prev) => {
          const target = prev.expenses.find((item) => item.id === id)
          if (!target) return prev
          const categories = prev.budgetCategories.map((category) => {
            if (category.name !== target.category) return category
            if (target.type === 'spent') {
              return { ...category, spent: Math.max(0, category.spent - target.amount) }
            }
            return { ...category, committed: Math.max(0, category.committed - target.amount) }
          })
          const expenses = prev.expenses.filter((item) => item.id !== id)
          return {
            ...prev,
            expenses,
            budgetCategories: categories,
            wedding: { ...prev.wedding, amountSpent: syncAmountSpent(expenses) },
          }
        }),
      addQuote: (quote: VendorQuote, analysis?: QuoteAnalysis) =>
        update((prev) => ({
          ...prev,
          quotes: [
            quote,
            ...prev.quotes.filter(
              (item) =>
                item.id !== quote.id &&
                !(
                  item.vendorName.toLowerCase() === quote.vendorName.toLowerCase() &&
                  item.category === quote.category
                ),
            ),
          ],
          analyses: analysis
            ? [analysis, ...prev.analyses.filter((item) => item.quoteId !== analysis.quoteId)]
            : prev.analyses,
          selectedQuoteIds: prev.selectedQuoteIds.includes(quote.id)
            ? prev.selectedQuoteIds
            : [...prev.selectedQuoteIds, quote.id],
        })),
      selectQuote: (id) =>
        update((prev) => {
          const target = prev.quotes.find((quote) => quote.id === id)
          if (!target) return prev
          return {
            ...prev,
            quotes: prev.quotes.map((quote) => ({
              ...quote,
              selected:
                quote.id === id
                  ? true
                  : quote.category === target.category
                    ? false
                    : Boolean(quote.selected),
            })),
            selectedQuoteIds: Array.from(new Set([...prev.selectedQuoteIds, id])),
          }
        }),
      addQuoteToComparison: (id) =>
        update((prev) => ({
          ...prev,
          selectedQuoteIds: prev.selectedQuoteIds.includes(id)
            ? prev.selectedQuoteIds
            : [...prev.selectedQuoteIds, id],
        })),
      addEmailDraft: (draft: Omit<EmailDraft, 'id' | 'createdAt'>) =>
        update((prev) => ({
          ...prev,
          emailDrafts: [
            { ...draft, id: createId('email'), createdAt: new Date().toISOString() },
            ...prev.emailDrafts,
          ],
        })),
      addChatMessage: (
        message: Omit<ChatMessage, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
      ) =>
        update((prev) => ({
          ...prev,
          chatMessages: [
            ...prev.chatMessages,
            {
              id: message.id ?? createId('chat'),
              createdAt: message.createdAt ?? new Date().toISOString(),
              role: message.role,
              content: message.content,
              contextCards: message.contextCards,
            },
          ],
        })),
      updatePersonalityProfile: (couple) =>
        update((prev) => {
          const nextCouple = {
            ...couple,
            partners: couple.partners.map((partner, index) => ({
              ...partner,
              name: index === 0 ? couple.partnerOneName : couple.partnerTwoName,
            })),
          }
          return {
            ...prev,
            couple: nextCouple,
            tasks: mergePersonalizedTasks(prev.tasks, couple.personality.primaryArchetype),
            analyses: prev.analyses.map((item) => {
              const category = prev.quotes.find((quote) => quote.id === item.quoteId)?.category
              return personalizeQuoteAnalysis(item, nextCouple, category)
            }),
          }
        }),
      applyPriorityBudget: (categories) =>
        update((prev) => ({
          ...prev,
          budgetCategories: categories,
        })),
      resetDemo: () => setData(resetAppData()),
    }
  }, [data, update])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
