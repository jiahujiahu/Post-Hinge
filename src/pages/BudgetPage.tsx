import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Expense, VendorCategory } from '@/types'
import { useApp } from '@/hooks/useApp'
import { PageHeader } from '@/components/PageHeader'
import { BudgetChart } from '@/components/BudgetChart'
import { RiskAlert } from '@/components/RiskAlert'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, percentUsed } from '@/lib/utils'

const categories: VendorCategory[] = [
  'Venue',
  'Catering',
  'Photography',
  'Flowers',
  'Fashion',
  'Music',
  'Stationery',
  'Transportation',
  'Miscellaneous',
]

const emptyExpense = (): Omit<Expense, 'id'> => ({
  category: 'Miscellaneous',
  description: '',
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  vendorName: '',
  type: 'spent',
})

export function BudgetPage() {
  const { data, budgetSummary, budgetCategories, addExpense, updateExpense, deleteExpense } = useApp()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | VendorCategory>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [draft, setDraft] = useState(emptyExpense())
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredExpenses = useMemo(() => {
    return data.expenses.filter((expense) => {
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
      const query = search.toLowerCase()
      const matchesSearch =
        !query ||
        expense.description.toLowerCase().includes(query) ||
        (expense.vendorName || '').toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [categoryFilter, data.expenses, search])

  const openCreate = () => {
    setEditing(null)
    setDraft(emptyExpense())
    setDialogOpen(true)
  }

  const openEdit = (expense: Expense) => {
    setEditing(expense)
    setDraft({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      vendorName: expense.vendorName || '',
      type: expense.type,
    })
    setDialogOpen(true)
  }

  const saveExpense = () => {
    if (!draft.description.trim() || !Number.isFinite(draft.amount) || draft.amount <= 0) {
      toast.error('Description and a positive amount are required')
      return
    }
    if (editing) {
      updateExpense({ ...editing, ...draft })
      toast.success('Expense updated')
    } else {
      addExpense(draft)
      toast.success('Expense added')
    }
    setDialogOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Budget tracker"
        subtitle="See where money is spent, committed, and at risk before it becomes a surprise."
        actions={
          <Button onClick={openCreate} className="w-full sm:w-auto">
            <Plus /> Add an expense
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total budget', budgetSummary.totalBudget],
          ['Spent', budgetSummary.spent],
          ['Committed', budgetSummary.committed],
          ['Remaining', budgetSummary.remaining],
          ['Projected final spend', budgetSummary.projectedFinalSpend],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold">
                {formatCurrency(Number(value))}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        {budgetSummary.overBy > 0 ? (
          <RiskAlert
            variant="danger"
            title={`At your current spending pace, you may exceed your budget by ${formatCurrency(budgetSummary.overBy)}.`}
            description="Projection includes open photography/floral quote pressure and category watch signals. Demo benchmarks are estimates."
            action={
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/assistant?q=Can%20we%20afford%20a%20live%20band%3F">
                    Ask about a live band
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/vendors#comparison">Review photographer quotes</Link>
                </Button>
              </div>
            }
          />
        ) : (
          <RiskAlert
            title="Budget looks on track for now"
            description="Keep watching photography and flowers as quotes land. You can still ask the assistant about trade-offs."
            action={
              <Button asChild size="sm" variant="outline">
                <Link to="/assistant">Open assistant</Link>
              </Button>
            }
          />
        )}
      </div>

      <div className="mt-6">
        <BudgetChart categories={budgetCategories} summary={budgetSummary} variant="detailed" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Category breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Allocated</th>
                  <th className="pb-3 font-semibold">Spent</th>
                  <th className="pb-3 font-semibold">Remaining</th>
                  <th className="pb-3 font-semibold">% used</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {budgetCategories.map((category) => {
                  const remaining = category.allocated - category.spent
                  const used = percentUsed(category.spent + category.committed, category.allocated)
                  return (
                    <tr key={category.id} className="border-b border-border/70 last:border-0">
                      <td className="py-3 pr-3 font-medium">{category.name}</td>
                      <td className="py-3 pr-3">{formatCurrency(category.allocated)}</td>
                      <td className="py-3 pr-3">{formatCurrency(category.spent)}</td>
                      <td className="py-3 pr-3">{formatCurrency(remaining)}</td>
                      <td className="py-3 pr-3">{used}%</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            category.status === 'over'
                              ? 'danger'
                              : category.status === 'watch'
                                ? 'warning'
                                : 'success'
                          }
                        >
                          {category.status === 'on_track'
                            ? 'On track'
                            : category.status === 'watch'
                              ? 'Watch'
                              : 'Over'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {budgetCategories.map((category) => {
              const used = percentUsed(category.spent + category.committed, category.allocated)
              return (
                <article key={category.id} className="rounded-2xl border border-border/80 bg-secondary/30 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{category.name}</p>
                    <Badge
                      variant={
                        category.status === 'over'
                          ? 'danger'
                          : category.status === 'watch'
                            ? 'warning'
                            : 'success'
                      }
                    >
                      {category.status === 'on_track'
                        ? 'On track'
                        : category.status === 'watch'
                          ? 'Watch'
                          : 'Over'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatCurrency(category.spent)} spent of {formatCurrency(category.allocated)} · {used}% used
                  </p>
                </article>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="gap-4">
          <CardTitle className="text-xl">Expenses</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Label htmlFor="expense-search" className="sr-only">
                Search expenses
              </Label>
              <Input
                id="expense-search"
                className="pl-9"
                placeholder="Search expenses"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as 'all' | VendorCategory)}
            >
              <SelectTrigger className="sm:w-56" aria-label="Filter by category">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No expenses found"
              description="Try another search, clear the category filter, or add a new expense."
              actionLabel="Add an expense"
              onAction={openCreate}
            />
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {expense.category}
                      {expense.vendorName ? ` · ${expense.vendorName}` : ''} · {expense.date} ·{' '}
                      {expense.type === 'spent' ? 'Spent' : 'Committed'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-xl font-semibold">
                      {formatCurrency(expense.amount)}
                    </p>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEdit(expense)}
                      aria-label="Edit expense"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(expense.id)}
                      aria-label="Delete expense"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit expense' : 'Add an expense'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <Select
                value={draft.category}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, category: value as VendorCategory }))
                }
              >
                <SelectTrigger id="expense-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-type">Type</Label>
              <Select
                value={draft.type}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, type: value as Expense['type'] }))
                }
              >
                <SelectTrigger id="expense-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spent">Spent</SelectItem>
                  <SelectItem value="committed">Committed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={draft.amount || ''}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, amount: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={draft.date}
                onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="vendorName">Vendor name (optional)</Label>
              <Input
                id="vendorName"
                value={draft.vendorName}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, vendorName: event.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveExpense}>Save expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this expense?"
        description="This will remove the expense and update category totals."
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          deleteExpense(deleteId)
          toast.success('Expense deleted')
        }}
      />
    </div>
  )
}
