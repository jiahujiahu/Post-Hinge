import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { BudgetCategory, BudgetStatus, Priority, RiskLevel, TaskStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'CAD') {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string) {
  try {
    return format(parseISO(date), 'MMM d, yyyy')
  } catch {
    return date
  }
}

export function daysUntil(date: string) {
  return differenceInCalendarDays(parseISO(date), new Date())
}

export function greetingForNow() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function createId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function percentUsed(spent: number, allocated: number) {
  if (allocated <= 0) return 0
  return Math.round((spent / allocated) * 100)
}

export function categoryStatus(spent: number, committed: number, allocated: number): BudgetStatus {
  const used = spent + committed
  if (used > allocated) return 'over'
  if (used >= allocated * 0.85) return 'watch'
  return 'on_track'
}

export function deriveBudgetCategories(categories: BudgetCategory[]): BudgetCategory[] {
  return categories.map((category) => ({
    ...category,
    status: categoryStatus(category.spent, category.committed, category.allocated),
  }))
}

export function statusLabel(status: TaskStatus) {
  switch (status) {
    case 'at_risk':
      return 'At risk'
    case 'in_progress':
      return 'In progress'
    case 'completed':
      return 'Completed'
    default:
      return 'Upcoming'
  }
}

export function priorityLabel(priority: Priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

export function riskLabel(risk: RiskLevel) {
  switch (risk) {
    case 'medium-high':
      return 'Medium-high'
    default:
      return risk.charAt(0).toUpperCase() + risk.slice(1)
  }
}

export function riskStyles(risk: RiskLevel) {
  switch (risk) {
    case 'low':
      return 'bg-success/10 text-success'
    case 'medium':
      return 'bg-warning/15 text-warning'
    case 'medium-high':
      return 'bg-rose/20 text-burgundy'
    case 'high':
      return 'bg-destructive/10 text-destructive'
  }
}
