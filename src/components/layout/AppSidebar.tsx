import { NavLink } from 'react-router-dom'
import {
  CalendarDays,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  PiggyBank,
  RefreshCcw,
  Store,
  Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { toast } from 'sonner'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/timeline', label: 'Timeline', icon: CalendarDays },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/budget', label: 'Budget', icon: PiggyBank },
  { to: '/emails', label: 'Emails', icon: Mail },
  { to: '/assistant', label: 'Assistant', icon: MessageSquareText },
]

interface AppSidebarProps {
  onNavigate?: () => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const { data, resetDemo } = useApp()

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border/80 bg-card/90 px-4 py-5 backdrop-blur">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-burgundy text-primary-foreground">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold leading-none">AfterHinge</p>
            <p className="mt-1 text-xs text-muted-foreground">Wedding planning copilot</p>
          </div>
        </div>
        <Badge variant="secondary" className="mt-4">
          Demo Mode
        </Badge>
        <p className="mt-3 text-sm text-muted-foreground">
          {data.couple.partnerOneName} & {data.couple.partnerTwoName}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="App">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-burgundy text-primary-foreground shadow-soft'
                  : 'text-foreground/80 hover:bg-secondary',
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => {
            resetDemo()
            toast.success('Demo data restored')
            onNavigate?.()
          }}
        >
          <RefreshCcw />
          Reset demo data
        </Button>
        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          Local benchmarks and recommendations are demo estimates for presentation.
        </p>
      </div>
    </aside>
  )
}
