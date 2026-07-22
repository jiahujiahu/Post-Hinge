import type {
  CoupleArchetype,
  GuestMemoryPriority,
  LowPriorityExpense,
  SecondaryTrait,
  SpendingPhilosophy,
  WeddingVibe,
} from '@/types'

export const AVATAR_OPTIONS = [
  { id: 'avatar_aurora', label: 'Aurora', vibe: 'Warm & creative', colors: ['#C4787A', '#E8D5B7'] },
  { id: 'avatar_cedar', label: 'Cedar', vibe: 'Grounded & calm', colors: ['#5B7A5A', '#D7E0C5'] },
  { id: 'avatar_river', label: 'River', vibe: 'Curious explorer', colors: ['#4A6FA5', '#C9D8EE'] },
  { id: 'avatar_ember', label: 'Ember', vibe: 'Bold & social', colors: ['#B85C38', '#F0D0B8'] },
  { id: 'avatar_lilac', label: 'Lilac', vibe: 'Soft romantic', colors: ['#8B6B9E', '#E8D7F0'] },
  { id: 'avatar_sable', label: 'Sable', vibe: 'Classic polish', colors: ['#4A3530', '#E8D5B7'] },
  { id: 'avatar_moss', label: 'Moss', vibe: 'Outdoor spirit', colors: ['#6B7F4A', '#E2E8C8'] },
  { id: 'avatar_coral', label: 'Coral', vibe: 'Joyful celebrator', colors: ['#D46A6A', '#FADBD8'] },
  { id: 'avatar_ink', label: 'Ink', vibe: 'Storyteller', colors: ['#3D4A5C', '#D5DCE6'] },
  { id: 'avatar_honey', label: 'Honey', vibe: 'Warm host', colors: ['#C49A3C', '#F5E6C0'] },
] as const

export type AvatarOptionId = (typeof AVATAR_OPTIONS)[number]['id']

export interface ArchetypeDefinition {
  id: CoupleArchetype
  name: string
  description: string
  tags: string[]
  traits: string[]
  recommendation: string
  icon: string
  accent: string
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: 'wild-adventurers',
    name: 'Wild Adventurers',
    description: 'You would rather spend money on unforgettable experiences than perfect table settings.',
    tags: ['Travel', 'Outdoor', 'Experiences'],
    traits: [
      'Loves travel',
      'Outdoor or destination wedding',
      'Less traditional',
      'Values memorable experiences',
      'Comfortable breaking wedding conventions',
    ],
    recommendation:
      'Consider a destination ceremony, outdoor venue, adventure photography session, or experience-focused guest itinerary.',
    icon: '🏔️',
    accent: 'from-[#7A3040] to-[#C4787A]',
  },
  {
    id: 'budget-smart',
    name: 'Joyful and Budget-Smart',
    description:
      'You want a beautiful and meaningful wedding without spending money just because tradition says you should.',
    tags: ['Practical', 'Value', 'DIY-friendly'],
    traits: ['Practical', 'Positive', 'Cost-conscious', 'Enjoys DIY options', 'Wants strong value for money'],
    recommendation:
      'Prioritize the three categories that matter most, use digital invitations, compare vendor packages, and avoid low-impact extras.',
    icon: '🌿',
    accent: 'from-[#5B7A5A] to-[#C4787A]',
  },
  {
    id: 'elegant-traditionalists',
    name: 'Elegant Traditionalists',
    description: 'You love timeless details, meaningful traditions, and a polished guest experience.',
    tags: ['Classic', 'Formal', 'Etiquette'],
    traits: ['Formal', 'Classic', 'Family-oriented', 'Detail-conscious', 'Values tradition and etiquette'],
    recommendation:
      'Prioritize venue service, formal invitations, ceremony traditions, seating etiquette, and a refined timeline.',
    icon: '🥂',
    accent: 'from-[#4A3530] to-[#E8D5B7]',
  },
  {
    id: 'relaxed-minimalists',
    name: 'Relaxed Minimalists',
    description: 'You want the day to feel easy, intimate, and free from unnecessary complexity.',
    tags: ['Calm', 'Intimate', 'Simple'],
    traits: ['Calm', 'Low-stress', 'Small guest list', 'Simple aesthetic', 'Fewer vendors and decisions'],
    recommendation:
      'Choose an all-inclusive venue, limit décor categories, simplify the schedule, and keep the guest experience comfortable.',
    icon: '☁️',
    accent: 'from-[#6F5C55] to-[#F0D6D4]',
  },
  {
    id: 'creative-storytellers',
    name: 'Creative Storytellers',
    description: 'You want the wedding to feel unmistakably yours, with personal details guests will remember.',
    tags: ['Artistic', 'Personal', 'Custom'],
    traits: ['Artistic', 'Personalized', 'Nontraditional', 'Values storytelling', 'Interested in custom details'],
    recommendation:
      'Create a wedding theme based on your shared story, personalized vows, custom stationery, and interactive guest moments.',
    icon: '✨',
    accent: 'from-[#8B6B9E] to-[#E8D5B7]',
  },
  {
    id: 'social-celebrators',
    name: 'Social Celebrators',
    description: 'You want a lively party where everyone feels involved and has an amazing time.',
    tags: ['Party', 'Music', 'Guests'],
    traits: ['Energetic', 'Guest-focused', 'Loves music and dancing', 'Values food and entertainment', 'Large social circle'],
    recommendation:
      'Prioritize entertainment, food, late-night snacks, an efficient bar plan, and a dance-friendly venue.',
    icon: '🎉',
    accent: 'from-[#B85C38] to-[#C4787A]',
  },
]

export const SECONDARY_TRAITS: SecondaryTrait[] = [
  'Food lovers',
  'Travel lovers',
  'Family first',
  'Eco-conscious',
  'Photography obsessed',
  'Dance-all-night',
  'Introvert-friendly',
  'Luxury seekers',
  'DIY lovers',
  'Cultural traditions',
  'Pet parents',
  'Sentimental',
]

export const WEDDING_VIBES: { id: WeddingVibe; caption: string; gradient: string }[] = [
  { id: 'Romantic garden', caption: 'Soft blooms & golden light', gradient: 'from-[#F0D6D4] to-[#E8D5B7]' },
  { id: 'Modern city', caption: 'Skyline edges & clean lines', gradient: 'from-[#D5DCE6] to-[#F3E6DF]' },
  { id: 'Wild outdoor adventure', caption: 'Trails, views & open air', gradient: 'from-[#D7E0C5] to-[#E8D5B7]' },
  { id: 'Cozy and intimate', caption: 'Warm rooms & close tables', gradient: 'from-[#F5E6C0] to-[#F0D6D4]' },
  { id: 'Classic elegance', caption: 'Timeless polish & tradition', gradient: 'from-[#E8D5B7] to-[#F3E6DF]' },
  { id: 'Colorful celebration', caption: 'Bold joy & lively energy', gradient: 'from-[#FADBD8] to-[#E8D5B7]' },
  { id: 'Beach escape', caption: 'Salt air & easy evenings', gradient: 'from-[#C9D8EE] to-[#E8D5B7]' },
  { id: 'Cultural fusion', caption: 'Heritage shared with love', gradient: 'from-[#E8D7F0] to-[#F0D6D4]' },
  { id: 'Minimal and modern', caption: 'Quiet forms & space to breathe', gradient: 'from-[#F3E6DF] to-[#D5DCE6]' },
  { id: 'Vintage storybook', caption: 'Nostalgia with a soft glow', gradient: 'from-[#E8D5B7] to-[#F0D6D4]' },
]

export const GUEST_MEMORY_OPTIONS: GuestMemoryPriority[] = [
  'The food',
  'The party',
  'The scenery',
  'The ceremony',
  'The personal details',
  'How relaxed everything felt',
  'The cultural traditions',
  'How connected everyone felt',
]

export const SPENDING_PHILOSOPHIES: SpendingPhilosophy[] = [
  'Strictly stay under budget',
  'Save where guests will not notice',
  'Spend more on our top priorities',
  'We value convenience over the lowest price',
  'We are flexible for something truly special',
]

export const LOW_PRIORITY_EXPENSES: LowPriorityExpense[] = [
  'Flowers',
  'Stationery',
  'Wedding favors',
  'Formal transportation',
  'Wedding cake',
  'Luxury attire',
  'Large bridal party',
  'Elaborate décor',
  'Videography',
  'Entertainment upgrades',
]

export function getArchetype(id: CoupleArchetype) {
  return ARCHETYPES.find((item) => item.id === id) ?? ARCHETYPES[0]
}
