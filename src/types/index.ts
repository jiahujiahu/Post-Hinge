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
  | 'Match our personality'

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

export type CoupleArchetype =
  | 'wild-adventurers'
  | 'budget-smart'
  | 'elegant-traditionalists'
  | 'relaxed-minimalists'
  | 'creative-storytellers'
  | 'social-celebrators'

export type AvatarType = 'illustration' | 'initials' | 'upload'

export type WeddingVibe =
  | 'Romantic garden'
  | 'Modern city'
  | 'Wild outdoor adventure'
  | 'Cozy and intimate'
  | 'Classic elegance'
  | 'Colorful celebration'
  | 'Beach escape'
  | 'Cultural fusion'
  | 'Minimal and modern'
  | 'Vintage storybook'

export type GuestMemoryPriority =
  | 'The food'
  | 'The party'
  | 'The scenery'
  | 'The ceremony'
  | 'The personal details'
  | 'How relaxed everything felt'
  | 'The cultural traditions'
  | 'How connected everyone felt'

export type SpendingPhilosophy =
  | 'Strictly stay under budget'
  | 'Save where guests will not notice'
  | 'Spend more on our top priorities'
  | 'We value convenience over the lowest price'
  | 'We are flexible for something truly special'

export type LowPriorityExpense =
  | 'Flowers'
  | 'Stationery'
  | 'Wedding favors'
  | 'Formal transportation'
  | 'Wedding cake'
  | 'Luxury attire'
  | 'Large bridal party'
  | 'Elaborate décor'
  | 'Videography'
  | 'Entertainment upgrades'

export type SecondaryTrait =
  | 'Food lovers'
  | 'Travel lovers'
  | 'Family first'
  | 'Eco-conscious'
  | 'Photography obsessed'
  | 'Dance-all-night'
  | 'Introvert-friendly'
  | 'Luxury seekers'
  | 'DIY lovers'
  | 'Cultural traditions'
  | 'Pet parents'
  | 'Sentimental'

export type FitLevel = 'Strong fit' | 'Possible fit' | 'Weak fit'

export interface PartnerProfile {
  id: string
  name: string
  avatarType: AvatarType
  avatarValue: string
  traits: string[]
  personalPriorities: string[]
}

export interface CouplePersonality {
  primaryArchetype: CoupleArchetype
  secondaryTraits: SecondaryTrait[]
  weddingVibes: WeddingVibe[]
  guestMemoryPriorities: GuestMemoryPriority[]
  spendingPhilosophy: SpendingPhilosophy
  lowPriorityExpenses: LowPriorityExpense[]
}

export interface PersonalizedInsight {
  id: string
  title: string
  description: string
  reason: string
  relatedArchetype?: CoupleArchetype
  actionLabel?: string
  actionTo?: string
}

export interface CoupleProfile {
  partnerOneName: string
  partnerTwoName: string
  partners: PartnerProfile[]
  personality: CouplePersonality
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
  category: VendorCategory | 'Planning' | 'Guests' | 'Attire' | 'Experience'
  phase: TimelinePhase
  recommendedDate: string
  status: TaskStatus
  priority: Priority
  note?: string
  completed: boolean
  dueDate?: string
  personalizedFor?: CoupleArchetype
  personalizedLabel?: string
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
  fitLevel?: FitLevel
  fitReason?: string
  profileInfluences?: string[]
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
  personalizedNote?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  contextCards?: ContextCard[]
}

export interface ContextCard {
  type: 'budget' | 'vendors' | 'action' | 'profile'
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
