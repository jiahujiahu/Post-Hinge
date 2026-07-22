import { addDays, formatISO, subMonths } from 'date-fns'
import type { AppData, PlanningTask } from '@/types'

export function regenerateTimeline(data: AppData): PlanningTask[] {
  const wedding = new Date(data.wedding.weddingDate)
  if (Number.isNaN(wedding.getTime())) return data.tasks

  const phaseAnchors: Record<PlanningTask['phase'], Date> = {
    '12+ months before': subMonths(wedding, 13),
    '9–12 months before': subMonths(wedding, 10),
    '6–9 months before': subMonths(wedding, 7),
    '3–6 months before': subMonths(wedding, 4),
    '1–3 months before': subMonths(wedding, 2),
    'Final month': subMonths(wedding, 1),
    'Wedding week': addDays(wedding, -5),
  }

  return data.tasks.map((task, index) => {
    const anchor = phaseAnchors[task.phase]
    const recommendedDate = formatISO(addDays(anchor, (index % 5) * 3), { representation: 'date' })
    const dueDate = task.dueDate ? recommendedDate : task.dueDate

    if (task.completed) {
      return {
        ...task,
        recommendedDate,
        note: `Kept complete · synced to ${data.wedding.weddingDate} for ${data.wedding.guestCount} guests.`,
      }
    }

    const atRisk =
      task.priority === 'high' &&
      ['Photography', 'Stationery', 'Flowers'].includes(task.category)

    return {
      ...task,
      recommendedDate,
      dueDate: dueDate || recommendedDate,
      status: atRisk ? 'at_risk' : task.status === 'completed' ? 'upcoming' : task.status,
      note: `Updated for ${data.wedding.city} · ${data.wedding.guestCount} guests · ${data.couple.priorities.slice(0, 2).join(' & ') || 'balanced priorities'}.`,
    }
  })
}
