import { getArchetype } from '@/data/personality'
import type {
  BudgetCategory,
  CoupleArchetype,
  CouplePersonality,
  CoupleProfile,
  PersonalizedInsight,
  PlanningTask,
  QuoteAnalysis,
  VendorCategory,
  WeddingDetails,
} from '@/types'

export function archetypeLabel(id: CoupleArchetype) {
  return getArchetype(id).name
}

export function personalizedGreeting(couple: CoupleProfile) {
  const archetype = couple.personality.primaryArchetype
  const traits = couple.personality.secondaryTraits
  const names = `${couple.partnerOneName} & ${couple.partnerTwoName}`

  switch (archetype) {
    case 'wild-adventurers':
      return {
        headline: `Your wedding plan is built for meaningful experiences, incredible food, and a little adventure.`,
        subcopy: `${names} — AfterHinge is protecting the moments you’ll actually remember.`,
      }
    case 'budget-smart':
      return {
        headline: `Your plan protects joy and value—beautiful where it matters, practical everywhere else.`,
        subcopy: `${names} — we’ll help you skip low-impact spend without losing warmth.`,
      }
    case 'elegant-traditionalists':
      return {
        headline: `Your plan leans polished, intentional, and guest-ready from ceremony to last toast.`,
        subcopy: `${names} — etiquette and timeless details stay front and center.`,
      }
    case 'relaxed-minimalists':
      return {
        headline: `Your plan stays calm, intimate, and free from unnecessary complexity.`,
        subcopy: `${names} — fewer decisions, more ease.`,
      }
    case 'creative-storytellers':
      return {
        headline: `Your plan is shaped around personal details guests will remember as yours alone.`,
        subcopy: `${names} — storytelling beats generic wedding rules.`,
      }
    case 'social-celebrators':
      return {
        headline: `Your plan prioritizes energy, food, music, and a guest experience that feels alive.`,
        subcopy: `${names}${traits.includes('Dance-all-night') ? ' — the dance floor is non-negotiable.' : ' — celebration first.'}`,
      }
  }
}

export function buildPersonalizedInsights(
  couple: CoupleProfile,
  wedding: WeddingDetails,
): PersonalizedInsight[] {
  const archetype = couple.personality.primaryArchetype
  const label = archetypeLabel(archetype)
  const low = couple.personality.lowPriorityExpenses
  const priorities = couple.priorities

  const insights: PersonalizedInsight[] = []

  if (archetype === 'wild-adventurers' || priorities.includes('Photography') || priorities.includes('Guest experience')) {
    insights.push({
      id: 'protect-experience',
      title: 'Protect the experience budget',
      description: `You care most about ${priorities.slice(0, 3).join(', ').toLowerCase()}. Keep at least $6,000 uncommitted until your venue and photography decisions are finalized.`,
      reason: `Matched to your ${label} profile and top priorities.`,
      relatedArchetype: archetype,
      actionLabel: 'Review budget',
      actionTo: '/budget',
    })
  }

  if (low.length > 0) {
    const sample = low.slice(0, 2).join(' and ').toLowerCase()
    insights.push({
      id: 'skip-low-impact',
      title: 'Skip low-impact traditions',
      description: `${sample.charAt(0).toUpperCase() + sample.slice(1)} ${low.length > 2 ? 'and similar extras' : ''} are low priorities for you. Simplifying them could free approximately $800–$1,500 for food or photography.`,
      reason: 'Based on the expenses you marked as least important.',
      relatedArchetype: archetype,
      actionLabel: 'See timeline ideas',
      actionTo: '/timeline',
    })
  }

  if (archetype === 'wild-adventurers' || couple.personality.weddingVibes.includes('Wild outdoor adventure')) {
    insights.push({
      id: 'location-story',
      title: 'Make the location part of the story',
      description:
        'Your Wild Adventurer profile is a strong fit for a scenic outdoor ceremony, destination weekend, or portrait session away from the venue.',
      reason: 'Pulled from your archetype and wedding vibe selections.',
      relatedArchetype: 'wild-adventurers',
      actionLabel: 'Ask the assistant',
      actionTo: '/assistant?q=How%20can%20we%20make%20the%20wedding%20feel%20more%20like%20us%3F',
    })
  }

  if (archetype === 'budget-smart' || couple.personality.spendingPhilosophy.includes('under budget')) {
    insights.push({
      id: 'quote-discipline',
      title: 'Keep quote discipline on major vendors',
      description: `With a ${wedding.currency} ${wedding.totalBudget.toLocaleString()} plan, request three quotes for photography and catering before locking anything in.`,
      reason: 'Aligned with your spending philosophy and value focus.',
      relatedArchetype: archetype,
      actionLabel: 'Analyze a quote',
      actionTo: '/vendors',
    })
  }

  if (archetype === 'social-celebrators') {
    insights.push({
      id: 'entertainment-early',
      title: 'Book entertainment while options are open',
      description:
        'Guest energy is a core priority for you. Confirm music, venue sound rules, and late-night food earlier than the average couple.',
      reason: 'Recommended for Social Celebrators.',
      relatedArchetype: 'social-celebrators',
      actionLabel: 'Open timeline',
      actionTo: '/timeline',
    })
  }

  return insights.slice(0, 4)
}

export function personalizedTasksForArchetype(archetype: CoupleArchetype): PlanningTask[] {
  const label = `Recommended for ${archetypeLabel(archetype)}`
  const base = (partial: Omit<PlanningTask, 'id' | 'personalizedFor' | 'personalizedLabel' | 'completed' | 'status'> & { id: string }): PlanningTask => ({
    ...partial,
    completed: false,
    status: 'upcoming',
    personalizedFor: archetype,
    personalizedLabel: label,
  })

  switch (archetype) {
    case 'wild-adventurers':
      return [
        base({
          id: 'pers_adv_1',
          title: 'Research destination or outdoor ceremony permits',
          category: 'Venue',
          phase: '9–12 months before',
          recommendedDate: '2026-05-10',
          priority: 'high',
          note: 'Confirm park or estate requirements early.',
        }),
        base({
          id: 'pers_adv_2',
          title: 'Create a weather backup plan',
          category: 'Planning',
          phase: '3–6 months before',
          recommendedDate: '2026-09-15',
          priority: 'high',
        }),
        base({
          id: 'pers_adv_3',
          title: 'Plan guest transportation for scenic locations',
          category: 'Transportation',
          phase: '3–6 months before',
          recommendedDate: '2026-10-01',
          priority: 'medium',
        }),
        base({
          id: 'pers_adv_4',
          title: 'Schedule an adventure photography session',
          category: 'Photography',
          phase: '3–6 months before',
          recommendedDate: '2026-09-20',
          priority: 'high',
        }),
        base({
          id: 'pers_adv_5',
          title: 'Build a local travel guide for guests',
          category: 'Experience',
          phase: '1–3 months before',
          recommendedDate: '2026-11-05',
          priority: 'medium',
        }),
      ]
    case 'budget-smart':
      return [
        base({
          id: 'pers_bud_1',
          title: 'Set category spending limits',
          category: 'Planning',
          phase: '12+ months before',
          recommendedDate: '2026-02-01',
          priority: 'high',
        }),
        base({
          id: 'pers_bud_2',
          title: 'Request three quotes per major vendor',
          category: 'Planning',
          phase: '9–12 months before',
          recommendedDate: '2026-04-15',
          priority: 'high',
        }),
        base({
          id: 'pers_bud_3',
          title: 'Identify DIY opportunities',
          category: 'Stationery',
          phase: '6–9 months before',
          recommendedDate: '2026-07-01',
          priority: 'medium',
        }),
        base({
          id: 'pers_bud_4',
          title: 'Review hidden vendor fees',
          category: 'Planning',
          phase: '6–9 months before',
          recommendedDate: '2026-07-20',
          priority: 'high',
        }),
        base({
          id: 'pers_bud_5',
          title: 'Create a no-spend tradition list',
          category: 'Planning',
          phase: '3–6 months before',
          recommendedDate: '2026-09-01',
          priority: 'medium',
        }),
      ]
    case 'social-celebrators':
      return [
        base({
          id: 'pers_soc_1',
          title: 'Book entertainment early',
          category: 'Music',
          phase: '9–12 months before',
          recommendedDate: '2026-04-01',
          priority: 'high',
        }),
        base({
          id: 'pers_soc_2',
          title: 'Confirm venue sound restrictions',
          category: 'Venue',
          phase: '6–9 months before',
          recommendedDate: '2026-06-15',
          priority: 'high',
        }),
        base({
          id: 'pers_soc_3',
          title: 'Plan late-night food',
          category: 'Catering',
          phase: '3–6 months before',
          recommendedDate: '2026-10-10',
          priority: 'medium',
        }),
        base({
          id: 'pers_soc_4',
          title: 'Create dance-floor timeline',
          category: 'Planning',
          phase: '1–3 months before',
          recommendedDate: '2026-11-20',
          priority: 'medium',
        }),
        base({
          id: 'pers_soc_5',
          title: 'Review bar service capacity',
          category: 'Catering',
          phase: '3–6 months before',
          recommendedDate: '2026-09-25',
          priority: 'high',
        }),
      ]
    case 'elegant-traditionalists':
      return [
        base({
          id: 'pers_ele_1',
          title: 'Finalize ceremony traditions and readings',
          category: 'Planning',
          phase: '6–9 months before',
          recommendedDate: '2026-07-10',
          priority: 'high',
        }),
        base({
          id: 'pers_ele_2',
          title: 'Order formal invitations',
          category: 'Stationery',
          phase: '3–6 months before',
          recommendedDate: '2026-08-20',
          priority: 'high',
        }),
        base({
          id: 'pers_ele_3',
          title: 'Draft seating etiquette plan',
          category: 'Guests',
          phase: '1–3 months before',
          recommendedDate: '2026-11-10',
          priority: 'medium',
        }),
      ]
    case 'relaxed-minimalists':
      return [
        base({
          id: 'pers_min_1',
          title: 'Compare all-inclusive venue packages',
          category: 'Venue',
          phase: '9–12 months before',
          recommendedDate: '2026-03-20',
          priority: 'high',
        }),
        base({
          id: 'pers_min_2',
          title: 'Limit décor to three categories',
          category: 'Flowers',
          phase: '6–9 months before',
          recommendedDate: '2026-07-05',
          priority: 'medium',
        }),
        base({
          id: 'pers_min_3',
          title: 'Simplify day-of schedule',
          category: 'Planning',
          phase: '1–3 months before',
          recommendedDate: '2026-11-01',
          priority: 'high',
        }),
      ]
    case 'creative-storytellers':
      return [
        base({
          id: 'pers_cre_1',
          title: 'Define shared-story wedding theme',
          category: 'Planning',
          phase: '9–12 months before',
          recommendedDate: '2026-04-10',
          priority: 'high',
        }),
        base({
          id: 'pers_cre_2',
          title: 'Draft personalized vows outline',
          category: 'Planning',
          phase: '3–6 months before',
          recommendedDate: '2026-09-05',
          priority: 'medium',
        }),
        base({
          id: 'pers_cre_3',
          title: 'Design interactive guest moment',
          category: 'Experience',
          phase: '1–3 months before',
          recommendedDate: '2026-11-12',
          priority: 'medium',
        }),
      ]
  }
}

export function mergePersonalizedTasks(existing: PlanningTask[], archetype: CoupleArchetype) {
  const personalized = personalizedTasksForArchetype(archetype)
  const withoutOldPersonalized = existing.filter((task) => !task.personalizedFor)
  const ids = new Set(withoutOldPersonalized.map((task) => task.id))
  return [...withoutOldPersonalized, ...personalized.filter((task) => !ids.has(task.id))]
}

/** Priority-based allocation weights for the stock demo couple. */
export function priorityBudgetWeights(couple: CoupleProfile): Record<VendorCategory, number> {
  const base: Record<VendorCategory, number> = {
    Venue: 0.28,
    Catering: 0.24,
    Photography: 0.1,
    Flowers: 0.07,
    Fashion: 0.07,
    Music: 0.06,
    Stationery: 0.03,
    Transportation: 0.05,
    Miscellaneous: 0.1,
  }

  const boost = (name: VendorCategory, amount: number) => {
    base[name] = Math.max(0.02, base[name] + amount)
  }
  const cut = (name: VendorCategory, amount: number) => {
    base[name] = Math.max(0.015, base[name] - amount)
  }

  if (couple.priorities.includes('Photography') || couple.personality.secondaryTraits.includes('Photography obsessed')) {
    boost('Photography', 0.04)
  }
  if (couple.priorities.includes('Food') || couple.personality.secondaryTraits.includes('Food lovers')) {
    boost('Catering', 0.04)
  }
  if (couple.priorities.includes('Guest experience') || couple.personality.primaryArchetype === 'social-celebrators') {
    boost('Music', 0.02)
    boost('Miscellaneous', 0.02)
  }
  if (
    couple.personality.primaryArchetype === 'wild-adventurers' ||
    couple.personality.secondaryTraits.includes('Travel lovers')
  ) {
    boost('Transportation', 0.03)
    boost('Photography', 0.02)
  }

  for (const item of couple.personality.lowPriorityExpenses) {
    if (item === 'Flowers') cut('Flowers', 0.025)
    if (item === 'Stationery' || item === 'Wedding favors') cut('Stationery', 0.015)
    if (item === 'Formal transportation') cut('Transportation', 0.02)
    if (item === 'Elaborate décor') cut('Flowers', 0.015)
    if (item === 'Entertainment upgrades') cut('Music', 0.015)
    if (item === 'Luxury attire') cut('Fashion', 0.02)
  }

  if (couple.personality.primaryArchetype === 'budget-smart') {
    cut('Miscellaneous', 0.02)
    cut('Stationery', 0.01)
  }

  const total = Object.values(base).reduce((sum, value) => sum + value, 0)
  ;(Object.keys(base) as VendorCategory[]).forEach((key) => {
    base[key] = base[key] / total
  })
  return base
}

export function suggestPriorityBudget(
  categories: BudgetCategory[],
  couple: CoupleProfile,
  totalBudget: number,
): BudgetCategory[] {
  const weights = priorityBudgetWeights(couple)
  return categories.map((category) => ({
    ...category,
    allocated: Math.round(totalBudget * (weights[category.name] ?? 0.05)),
  }))
}

export function personalizeQuoteAnalysis(
  analysis: QuoteAnalysis,
  couple: CoupleProfile,
  category?: VendorCategory,
): QuoteAnalysis {
  const archetype = couple.personality.primaryArchetype
  const photoPriority =
    couple.priorities.includes('Photography') ||
    couple.personality.secondaryTraits.includes('Photography obsessed')
  const vendorLower = analysis.vendorName.toLowerCase()
  const isPhoto =
    category === 'Photography' ||
    vendorLower.includes('northlight') ||
    vendorLower.includes('softframe') ||
    vendorLower.includes('lumière') ||
    vendorLower.includes('lumiere') ||
    vendorLower.includes('photo')
  const above = analysis.percentAboveRange > 0

  if (!isPhoto) {
    const fitLevel: QuoteAnalysis['fitLevel'] = above ? 'Possible fit' : 'Strong fit'
    return {
      ...analysis,
      fitLevel,
      fitReason: `Evaluated against your ${archetypeLabel(archetype)} priorities for this ${category ?? 'vendor'} category.`,
      profileInfluences: [archetypeLabel(archetype), ...couple.priorities.slice(0, 2)],
    }
  }

  if (archetype === 'budget-smart' || couple.personality.spendingPhilosophy === 'Strictly stay under budget') {
    return {
      ...analysis,
      fitLevel: 'Weak fit',
      recommendation:
        'This package exceeds both your category target and the local demo benchmark. Request a smaller package or compare at least two alternatives before committing.',
      fitReason: 'Your Budget-Smart / strict value focus penalizes above-range photography packages.',
      profileInfluences: [archetypeLabel(archetype), couple.personality.spendingPhilosophy, 'Photography budget target'],
    }
  }

  if (photoPriority && (archetype === 'wild-adventurers' || couple.personality.spendingPhilosophy === 'Spend more on our top priorities')) {
    return {
      ...analysis,
      fitLevel: above ? 'Possible fit' : 'Strong fit',
      recommendation:
        'The quote is above the local demo benchmark, but photography is one of your top priorities. Because this package includes an engagement session and second photographer, it may still be a strong fit if the vendor removes the travel fee or adds an album.',
      fitReason: 'Photography is a top priority and your spending philosophy allows stretching for what matters.',
      profileInfluences: [
        archetypeLabel(archetype),
        'Photography priority',
        couple.personality.spendingPhilosophy,
        ...couple.personality.secondaryTraits.slice(0, 2),
      ],
    }
  }

  return {
    ...analysis,
    fitLevel: above ? 'Possible fit' : 'Strong fit',
    fitReason: `Balanced against your ${archetypeLabel(archetype)} profile.`,
    profileInfluences: [archetypeLabel(archetype), ...couple.priorities.slice(0, 2)],
  }
}

export function personalityEmailNote(couple: CoupleProfile) {
  return `Personalized for your ${archetypeLabel(couple.personality.primaryArchetype)} style.`
}

export function defaultMayaAlexPersonality(): CouplePersonality {
  return {
    primaryArchetype: 'wild-adventurers',
    secondaryTraits: ['Travel lovers', 'Food lovers'],
    weddingVibes: ['Wild outdoor adventure', 'Cozy and intimate'],
    guestMemoryPriorities: ['The scenery', 'The food', 'How connected everyone felt'],
    spendingPhilosophy: 'Spend more on our top priorities',
    lowPriorityExpenses: ['Wedding favors', 'Stationery', 'Formal transportation'],
  }
}
