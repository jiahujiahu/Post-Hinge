import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import type {
  CompletedItem,
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
import { defaultMayaAlexPersonality } from '@/lib/personalization'
import { useApp } from '@/hooks/useApp'
import { AvatarPicker } from '@/components/AvatarPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const completedOptions: CompletedItem[] = [
  'Venue booked',
  'Photographer booked',
  'Caterer booked',
  'Guest list drafted',
  'Invitations sent',
  'Wedding attire selected',
]

const schema = z.object({
  partnerOneName: z.string().min(1, 'Partner one name is required'),
  partnerTwoName: z.string().min(1, 'Partner two name is required'),
  weddingDate: z.string().min(1, 'Wedding date is required'),
  city: z.string().min(1, 'City is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  guestCount: z.number().min(2, 'Guest count must be at least 2'),
  totalBudget: z.number().min(1000, 'Budget must be at least 1,000'),
  currency: z.string().min(1, 'Currency is required'),
  amountSpent: z.number().min(0, 'Amount spent cannot be negative'),
  priorities: z.array(z.string()).min(1, 'Choose at least one priority').max(3, 'Choose up to three priorities'),
  completedItems: z.array(z.string()),
})

type FormValues = z.infer<typeof schema>

const steps = [
  'Couple',
  'Wedding',
  'Budget',
  'Personality',
  'Vibe',
  'Spending',
  'Priorities',
  'Status',
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const defaults = defaultMayaAlexPersonality()

  const [partners, setPartners] = useState<PartnerProfile[]>([
    {
      id: 'partner_one',
      name: 'Maya',
      avatarType: 'illustration',
      avatarValue: 'avatar_aurora',
      traits: ['Curious', 'Warm', 'Experience-led'],
      personalPriorities: ['Photography', 'Travel moments'],
    },
    {
      id: 'partner_two',
      name: 'Alex',
      avatarType: 'illustration',
      avatarValue: 'avatar_river',
      traits: ['Adventurous', 'Food-focused', 'Practical romantic'],
      personalPriorities: ['Food', 'Outdoor ceremony'],
    },
  ])
  const [primaryArchetype, setPrimaryArchetype] = useState<CoupleArchetype>(defaults.primaryArchetype)
  const [secondaryTraits, setSecondaryTraits] = useState<SecondaryTrait[]>(defaults.secondaryTraits)
  const [weddingVibes, setWeddingVibes] = useState<WeddingVibe[]>(defaults.weddingVibes)
  const [guestMemoryPriorities, setGuestMemoryPriorities] = useState<GuestMemoryPriority[]>(
    defaults.guestMemoryPriorities,
  )
  const [spendingPhilosophy, setSpendingPhilosophy] = useState<SpendingPhilosophy>(
    defaults.spendingPhilosophy,
  )
  const [lowPriorityExpenses, setLowPriorityExpenses] = useState<LowPriorityExpense[]>(
    defaults.lowPriorityExpenses,
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      partnerOneName: 'Maya',
      partnerTwoName: 'Alex',
      weddingDate: '2027-01-22',
      city: 'Toronto',
      venueName: 'The Glasshouse Conservatory',
      guestCount: 120,
      totalBudget: 40000,
      currency: 'CAD',
      amountSpent: 18750,
      priorities: ['Photography', 'Food', 'Guest experience'],
      completedItems: ['Venue booked', 'Guest list drafted'],
    },
    mode: 'onChange',
  })

  const values = form.watch()

  const validateStep = async () => {
    if (step === 3) {
      if (!primaryArchetype) {
        toast.error('Choose a couple archetype')
        return false
      }
      if (secondaryTraits.length > 2) {
        toast.error('Choose up to two secondary traits')
        return false
      }
      return true
    }
    if (step === 4) {
      if (weddingVibes.length < 1 || weddingVibes.length > 3) {
        toast.error('Choose 1–3 wedding vibes')
        return false
      }
      if (guestMemoryPriorities.length < 1) {
        toast.error('Choose what guests should remember')
        return false
      }
      return true
    }
    if (step === 5) {
      if (!spendingPhilosophy) {
        toast.error('Choose a spending philosophy')
        return false
      }
      return true
    }

    const fieldsByStep: (keyof FormValues)[][] = [
      ['partnerOneName', 'partnerTwoName'],
      ['weddingDate', 'city', 'venueName', 'guestCount'],
      ['totalBudget', 'currency', 'amountSpent'],
      [],
      [],
      [],
      ['priorities'],
      ['completedItems'],
    ]
    return form.trigger(fieldsByStep[step])
  }

  const onSubmit = form.handleSubmit((data) => {
    completeOnboarding(
      {
        partnerOneName: data.partnerOneName,
        partnerTwoName: data.partnerTwoName,
        partners: partners.map((partner, index) => ({
          ...partner,
          name: index === 0 ? data.partnerOneName : data.partnerTwoName,
        })),
        personality: {
          primaryArchetype,
          secondaryTraits,
          weddingVibes,
          guestMemoryPriorities,
          spendingPhilosophy,
          lowPriorityExpenses,
        },
        priorities: data.priorities as PriorityOption[],
        completedItems: data.completedItems as CompletedItem[],
        onboardingComplete: true,
      },
      {
        weddingDate: data.weddingDate,
        city: data.city,
        venueName: data.venueName,
        guestCount: data.guestCount,
        totalBudget: data.totalBudget,
        currency: data.currency,
        amountSpent: data.amountSpent,
      },
    )
    toast.success('Your personalized wedding profile is ready')
    navigate('/dashboard')
  })

  const toggleInList = <T,>(list: T[], value: T, max?: number) => {
    if (list.includes(value)) return list.filter((item) => item !== value)
    if (max && list.length >= max) {
      toast.message(`Choose up to ${max}`)
      return list
    }
    return [...list, value]
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft /> Back
            </Link>
          </Button>
          <p className="font-display text-2xl font-semibold text-burgundy">AfterHinge</p>
        </div>

        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">
              Let’s make this wedding feel like you
            </p>
            <CardTitle className="text-3xl">Set up your wedding</CardTitle>
            <p className="text-sm text-muted-foreground">
              Step {step + 1} of {steps.length}: {steps[step]}
            </p>
            <Progress
              value={((step + 1) / steps.length) * 100}
              className="mt-3"
              aria-label={`Onboarding progress, step ${step + 1} of ${steps.length}`}
            />
          </CardHeader>
          <CardContent>
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault()
                if (step < steps.length - 1) return
                void onSubmit()
              }}
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="partnerOneName">Partner one name</Label>
                      <Input
                        id="partnerOneName"
                        {...form.register('partnerOneName', {
                          onChange: (event) => {
                            const name = event.target.value
                            setPartners((current) =>
                              current.map((partner, index) =>
                                index === 0 ? { ...partner, name } : partner,
                              ),
                            )
                          },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partnerTwoName">Partner two name</Label>
                      <Input
                        id="partnerTwoName"
                        {...form.register('partnerTwoName', {
                          onChange: (event) => {
                            const name = event.target.value
                            setPartners((current) =>
                              current.map((partner, index) =>
                                index === 1 ? { ...partner, name } : partner,
                              ),
                            )
                          },
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {partners.map((partner, index) => (
                      <div key={partner.id} className="rounded-2xl border border-border/80 bg-secondary/30 p-4">
                        <AvatarPicker
                          name={index === 0 ? values.partnerOneName || partner.name : values.partnerTwoName || partner.name}
                          avatarType={partner.avatarType}
                          avatarValue={partner.avatarValue}
                          onChange={(next) =>
                            setPartners((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, ...next } : item,
                              ),
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="weddingDate">Wedding date</Label>
                    <Input id="weddingDate" type="date" {...form.register('weddingDate')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...form.register('city')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueName">Venue name</Label>
                    <Input id="venueName" {...form.register('venueName')} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="guestCount">Guest count</Label>
                    <Input id="guestCount" type="number" {...form.register('guestCount', { valueAsNumber: true })} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="totalBudget">Total budget</Label>
                    <Input id="totalBudget" type="number" {...form.register('totalBudget', { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={values.currency}
                      onValueChange={(value) => form.setValue('currency', value, { shouldValidate: true })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="amountSpent">Current amount spent</Label>
                    <Input id="amountSpent" type="number" {...form.register('amountSpent', { valueAsNumber: true })} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">What kind of couple are you?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Choose one primary archetype. This shapes your recommendations.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {ARCHETYPES.map((archetype) => {
                      const selected = primaryArchetype === archetype.id
                      return (
                        <button
                          key={archetype.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setPrimaryArchetype(archetype.id)}
                          className={cn(
                            'rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected
                              ? 'border-burgundy bg-blush/40 shadow-card'
                              : 'border-border bg-card hover:bg-secondary/60',
                          )}
                        >
                          <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl text-primary-foreground', archetype.accent)}>
                            <span aria-hidden="true">{archetype.icon}</span>
                          </div>
                          <p className="font-display text-xl font-semibold">{archetype.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{archetype.description}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {archetype.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Secondary traits (up to two)</p>
                    <div className="flex flex-wrap gap-2">
                      {SECONDARY_TRAITS.map((trait) => {
                        const selected = secondaryTraits.includes(trait)
                        return (
                          <button
                            key={trait}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setSecondaryTraits((current) => toggleInList(current, trait, 2))}
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              selected ? 'border-burgundy bg-burgundy text-primary-foreground' : 'border-border bg-card',
                            )}
                          >
                            {trait}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">What should your wedding feel like?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Pick up to three vibes.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {WEDDING_VIBES.map((vibe) => {
                      const selected = weddingVibes.includes(vibe.id)
                      return (
                        <button
                          key={vibe.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setWeddingVibes((current) => toggleInList(current, vibe.id, 3))}
                          className={cn(
                            'overflow-hidden rounded-2xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected ? 'border-burgundy shadow-card' : 'border-border',
                          )}
                        >
                          <div className={cn('h-20 bg-gradient-to-br', vibe.gradient)} />
                          <div className="p-3">
                            <p className="font-semibold">{vibe.id}</p>
                            <p className="text-xs text-muted-foreground">{vibe.caption}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div>
                    <p className="mb-2 font-medium">What do you want guests to remember?</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {GUEST_MEMORY_OPTIONS.map((option) => {
                        const selected = guestMemoryPriorities.includes(option)
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              setGuestMemoryPriorities((current) => toggleInList(current, option, 4))
                            }
                            className={cn(
                              'rounded-xl border px-3 py-3 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              selected ? 'border-burgundy bg-blush/40' : 'border-border bg-card',
                            )}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">How do you want to approach the budget?</h3>
                  </div>
                  <div className="space-y-2">
                    {SPENDING_PHILOSOPHIES.map((option) => {
                      const selected = spendingPhilosophy === option
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSpendingPhilosophy(option)}
                          className={cn(
                            'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected ? 'border-burgundy bg-blush/40' : 'border-border bg-card',
                          )}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                  <div>
                    <p className="mb-2 font-medium">Which wedding expenses feel least important?</p>
                    <div className="flex flex-wrap gap-2">
                      {LOW_PRIORITY_EXPENSES.map((item) => {
                        const selected = lowPriorityExpenses.includes(item)
                        return (
                          <button
                            key={item}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              setLowPriorityExpenses((current) => toggleInList(current, item))
                            }
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              selected ? 'border-burgundy bg-burgundy text-primary-foreground' : 'border-border bg-card',
                            )}
                          >
                            {item}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">Choose up to three priorities.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {priorities.map((priority) => {
                      const selected = values.priorities.includes(priority)
                      return (
                        <button
                          key={priority}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            const current = values.priorities as PriorityOption[]
                            if (current.includes(priority)) {
                              form.setValue(
                                'priorities',
                                current.filter((item) => item !== priority),
                                { shouldValidate: true },
                              )
                              return
                            }
                            if (current.length >= 3) {
                              toast.message('You can choose up to three priorities')
                              return
                            }
                            form.setValue('priorities', [...current, priority], { shouldValidate: true })
                          }}
                          className={cn(
                            'rounded-xl border px-4 py-3 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected ? 'border-burgundy bg-blush/50 text-burgundy' : 'border-border bg-card',
                          )}
                        >
                          {priority}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">Which items are already completed?</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {completedOptions.map((item) => {
                      const selected = values.completedItems.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            const current = values.completedItems as CompletedItem[]
                            form.setValue(
                              'completedItems',
                              current.includes(item)
                                ? current.filter((value) => value !== item)
                                : [...current, item],
                              { shouldValidate: true },
                            )
                          }}
                          className={cn(
                            'rounded-xl border px-4 py-3 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected ? 'border-burgundy bg-blush/50 text-burgundy' : 'border-border bg-card',
                          )}
                        >
                          {item}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                >
                  <ArrowLeft /> Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={async () => {
                      const valid = await validateStep()
                      if (valid) setStep((current) => current + 1)
                    }}
                  >
                    Continue <ArrowRight />
                  </Button>
                ) : (
                  <Button type="submit">Go to dashboard</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
