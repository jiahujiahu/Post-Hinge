import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Badge } from '@/components/ui/badge'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border/80 bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="font-display text-xl font-semibold">AfterHinge</p>
          <Badge variant="secondary" className="mt-1">
            Demo Mode
          </Badge>
        </div>
        <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Open navigation">
          <Menu />
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-card shadow-card animate-in slide-in-from-left duration-200">
            <div className="flex justify-end p-3">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close navigation">
                <X />
              </Button>
            </div>
            <AppSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  )
}
