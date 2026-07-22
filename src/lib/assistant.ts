import type { AppData, ChatMessage, ContextCard } from '@/types'
import { formatCurrency, createId } from '@/lib/utils'
import { getBudgetSummary } from '@/lib/budget'

function cardsForBudget(data: AppData): ContextCard[] {
  const summary = getBudgetSummary(data)
  return [
    {
      type: 'budget',
      title: 'Budget summary',
      body: `${formatCurrency(summary.remaining)} remaining · projected final spend ${formatCurrency(summary.projectedFinalSpend)}`,
    },
    {
      type: 'action',
      title: 'Recommended next action',
      body: 'Trim flowers or photography before adding entertainment.',
    },
  ]
}

export function answerAssistantPrompt(prompt: string, data: AppData): ChatMessage {
  const summary = getBudgetSummary(data)
  const normalized = prompt.toLowerCase()
  const couple = `${data.couple.partnerOneName} & ${data.couple.partnerTwoName}`
  let content = ''
  let contextCards: ContextCard[] = []

  if (normalized.includes('live band') || normalized.includes('afford')) {
    content = `You currently have ${formatCurrency(summary.remaining)} remaining, but your projected final spend is already ${formatCurrency(summary.overBy)} over budget. A Toronto wedding band may cost approximately $2,500–$5,000 in this demo. To add one without increasing your total budget, you would need to reduce spending in flowers, photography, or miscellaneous expenses.`
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
      'This month, prioritize reviewing photographer quotes, finalizing the guest list, sending the caterer follow-up, and ordering invitations. Photographer booking and invitation timing are currently your highest-risk items.'
    contextCards = [
      {
        type: 'action',
        title: 'Recommended next action',
        body: 'Complete “Review photographer quotes” and lock a vendor this week.',
      },
    ]
  } else if (normalized.includes('exceed') || normalized.includes('budget')) {
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
      {
        type: 'action',
        title: 'Recommended next action',
        body: 'Save this as a draft in the Emails page and send after your consultation.',
      },
    ]
  } else {
    content = `Based on ${couple}'s plan in ${data.wedding.city}, focus on booking photography, protecting the remaining ${formatCurrency(summary.remaining)}, and clearing invitation timing. Ask me about affordability, quote value, monthly priorities, budget risk, or vendor follow-ups. Demo benchmarks are estimates.`
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
  'Can we afford a live band?',
  'Which photographer quote offers the best value?',
  'What should we complete this month?',
  'Where are we most likely to exceed our budget?',
  'Draft a follow-up to our florist.',
]
