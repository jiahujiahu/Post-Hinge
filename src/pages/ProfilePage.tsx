import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type {
  CoupleArchetype,
  GuestMemoryPriority,
  LowPriorityExpense,
  PartnerProfile,
  PriorityOption,
  SecondaryTrait,
  SpendingPhilosophy,
  WeddingVibe,
} from '@/types'
import {
  ARCHETYPES,
  GUEST_MEMORY_OPTIONS,
  LOW_PRIORITY_EXPENSES,
  SECONDARY_TRAITS,
  SPENDING_PHILOSOPHIES,
  WEDDING_VIBES,
} from '@/data/personality'
import { useApp } from '@/hooks/useApp'
import { PageHeader } from '@/components/PageHeader'
import { AvatarPicker } from '@/components/AvatarPicker'
import { CoupleProfileHeader } from '@/components/CoupleProfileHeader'
import { PersonalizedInsightCard } from '@/components/PersonalizedInsightCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { buildPersonalizedInsights } from '@/lib/personalization'
import { cn } from '@/lib/utils'

const priorities: PriorityOption[] = [
  'Photography',
  'Food',
  'Venue',
  'Flowers',
  'Music',
  'Fashion',
  'Guest experience',
  'Staying under budget',
]

export function ProfilePage() {
  const { data, updatePersonalityProfile } = useApp()
  const [draftNames, setDraftNames] = useState({
    partnerOneName: data.couple.partnerOneName,
    partnerTwoName: data.couple.partnerTwoName,
  })
  const [partners, setPartners] = useState<PartnerProfile[]>(data.couple.partners)
  const [personality, setPersonality] = useState(data.couple.personality)
  const [topPriorities, setTopPriorities] = useState<PriorityOption[]>(data.couple.priorities)
  const insights = buildPersonalizedInsights(
    { ...data.couple, personality, priorities: topPriorities, partners },
    data.wedding,
  )

  useEffect(() => {
    setDraftNames({
      partnerOneName: data.couple.partnerOneName,
      partnerTwoName: data.couple.partnerTwoName,
    })
    setPartners(data.couple.partners)
    setPersonality(data.couple.personality)
    setTopPriorities(data.couple.priorities)
  }, [data.couple])

  const toggle = <T,>(list: T[], value: T, max?: number) => {
    if (list.includes(value)) return list.filter((item) => item !== value)
    if (max && list.length >= max) {
      toast.message(`Choose up to ${max}`)
      return list
    }
    return [...list, value]
  }

  const save = () => {
    updatePersonalityProfile({
      ...data.couple,
      partnerOneName: draftNames.partnerOneName,
      partnerTwoName: draftNames.partnerTwoName,
      partners: partners.map((partner, index) => ({
        ...partner,
        name: index === 0 ? draftNames.partnerOneName : draftNames.partnerTwoName,
      })),
      personality,
      priorities: topPriorities,
    })
    toast.success('Couple profile updated — recommendations refreshed')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Couple profile"
        subtitle="Edit your personalities, vibes, and spending style. AfterHinge updates recommendations instantly."
        actions={
          <Button onClick={save} className="w-full sm:w-auto">
            Save profile
          </Button>
        }
      />

      <CoupleProfileHeader
        couple={{
          ...data.couple,
          partnerOneName: draftNames.partnerOneName,
          partnerTwoName: draftNames.partnerTwoName,
          partners,
          personality,
          priorities: topPriorities,
        }}
        showEdit={false}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Partner cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-p1">Partner one</Label>
                <Input
                  id="profile-p1"
                  value={draftNames.partnerOneName}
                  onChange={(event) =>
                    setDraftNames((current) => ({ ...current, partnerOneName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-p2">Partner two</Label>
                <Input
                  id="profile-p2"
                  value={draftNames.partnerTwoName}
                  onChange={(event) =>
                    setDraftNames((current) => ({ ...current, partnerTwoName: event.target.value }))
                  }
                />
              </div>
            </div>
            {partners.map((partner, index) => (
              <div key={partner.id} className="rounded-2xl border border-border/80 bg-secondary/30 p-4">
                <AvatarPicker
                  name={index === 0 ? draftNames.partnerOneName : draftNames.partnerTwoName}
                  avatarType={partner.avatarType}
                  avatarValue={partner.avatarValue}
                  onChange={(next) =>
                    setPartners((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)),
                    )
                  }
                />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {partner.traits.map((trait) => (
                    <span key={trait} className="rounded-full bg-card px-2 py-0.5 text-xs font-semibold">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Archetype & traits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {ARCHETYPES.map((archetype) => (
                <button
                  key={archetype.id}
                  type="button"
                  aria-pressed={personality.primaryArchetype === archetype.id}
                  onClick={() =>
                    setPersonality((current) => ({
                      ...current,
                      primaryArchetype: archetype.id as CoupleArchetype,
                    }))
                  }
                  className={cn(
                    'rounded-xl border px-3 py-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    personality.primaryArchetype === archetype.id
                      ? 'border-burgundy bg-blush/40'
                      : 'border-border',
                  )}
                >
                  <span className="mr-2" aria-hidden="true">
                    {archetype.icon}
                  </span>
                  <span className="font-semibold">{archetype.name}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {SECONDARY_TRAITS.map((trait) => {
                const selected = personality.secondaryTraits.includes(trait)
                return (
                  <button
                    key={trait}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setPersonality((current) => ({
                        ...current,
                        secondaryTraits: toggle(current.secondaryTraits, trait as SecondaryTrait, 2),
                      }))
                    }
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-semibold',
                      selected ? 'border-burgundy bg-burgundy text-primary-foreground' : 'border-border',
                    )}
                  >
                    {trait}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Wedding vibes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {WEDDING_VIBES.map((vibe) => {
              const selected = personality.weddingVibes.includes(vibe.id)
              return (
                <button
                  key={vibe.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setPersonality((current) => ({
                      ...current,
                      weddingVibes: toggle(current.weddingVibes, vibe.id as WeddingVibe, 3),
                    }))
                  }
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold',
                    selected ? 'border-burgundy bg-blush/50' : 'border-border',
                  )}
                >
                  {vibe.id}
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Guest memories & priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {GUEST_MEMORY_OPTIONS.map((option) => {
                const selected = personality.guestMemoryPriorities.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setPersonality((current) => ({
                        ...current,
                        guestMemoryPriorities: toggle(
                          current.guestMemoryPriorities,
                          option as GuestMemoryPriority,
                          4,
                        ),
                      }))
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold',
                      selected ? 'border-burgundy bg-blush/50' : 'border-border',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => {
                const selected = topPriorities.includes(priority)
                return (
                  <button
                    key={priority}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTopPriorities((current) => toggle(current, priority, 3))}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold',
                      selected ? 'border-burgundy bg-burgundy text-primary-foreground' : 'border-border',
                    )}
                  >
                    {priority}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Spending philosophy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            {SPENDING_PHILOSOPHIES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={personality.spendingPhilosophy === option}
                onClick={() =>
                  setPersonality((current) => ({
                    ...current,
                    spendingPhilosophy: option as SpendingPhilosophy,
                  }))
                }
                className={cn(
                  'rounded-xl border px-3 py-3 text-left text-sm',
                  personality.spendingPhilosophy === option
                    ? 'border-burgundy bg-blush/40'
                    : 'border-border',
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Low-priority expenses</p>
            <div className="flex flex-wrap gap-2">
              {LOW_PRIORITY_EXPENSES.map((item) => {
                const selected = personality.lowPriorityExpenses.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setPersonality((current) => ({
                        ...current,
                        lowPriorityExpenses: toggle(
                          current.lowPriorityExpenses,
                          item as LowPriorityExpense,
                        ),
                      }))
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold',
                      selected ? 'border-burgundy bg-burgundy text-primary-foreground' : 'border-border',
                    )}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </div>
          <Button onClick={save}>Save and refresh recommendations</Button>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 font-display text-2xl font-semibold">Personalized recommendation preview</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((insight) => (
            <PersonalizedInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  )
}
