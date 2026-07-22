import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import type { CompletedItem, PriorityOption } from '@/types'
import { useApp } from '@/context/AppContext'
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

const steps = ['Couple', 'Wedding', 'Budget', 'Priorities', 'Status']

export function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()
  const [step, setStep] = useState(0)

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
      priorities: ['Photography', 'Food', 'Staying under budget'],
      completedItems: ['Venue booked', 'Guest list drafted'],
    },
    mode: 'onChange',
  })

  const values = form.watch()

  const validateStep = async () => {
    const fieldsByStep: (keyof FormValues)[][] = [
      ['partnerOneName', 'partnerTwoName'],
      ['weddingDate', 'city', 'venueName', 'guestCount'],
      ['totalBudget', 'currency', 'amountSpent'],
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
    toast.success('Wedding profile saved')
    navigate('/dashboard')
  })

  const togglePriority = (priority: PriorityOption) => {
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
  }

  const toggleCompleted = (item: CompletedItem) => {
    const current = values.completedItems as CompletedItem[]
    form.setValue(
      'completedItems',
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
      { shouldValidate: true },
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-2xl">
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
            <CardTitle className="text-3xl">Set up your wedding</CardTitle>
            <p className="text-sm text-muted-foreground">
              Step {step + 1} of {steps.length}: {steps[step]}
            </p>
            <Progress value={((step + 1) / steps.length) * 100} className="mt-3" />
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="partnerOneName">Partner one name</Label>
                    <Input id="partnerOneName" {...form.register('partnerOneName')} />
                    <p className="text-xs text-destructive">{form.formState.errors.partnerOneName?.message}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerTwoName">Partner two name</Label>
                    <Input id="partnerTwoName" {...form.register('partnerTwoName')} />
                    <p className="text-xs text-destructive">{form.formState.errors.partnerTwoName?.message}</p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="weddingDate">Wedding date</Label>
                    <Input id="weddingDate" type="date" {...form.register('weddingDate')} />
                    <p className="text-xs text-destructive">{form.formState.errors.weddingDate?.message}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...form.register('city')} />
                    <p className="text-xs text-destructive">{form.formState.errors.city?.message}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueName">Venue name</Label>
                    <Input id="venueName" {...form.register('venueName')} />
                    <p className="text-xs text-destructive">{form.formState.errors.venueName?.message}</p>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="guestCount">Guest count</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      {...form.register('guestCount', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-destructive">{form.formState.errors.guestCount?.message}</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="totalBudget">Total budget</Label>
                    <Input
                      id="totalBudget"
                      type="number"
                      {...form.register('totalBudget', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-destructive">{form.formState.errors.totalBudget?.message}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={values.currency}
                      onValueChange={(value) => form.setValue('currency', value, { shouldValidate: true })}
                    >
                      <SelectTrigger>
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
                    <Input
                      id="amountSpent"
                      type="number"
                      {...form.register('amountSpent', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-destructive">{form.formState.errors.amountSpent?.message}</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">Choose up to three priorities.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {priorities.map((priority) => {
                      const selected = values.priorities.includes(priority)
                      return (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => togglePriority(priority)}
                          className={cn(
                            'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected
                              ? 'border-burgundy bg-blush/50 text-burgundy'
                              : 'border-border bg-card hover:bg-secondary',
                          )}
                        >
                          {priority}
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-2 text-xs text-destructive">{form.formState.errors.priorities?.message}</p>
                </div>
              )}

              {step === 4 && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">Which items are already completed?</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {completedOptions.map((item) => {
                      const selected = values.completedItems.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleCompleted(item)}
                          className={cn(
                            'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            selected
                              ? 'border-burgundy bg-blush/50 text-burgundy'
                              : 'border-border bg-card hover:bg-secondary',
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
