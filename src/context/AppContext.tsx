import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppData,
  BudgetCategory,
  ChatMessage,
  CoupleProfile,
  EmailDraft,
  Expense,
  PlanningTask,
  QuoteAnalysis,
  VendorQuote,
  WeddingDetails,
} from '@/types'
import { loadAppData, resetAppData, saveAppData } from '@/lib/storage'
import { getBudgetSummary } from '@/lib/budget'
import { deriveBudgetCategories, createId } from '@/lib/utils'

interface AppContextValue {
  data: AppData
  budgetSummary: ReturnType<typeof getBudgetSummary>
  budgetCategories: BudgetCategory[]
  updateCouple: (couple: Partial<CoupleProfile>) => void
  updateWedding: (wedding: Partial<WeddingDetails>) => void
  completeOnboarding: (couple: CoupleProfile, wedding: WeddingDetails) => void
  setTasks: (tasks: PlanningTask[]) => void
  upsertTask: (task: PlanningTask) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  addQuote: (quote: VendorQuote, analysis?: QuoteAnalysis) => void
  selectQuote: (id: string) => void
  addQuoteToComparison: (id: string) => void
  addEmailDraft: (draft: Omit<EmailDraft, 'id' | 'createdAt'>) => void
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void
  resetDemo: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData())

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => updater(prev))
  }, [])

  const value = useMemo<AppContextValue>(() => {
    const budgetCategories = deriveBudgetCategories(data.budgetCategories)
    const budgetSummary = getBudgetSummary({ ...data, budgetCategories })

    return {
      data,
      budgetSummary,
      budgetCategories,
      updateCouple: (couple) =>
        update((prev) => ({ ...prev, couple: { ...prev.couple, ...couple } })),
      updateWedding: (wedding) =>
        update((prev) => ({ ...prev, wedding: { ...prev.wedding, ...wedding } })),
      completeOnboarding: (couple, wedding) =>
        update((prev) => ({
          ...prev,
          couple: { ...couple, onboardingComplete: true },
          wedding,
        })),
      setTasks: (tasks) => update((prev) => ({ ...prev, tasks })),
      upsertTask: (task) =>
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
          const categories = prev.budgetCategories.map((category) => {
            if (category.name !== expense.category) return category
            if (expense.type === 'spent') {
              return { ...category, spent: category.spent + expense.amount }
            }
            return { ...category, committed: category.committed + expense.amount }
          })
          return {
            ...prev,
            expenses: [nextExpense, ...prev.expenses],
            budgetCategories: categories,
            wedding: {
              ...prev.wedding,
              amountSpent:
                expense.type === 'spent'
                  ? prev.wedding.amountSpent + expense.amount
                  : prev.wedding.amountSpent,
            },
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

          return {
            ...prev,
            expenses: prev.expenses.map((item) => (item.id === expense.id ? expense : item)),
            budgetCategories: categories,
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
          return {
            ...prev,
            expenses: prev.expenses.filter((item) => item.id !== id),
            budgetCategories: categories,
          }
        }),
      addQuote: (quote, analysis) =>
        update((prev) => ({
          ...prev,
          quotes: [quote, ...prev.quotes.filter((item) => item.id !== quote.id)],
          analyses: analysis
            ? [analysis, ...prev.analyses.filter((item) => item.quoteId !== analysis.quoteId)]
            : prev.analyses,
        })),
      selectQuote: (id) =>
        update((prev) => ({
          ...prev,
          quotes: prev.quotes.map((quote) => ({
            ...quote,
            selected: quote.id === id ? true : quote.category === prev.quotes.find((q) => q.id === id)?.category ? false : quote.selected,
          })),
          selectedQuoteIds: Array.from(new Set([...prev.selectedQuoteIds, id])),
        })),
      addQuoteToComparison: (id) =>
        update((prev) => ({
          ...prev,
          selectedQuoteIds: prev.selectedQuoteIds.includes(id)
            ? prev.selectedQuoteIds
            : [...prev.selectedQuoteIds, id],
        })),
      addEmailDraft: (draft) =>
        update((prev) => ({
          ...prev,
          emailDrafts: [
            { ...draft, id: createId('email'), createdAt: new Date().toISOString() },
            ...prev.emailDrafts,
          ],
        })),
      addChatMessage: (message) =>
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
      resetDemo: () => setData(resetAppData()),
    }
  }, [data, update])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
