import { createDefaultAppData, STORAGE_KEY } from '@/data/mockData'
import type { AppData } from '@/types'

function mergeAppData(defaults: AppData, stored: Partial<AppData>): AppData {
  return {
    ...defaults,
    ...stored,
    couple: { ...defaults.couple, ...stored.couple },
    wedding: { ...defaults.wedding, ...stored.wedding },
    tasks: stored.tasks ?? defaults.tasks,
    vendors: stored.vendors ?? defaults.vendors,
    quotes: stored.quotes ?? defaults.quotes,
    analyses: stored.analyses ?? defaults.analyses,
    budgetCategories: stored.budgetCategories ?? defaults.budgetCategories,
    expenses: stored.expenses ?? defaults.expenses,
    emailDrafts: stored.emailDrafts ?? defaults.emailDrafts,
    chatMessages: stored.chatMessages ?? defaults.chatMessages,
    selectedQuoteIds: stored.selectedQuoteIds ?? defaults.selectedQuoteIds,
  }
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const defaults = createDefaultAppData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }
    return mergeAppData(createDefaultAppData(), JSON.parse(raw) as Partial<AppData>)
  } catch {
    return createDefaultAppData()
  }
}

export function saveAppData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetAppData(): AppData {
  const defaults = createDefaultAppData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
  return defaults
}
