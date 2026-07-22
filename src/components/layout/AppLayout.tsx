import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export function AppLayout() {
  return (
    <div className="min-h-screen lg:flex">
      <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:shrink-0">
        <AppSidebar />
      </div>
      <div className="min-w-0 flex-1">
        <MobileNav />
        <main className="px-4 py-6 md:px-8 md:py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
