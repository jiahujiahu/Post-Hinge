import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useApp } from '@/hooks/useApp'

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
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <aside className="flex min-h-full w-full flex-col border-r border-border/80 bg-card/90 px-4 py-5 backdrop-blur lg:h-full lg:w-72">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-burgundy text-primary-foreground">
            <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
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
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setConfirmReset(true)}
        >
          <RefreshCcw />
          Reset demo data
        </Button>
        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          Local benchmarks and recommendations are demo estimates for presentation.
        </p>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        description="This restores the Maya & Alex sample wedding and clears your local changes."
        confirmLabel="Reset demo"
        confirmVariant="default"
        onOpenChange={setConfirmReset}
        onConfirm={() => {
          resetDemo()
          localStorage.removeItem('afterhinge_walkthrough_dismissed')
          localStorage.removeItem('afterhinge_walkthrough_steps')
          sessionStorage.removeItem('afterhinge_dash_loaded')
          toast.success('Demo data restored')
          navigate('/dashboard')
          onNavigate?.()
        }}
      />
    </aside>
  )
}
