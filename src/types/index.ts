export type Priority = 'low' | 'medium' | 'high'
export type TaskStatus = 'upcoming' | 'in_progress' | 'completed' | 'at_risk'
export type TimelinePhase =
  | '12+ months before'
  | '9–12 months before'
  | '6–9 months before'
  | '3–6 months before'
  | '1–3 months before'
  | 'Final month'
  | 'Wedding week'

export type VendorCategory =
  | 'Photography'
  | 'Catering'
  | 'Venue'
  | 'Flowers'
  | 'Music'
  | 'Fashion'
  | 'Stationery'
  | 'Transportation'
  | 'Miscellaneous'

export type BudgetStatus = 'on_track' | 'watch' | 'over'
export type RiskLevel = 'low' | 'medium' | 'medium-high' | 'high'
export type EmailPurpose =
  | 'Initial inquiry'
  | 'Follow-up'
  | 'Quote negotiation'
  | 'Decline vendor'
  | 'Confirm booking'
  | 'Request contract clarification'

export type EmailTone =
  | 'Warm and friendly'
  | 'Professional'
  | 'Concise'
  | 'Firm but polite'

export type PriorityOption =
  | 'Photography'
  | 'Food'
  | 'Venue'
  | 'Flowers'
  | 'Music'
  | 'Fashion'
  | 'Guest experience'
  | 'Staying under budget'

export type CompletedItem =
  | 'Venue booked'
  | 'Photographer booked'
  | 'Caterer booked'
  | 'Guest list drafted'
  | 'Invitations sent'
  | 'Wedding attire selected'

export interface CoupleProfile {
  partnerOneName: string
  partnerTwoName: string
  priorities: PriorityOption[]
  completedItems: CompletedItem[]
  onboardingComplete: boolean
}

export interface WeddingDetails {
  weddingDate: string
  city: string
  venueName: string
  guestCount: number
  totalBudget: number
  currency: string
  amountSpent: number
}

export interface PlanningTask {
  id: string
  title: string
  category: VendorCategory | 'Planning' | 'Guests' | 'Attire'
  phase: TimelinePhase
  recommendedDate: string
  status: TaskStatus
  priority: Priority
  note?: string
  completed: boolean
  dueDate?: string
}

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  contactName?: string
  status: 'researching' | 'quoted' | 'selected' | 'booked'
}

export interface VendorQuote {
  id: string
  vendorId: string
  vendorName: string
  category: VendorCategory
  price: number
  currency: string
  hours?: number
  secondShooter?: boolean
  engagementSession?: boolean
  album?: boolean
  notes?: string
  fileName?: string
  risk: RiskLevel
  aiRecommendation: string
  isBestValue?: boolean
  selected?: boolean
  createdAt: string
}

export interface QuoteAnalysis {
  id: string
  quoteId: string
  vendorName: string
  quotedPrice: number
  currency: string
  estimatedRange: { min: number; max: number }
  riskLevel: RiskLevel
  included: string[]
  concerns: string[]
  recommendation: string
  percentAboveRange: number
}

export interface BudgetCategory {
  id: string
  name: VendorCategory
  allocated: number
  spent: number
  committed: number
  status: BudgetStatus
}

export interface Expense {
  id: string
  category: VendorCategory
  description: string
  amount: number
  date: string
  vendorName?: string
  type: 'spent' | 'committed'
}

export interface EmailDraft {
  id: string
  vendorType: VendorCategory
  vendorName: string
  purpose: EmailPurpose
  tone: EmailTone
  subject: string
  body: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  contextCards?: ContextCard[]
}

export interface ContextCard {
  type: 'budget' | 'vendors' | 'action'
  title: string
  body: string
}

export interface AppData {
  couple: CoupleProfile
  wedding: WeddingDetails
  tasks: PlanningTask[]
  vendors: Vendor[]
  quotes: VendorQuote[]
  analyses: QuoteAnalysis[]
  budgetCategories: BudgetCategory[]
  expenses: Expense[]
  emailDrafts: EmailDraft[]
  chatMessages: ChatMessage[]
  selectedQuoteIds: string[]
}

export interface BudgetSummary {
  totalBudget: number
  spent: number
  committed: number
  remaining: number
  projectedFinalSpend: number
  overBy: number
}
