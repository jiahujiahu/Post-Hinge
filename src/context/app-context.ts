import { createContext } from 'react'
import type {
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
import type { getBudgetSummary } from '@/lib/budget'
import type { AppData } from '@/types'

export interface AppContextValue {
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
  addChatMessage: (
    message: Omit<ChatMessage, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
  ) => void
  resetDemo: () => void
}

export const AppContext = createContext<AppContextValue | null>(null)
