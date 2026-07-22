import type { AppData, CompletedItem, CoupleProfile, WeddingDetails } from '@/types'
import { scaleBudgetCategories } from '@/lib/budget'

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

  const tasks = prev.tasks.map((task) => {
    if (!completedTaskIds.has(task.id)) {
      return {
        ...task,
        note:
          task.note ||
          `Planned for ${wedding.guestCount} guests in ${wedding.city}.`,
      }
    }
    return {
      ...task,
      completed: true,
      status: 'completed' as const,
      note: task.note || `Marked complete during onboarding for ${couple.partnerOneName} & ${couple.partnerTwoName}.`,
    }
  })

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

  return {
    ...prev,
    couple: { ...couple, onboardingComplete: true },
    wedding,
    tasks,
    vendors,
    budgetCategories: scaleBudgetCategories(prev.budgetCategories, wedding),
    chatMessages: [
      {
        id: 'chat_1',
        role: 'assistant',
        content: `Hi ${couple.partnerOneName} & ${couple.partnerTwoName} — I’m your AfterHinge planning copilot. Ask me about budget trade-offs, vendor value, or what to prioritize this month. Demo price benchmarks are estimates, not verified market data.`,
        createdAt: new Date().toISOString(),
      },
    ],
  }
}
