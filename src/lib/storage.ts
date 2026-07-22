import { createDefaultAppData, STORAGE_KEY } from '@/data/mockData'
import type { AppData } from '@/types'

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const defaults = createDefaultAppData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }
    return { ...createDefaultAppData(), ...JSON.parse(raw) } as AppData
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
