import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle2, PiggyBank, Store } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { TaskCard } from '@/components/TaskCard'
import { RiskAlert } from '@/components/RiskAlert'
import { BudgetChart } from '@/components/BudgetChart'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { daysUntil, formatCurrency, formatDate, greetingForNow, riskLabel, riskStyles } from '@/lib/utils'

export function DashboardPage() {
  const { data, budgetSummary, budgetCategories, toggleTaskComplete } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [])

  const coupleNames = `${data.couple.partnerOneName} & ${data.couple.partnerTwoName}`
  const days = daysUntil(data.wedding.weddingDate)
  const completedTasks = data.tasks.filter((task) => task.completed).length
  const vendorsBooked = data.vendors.filter((vendor) => vendor.status === 'booked').length
  const completion = Math.round((completedTasks / Math.max(data.tasks.length, 1)) * 100)
  const weekTasks = data.tasks.filter((task) =>
    ['task_1', 'task_2', 'task_3', 'task_4'].includes(task.id) ||
    (!task.completed && ['high', 'medium'].includes(task.priority)),
  ).slice(0, 4)

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-6 w-96" />
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
        subtitle={`Your wedding is ${days} days away. Here’s what needs your attention.`}
        actions={
          <Button asChild>
            <Link to="/vendors">Analyze a new quote</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Days until wedding" value={String(days)} icon={CalendarDays} hint={formatDate(data.wedding.weddingDate)} />
        <StatCard label="Tasks completed" value={`${completedTasks}/${data.tasks.length}`} icon={CheckCircle2} />
        <StatCard label="Budget remaining" value={formatCurrency(budgetSummary.remaining)} icon={PiggyBank} />
        <StatCard label="Vendors booked" value={String(vendorsBooked)} icon={Store} hint={`${data.vendors.length} vendors tracked`} />
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
          <Progress value={completion} />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">This week</h2>
          <div className="space-y-3">
            {weekTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggleTaskComplete} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 font-display text-2xl font-semibold">At risk</h2>
            <div className="space-y-3">
              <RiskAlert title="Photographer not booked" description="Three quotes are ready for comparison. Softframe currently looks like the best overall value." />
              <RiskAlert title="Floral quote exceeds category budget" description="Bloom & Stem is above your flowers allocation—request a scaled package." />
              <RiskAlert title="Invitations need to be ordered within 12 days" description="Mailing timeline is tight if guest list changes continue." />
            </div>
          </div>
          <BudgetChart categories={budgetCategories} summary={budgetSummary} />
        </section>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl">Recent vendor quotes</CardTitle>
            <p className="text-sm text-muted-foreground">Latest packages ready for review</p>
          </div>
          <Button asChild variant="champagne">
            <Link to="/vendors">Analyze a new quote</Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
        </CardContent>
      </Card>
    </div>
  )
}
