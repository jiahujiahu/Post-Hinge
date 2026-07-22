import type { AppData, CompletedItem, CoupleProfile, WeddingDetails } from '@/types'
import { scaleBudgetCategories } from '@/lib/budget'
import {
  mergePersonalizedTasks,
  archetypeLabel,
  suggestPriorityBudget,
} from '@/lib/personalization'

const COMPLETED_TASK_MAP: Partial<Record<CompletedItem, string[]>> = {
  'Venue booked': ['task_5'],
  'Guest list drafted': ['task_6'],
  'Photographer booked': ['task_1', 'task_8'],
  'Caterer booked': ['task_4', 'task_12'],
  'Invitations sent': ['task_9'],
  'Wedding attire selected': ['task_10'],
}

export function applyOnboardingToAppData(
  prev: AppData,
  couple: CoupleProfile,
  wedding: WeddingDetails,
): AppData {
  const completedTaskIds = new Set(
    couple.completedItems.flatMap((item) => COMPLETED_TASK_MAP[item] ?? []),
  )

  const baseTasks = prev.tasks
    .filter((task) => !task.personalizedFor)
    .map((task) => {
      if (!completedTaskIds.has(task.id)) {
        return {
          ...task,
          note: task.note || `Planned for ${wedding.guestCount} guests in ${wedding.city}.`,
        }
      }
      return {
        ...task,
        completed: true,
        status: 'completed' as const,
        note:
          task.note ||
          `Marked complete during onboarding for ${couple.partnerOneName} & ${couple.partnerTwoName}.`,
      }
    })

  const tasks = mergePersonalizedTasks(baseTasks, couple.personality.primaryArchetype).map((task) =>
    completedTaskIds.has(task.id)
      ? { ...task, completed: true, status: 'completed' as const }
      : task,
  )

  const vendors = prev.vendors.map((vendor) => {
    if (vendor.category === 'Venue' && couple.completedItems.includes('Venue booked')) {
      return { ...vendor, status: 'booked' as const, name: wedding.venueName || vendor.name }
    }
    if (vendor.category === 'Photography' && couple.completedItems.includes('Photographer booked')) {
      return { ...vendor, status: 'booked' as const }
    }
    if (vendor.category === 'Catering' && couple.completedItems.includes('Caterer booked')) {
      return { ...vendor, status: 'booked' as const }
    }
    if (vendor.category === 'Venue') {
      return { ...vendor, name: wedding.venueName || vendor.name }
    }
    return vendor
  })

  const archetype = archetypeLabel(couple.personality.primaryArchetype)
  const scaled = scaleBudgetCategories(prev.budgetCategories, wedding)
  const budgetCategories = suggestPriorityBudget(scaled, couple, wedding.totalBudget)

  return {
    ...prev,
    couple: {
      ...couple,
      partners: couple.partners.map((partner, index) => ({
        ...partner,
        name: index === 0 ? couple.partnerOneName : couple.partnerTwoName,
      })),
      onboardingComplete: true,
    },
    wedding,
    tasks,
    vendors,
    budgetCategories,
    chatMessages: [
      {
        id: 'chat_1',
        role: 'assistant',
        content: `Hi ${couple.partnerOneName} & ${couple.partnerTwoName} — I’m your AfterHinge planning copilot. I’ve saved your ${archetype} profile with vibes like ${couple.personality.weddingVibes.slice(0, 2).join(' and ')}. Ask me how to spend, what to skip, or how to make the day feel more like you.`,
        createdAt: new Date().toISOString(),
      },
    ],
  }
}
