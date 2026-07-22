import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, CheckCircle2, ListTodo, PiggyBank, Store } from 'lucide-react'
import { useApp } from '@/hooks/useApp'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { TaskCard } from '@/components/TaskCard'
import { RiskAlert } from '@/components/RiskAlert'
import { BudgetChart } from '@/components/BudgetChart'
import { DemoWalkthrough } from '@/components/DemoWalkthrough'
import { CoupleProfileHeader } from '@/components/CoupleProfileHeader'
import { PersonalizedInsightCard } from '@/components/PersonalizedInsightCard'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buildPersonalizedInsights } from '@/lib/personalization'
import { daysUntil, formatCurrency, formatDate, greetingForNow, riskLabel, riskStyles } from '@/lib/utils'

export function DashboardPage() {
  const { data, budgetSummary, budgetCategories, toggleTaskComplete } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('afterhinge_dash_loaded'))

  useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('afterhinge_dash_loaded', '1')
      setLoading(false)
    }, 450)
    return () => window.clearTimeout(timer)
  }, [loading])

  const coupleNames = `${data.couple.partnerOneName} & ${data.couple.partnerTwoName}`
  const days = daysUntil(data.wedding.weddingDate)
  const completedTasks = data.tasks.filter((task) => task.completed).length
  const vendorsBooked = data.vendors.filter((vendor) => vendor.status === 'booked').length
  const completion = Math.round((completedTasks / Math.max(data.tasks.length, 1)) * 100)
  const weekTasks = data.tasks
    .filter((task) => !task.completed && (task.priority === 'high' || task.status === 'at_risk' || task.status === 'in_progress'))
    .slice(0, 4)

  const photographerBooked = data.vendors.some(
    (vendor) => vendor.category === 'Photography' && (vendor.status === 'booked' || vendor.status === 'selected'),
  ) || data.quotes.some((quote) => quote.category === 'Photography' && quote.selected)

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <Skeleton className="h-12 w-80 max-w-full" />
        <Skeleton className="h-6 w-96 max-w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`${greetingForNow()}, ${coupleNames}`}
        subtitle={`Your wedding is ${Math.max(days, 0)} days away. Here’s what needs your attention.`}
        actions={
          <Button asChild className="w-full sm:w-auto">
            <Link to="/vendors">Analyze a new quote</Link>
          </Button>
        }
      />

      <DemoWalkthrough className="mb-6" />

      <CoupleProfileHeader couple={data.couple} />

      <section className="mt-6">
        <h2 className="mb-3 font-display text-2xl font-semibold">Made for you</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {buildPersonalizedInsights(data.couple, data.wedding).map((insight) => (
            <PersonalizedInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Days until wedding"
          value={String(Math.max(days, 0))}
          icon={CalendarDays}
          hint={formatDate(data.wedding.weddingDate)}
        />
        <StatCard
          label="Tasks completed"
          value={`${completedTasks}/${data.tasks.length}`}
          icon={CheckCircle2}
        />
        <StatCard
          label="Budget remaining"
          value={formatCurrency(budgetSummary.remaining)}
          icon={PiggyBank}
        />
        <StatCard
          label="Vendors booked"
          value={String(vendorsBooked)}
          icon={Store}
          hint={`${data.vendors.length} vendors tracked`}
        />
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Overall wedding completion</p>
              <p className="text-xs text-muted-foreground">Based on timeline tasks completed</p>
            </div>
            <p className="font-display text-2xl font-semibold">{completion}%</p>
          </div>
          <Progress value={completion} aria-label="Overall wedding completion" />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">This week</h2>
          {weekTasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="You’re clear for this week"
              description="No high-priority open tasks right now. Review the full timeline or analyze a new vendor quote."
              actionLabel="Open timeline"
              onAction={() => navigate('/timeline')}
            />
          ) : (
            <div className="space-y-3">
              {weekTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTaskComplete} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 font-display text-2xl font-semibold">At risk</h2>
            <div className="space-y-3">
              {!photographerBooked ? (
                <RiskAlert
                  title="Photographer not booked"
                  description="Three quotes are ready for comparison. Softframe currently looks like the best overall value."
                  action={
                    <Button asChild size="sm" variant="outline">
                      <Link to="/vendors#comparison">Compare quotes</Link>
                    </Button>
                  }
                />
              ) : null}
              <RiskAlert
                title="Floral quote exceeds category budget"
                description="Bloom & Stem is above your flowers allocation—request a scaled package."
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link to="/emails?purpose=Quote%20negotiation&vendor=Bloom%20%26%20Stem&autogen=1">
                      Draft florist email
                    </Link>
                  </Button>
                }
              />
              <RiskAlert
                title="Invitations need to be ordered within 12 days"
                description="Mailing timeline is tight if guest list changes continue."
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link to="/timeline">Open timeline</Link>
                  </Button>
                }
              />
              {budgetSummary.overBy > 0 ? (
                <RiskAlert
                  variant="danger"
                  title={`Projected to exceed budget by ${formatCurrency(budgetSummary.overBy)}`}
                  description="Review category pressure before adding entertainment or accepting high quotes."
                  action={
                    <Button asChild size="sm" variant="outline">
                      <Link to="/budget">Review budget</Link>
                    </Button>
                  }
                />
              ) : null}
            </div>
          </div>
          <BudgetChart categories={budgetCategories} summary={budgetSummary} />
        </section>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Recent vendor quotes</CardTitle>
            <p className="text-sm text-muted-foreground">Latest packages ready for review</p>
          </div>
          <Button asChild variant="champagne" className="w-full sm:w-auto">
            <Link to="/vendors">Analyze a new quote</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Vendor</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Risk</th>
                  <th className="pb-3 font-semibold">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {data.quotes.slice(0, 4).map((quote) => (
                  <tr key={quote.id} className="border-b border-border/70 last:border-0">
                    <td className="py-3 pr-3 font-medium">
                      {quote.vendorName}
                      {quote.isBestValue ? (
                        <Badge variant="success" className="ml-2">
                          Best value
                        </Badge>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3">{quote.category}</td>
                    <td className="py-3 pr-3">{formatCurrency(quote.price, quote.currency)}</td>
                    <td className="py-3 pr-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyles(quote.risk)}`}>
                        {riskLabel(quote.risk)}
                      </span>
                    </td>
                    <td className="max-w-sm py-3 text-muted-foreground">{quote.aiRecommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {data.quotes.slice(0, 4).map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-border/80 bg-secondary/30 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{quote.vendorName}</p>
                  {quote.isBestValue ? <Badge variant="success">Best value</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {quote.category} · {formatCurrency(quote.price, quote.currency)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{quote.aiRecommendation}</p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
