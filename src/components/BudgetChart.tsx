import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BudgetCategory, BudgetSummary } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#7A3040', '#C4787A', '#E8D5B7', '#A66B6D', '#4A3530', '#D4A5A5', '#B08968', '#8C5E58', '#6F5C55']

interface BudgetChartProps {
  categories: BudgetCategory[]
  summary: BudgetSummary
  variant?: 'overview' | 'detailed'
}

export function BudgetChart({ categories, summary, variant = 'overview' }: BudgetChartProps) {
  const overviewData = [
    { name: 'Spent', value: summary.spent },
    { name: 'Committed', value: summary.committed },
    { name: 'Remaining', value: Math.max(summary.remaining, 0) },
  ]

  const allocationData = categories.map((category) => ({
    name: category.name,
    value: category.allocated,
  }))

  const comparisonData = categories.map((category) => ({
    name: category.name,
    Allocated: category.allocated,
    Spent: category.spent,
  }))

  if (variant === 'overview') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Budget overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eadfd4" />
                <XAxis dataKey="name" tick={{ fill: '#6f5c55', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6f5c55', fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {overviewData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="sr-only">
            {overviewData.map((item) => (
              <li key={item.name}>
                {item.name}: {formatCurrency(item.value)}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Projected final spend: {formatCurrency(summary.projectedFinalSpend)}
            {summary.overBy > 0 ? ` · ${formatCurrency(summary.overBy)} over plan` : ''}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Category allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 sm:h-80" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="sr-only">
            {allocationData.map((item) => (
              <li key={item.name}>
                {item.name}: {formatCurrency(item.value)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Allocated vs spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 sm:h-80" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ bottom: 48, left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eadfd4" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: '#6f5c55' }}
                  height={60}
                />
                <YAxis tick={{ fill: '#6f5c55', fontSize: 12 }} width={48} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="Allocated" fill="#E8D5B7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Spent" fill="#7A3040" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
