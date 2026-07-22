import { createDefaultAppData, STORAGE_KEY } from '@/data/mockData'
import { defaultMayaAlexPersonality } from '@/lib/personalization'
import type { AppData, CoupleProfile, PartnerProfile } from '@/types'

function ensurePartners(couple: Partial<CoupleProfile>): PartnerProfile[] {
  if (couple.partners?.length) return couple.partners
  return [
    {
      id: 'partner_one',
      name: couple.partnerOneName || 'Partner one',
      avatarType: 'illustration',
      avatarValue: 'avatar_aurora',
      traits: [],
      personalPriorities: couple.priorities?.slice(0, 2) ?? [],
    },
    {
      id: 'partner_two',
      name: couple.partnerTwoName || 'Partner two',
      avatarType: 'illustration',
      avatarValue: 'avatar_river',
      traits: [],
      personalPriorities: couple.priorities?.slice(0, 2) ?? [],
    },
  ]
}

function mergeAppData(defaults: AppData, stored: Partial<AppData>): AppData {
  const couple = { ...defaults.couple, ...stored.couple }
  return {
    ...defaults,
    ...stored,
    couple: {
      ...couple,
      partners: ensurePartners(couple),
      personality: {
        ...defaultMayaAlexPersonality(),
        ...defaults.couple.personality,
        ...stored.couple?.personality,
        secondaryTraits:
          stored.couple?.personality?.secondaryTraits ??
          defaults.couple.personality.secondaryTraits,
        weddingVibes:
          stored.couple?.personality?.weddingVibes ?? defaults.couple.personality.weddingVibes,
        guestMemoryPriorities:
          stored.couple?.personality?.guestMemoryPriorities ??
          defaults.couple.personality.guestMemoryPriorities,
        lowPriorityExpenses:
          stored.couple?.personality?.lowPriorityExpenses ??
          defaults.couple.personality.lowPriorityExpenses,
      },
    },
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
    // Drop legacy keys so old shapes don't fight the new personality model.
    localStorage.removeItem('afterhinge_demo_data_v1')
    localStorage.removeItem('afterhinge_demo_data_v2')

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
