import type { AppData, ChatMessage, ContextCard } from '@/types'
import { formatCurrency, createId } from '@/lib/utils'
import { getBudgetSummary } from '@/lib/budget'
import { archetypeLabel } from '@/lib/personalization'

function cardsForBudget(data: AppData): ContextCard[] {
  const summary = getBudgetSummary(data)
  return [
    {
      type: 'budget',
      title: 'Budget summary',
      body: `${formatCurrency(summary.remaining)} remaining · projected final spend ${formatCurrency(summary.projectedFinalSpend)}`,
    },
    {
      type: 'profile',
      title: 'Your profile',
      body: `${archetypeLabel(data.couple.personality.primaryArchetype)} · ${data.couple.personality.secondaryTraits.join(', ') || 'no secondary traits'}`,
    },
  ]
}

export function answerAssistantPrompt(prompt: string, data: AppData): ChatMessage {
  const summary = getBudgetSummary(data)
  const normalized = prompt.toLowerCase()
  const couple = `${data.couple.partnerOneName} & ${data.couple.partnerTwoName}`
  const personality = data.couple.personality
  const archetype = archetypeLabel(personality.primaryArchetype)
  const priorities = data.couple.priorities.join(', ').toLowerCase()
  const low = personality.lowPriorityExpenses.join(', ').toLowerCase()
  const vibes = personality.weddingVibes.join(' and ')
  let content = ''
  let contextCards: ContextCard[] = []

  const asksAffordability =
    normalized.includes('live band') ||
    normalized.includes('afford') ||
    /\bband\b/.test(normalized) ||
    normalized.includes('musician') ||
    (normalized.includes('music') && normalized.includes('budget'))

  if (
    normalized.includes('more like us') ||
    normalized.includes('match our personality') ||
    normalized.includes('feel more like') ||
    normalized.includes('wedding ideas match')
  ) {
    content = `You selected ${archetype} with a focus on ${priorities}${personality.secondaryTraits.length ? ` plus ${personality.secondaryTraits.join(' and ').toLowerCase()}` : ''}. Consider replacing traditional favors with a local experience guide, choosing a scenic ceremony location, serving food connected to places you have traveled together, and scheduling a short sunset photography adventure. Since ${low || 'low-priority extras'} ${personality.lowPriorityExpenses.length === 1 ? 'is' : 'are'} less important to you, you could redirect that budget toward one of these experiences.`
    contextCards = [
      {
        type: 'profile',
        title: 'Profile signals',
        body: `${archetype} · vibes: ${vibes} · spend style: ${personality.spendingPhilosophy}`,
      },
      {
        type: 'action',
        title: 'Recommended next action',
        body: 'Open Couple Profile to tweak vibes, then rebalance the budget around priorities.',
      },
    ]
  } else if (normalized.includes('spend more') || normalized.includes('where should we spend')) {
    content = `Based on your ${archetype} profile and top priorities (${priorities}), spend more on photography, food/catering, and guest experience. Your spending philosophy—“${personality.spendingPhilosophy}”—supports protecting those categories even if they run above a generic checklist allocation.`
    contextCards = cardsForBudget(data)
  } else if (normalized.includes('skip') || normalized.includes('traditions')) {
    content = `You marked ${low || 'a few categories'} as low priority. Those are the first traditions to simplify. For ${archetype} couples, skipping elaborate stationery, wedding favors, and formal transportation often frees $800–$1,500 without hurting the guest experience you care about.`
    contextCards = [
      {
        type: 'profile',
        title: 'Low-priority expenses',
        body: personality.lowPriorityExpenses.join(' · ') || 'None selected yet',
      },
      ...cardsForBudget(data),
    ]
  } else if (normalized.includes('adventurous') || normalized.includes('adventure')) {
    content = `To make the wedding feel more adventurous, lean into your ${vibes || 'Wild outdoor adventure'} vibe: outdoor or destination ceremony options, an adventure portrait session, a guest travel mini-guide, and food inspired by places you’ve explored together. Keep weather backup planning on the timeline.`
    contextCards = [
      {
        type: 'action',
        title: 'Recommended next action',
        body: `Check the personalized ${archetype} tasks on your timeline.`,
      },
    ]
  } else if (normalized.includes('vendor fits') || normalized.includes('priorities best')) {
    content =
      personality.primaryArchetype === 'budget-smart'
        ? 'Softframe Co. currently fits best: closer to your photography target with strong inclusions. Northlight is harder to justify on a Budget-Smart profile unless fees drop.'
        : `Because photography is a top priority for your ${archetype} / priority-led plan, Northlight can still be a possible fit if travel fees are waived—while Softframe remains the strongest overall value benchmark in this demo.`
    contextCards = [
      {
        type: 'vendors',
        title: 'Related vendors',
        body: 'Softframe Co. · best value · $3,400 CAD',
      },
    ]
  } else if (normalized.includes('guests feel included') || normalized.includes('included')) {
    content = `Guest memory priorities you selected: ${personality.guestMemoryPriorities.join(', ').toLowerCase() || 'not set yet'}. Make inclusion concrete with shared food moments, a scenic gathering point, and a short experience guide so out-of-town guests feel part of your story—not just the ceremony.`
    contextCards = [
      {
        type: 'profile',
        title: 'Guest memories',
        body: personality.guestMemoryPriorities.join(' · ') || 'Add these on your Couple Profile',
      },
    ]
  } else if (asksAffordability) {
    content = `You currently have ${formatCurrency(summary.remaining)} remaining, but your projected final spend is already ${formatCurrency(summary.overBy)} over budget. A Toronto wedding band may cost approximately $2,500–$5,000 in this demo. Given your ${archetype} focus on ${priorities}, adding a band means cutting ${low || 'low-priority décor or stationery'} first—not photography or food.`
    contextCards = [
      ...cardsForBudget(data),
      {
        type: 'vendors',
        title: 'Related vendors',
        body: 'Music category is still open — compare DJ packages before committing to a live band.',
      },
    ]
  } else if (normalized.includes('photographer') || normalized.includes('best value')) {
    content =
      'Softframe Co. currently offers the best overall value among your photographer quotes. At $3,400 CAD it includes eight hours, a second shooter, and an album—closer to your $3,600 photography budget than Northlight, while providing more coverage than Lumière Studio. Demo local benchmarks are estimates, not verified market data.'
    contextCards = [
      {
        type: 'vendors',
        title: 'Related vendors',
        body: 'Softframe Co. · best value · $3,400 CAD',
      },
      {
        type: 'action',
        title: 'Recommended next action',
        body: 'Generate a negotiation email for Northlight or mark Softframe as selected.',
      },
    ]
  } else if (normalized.includes('this month') || normalized.includes('complete')) {
    content =
      'This month, prioritize reviewing photographer quotes, finalizing the guest list, sending the caterer follow-up, and ordering invitations. Photographer booking and invitation timing are currently your highest-risk items. Your personalized timeline also includes archetype-specific tasks.'
    contextCards = [
      {
        type: 'action',
        title: 'Recommended next action',
        body: 'Complete “Review photographer quotes” and lock a vendor this week.',
      },
    ]
  } else if (normalized.includes('exceed') || (normalized.includes('budget') && !normalized.includes('spend more'))) {
    content = `You are most likely to exceed budget in Miscellaneous (already over), Flowers (quoted above allocation), and Photography if you accept the Northlight package without negotiation. At the current pace, AfterHinge projects a final spend of ${formatCurrency(summary.projectedFinalSpend)} against a ${formatCurrency(summary.totalBudget)} budget.`
    contextCards = cardsForBudget(data)
  } else if (normalized.includes('florist') || normalized.includes('follow-up') || normalized.includes('draft')) {
    content = `Here is a concise follow-up you can send:\n\nHi Elena,\n\nThank you again for the Bloom & Stem proposal. Before we decide, could you share a scaled package closer to our floral budget of about $3,500 CAD while preserving the ceremony arch?\n\nWarmly,\n${couple}`
    contextCards = [
      {
        type: 'vendors',
        title: 'Related vendors',
        body: 'Bloom & Stem floral quote is currently above category budget.',
      },
    ]
  } else {
    content = `Based on ${couple}'s ${archetype} plan in ${data.wedding.city}, focus on ${priorities}, protect the remaining ${formatCurrency(summary.remaining)}, and skip ${low || 'low-impact extras'}. Ask me about personality-fit ideas, spending, traditions to skip, or vendor fit. Demo benchmarks are estimates.`
    contextCards = cardsForBudget(data)
  }

  return {
    id: createId('chat'),
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
    contextCards,
  }
}

export const SUGGESTED_PROMPTS = [
  'What wedding ideas match our personality?',
  'Where should we spend more?',
  'What traditions can we skip?',
  'How can we make the wedding feel more adventurous?',
  'Which vendor fits our priorities best?',
  'How can we make guests feel included?',
  'Can we afford a live band?',
  'How can we make the wedding feel more like us?',
]
