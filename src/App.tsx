import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider } from '@/context/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Skeleton } from '@/components/ui/skeleton'

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((module) => ({ default: module.LandingPage })),
)
const OnboardingPage = lazy(() =>
  import('@/pages/OnboardingPage').then((module) => ({ default: module.OnboardingPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const TimelinePage = lazy(() =>
  import('@/pages/TimelinePage').then((module) => ({ default: module.TimelinePage })),
)
const VendorsPage = lazy(() =>
  import('@/pages/VendorsPage').then((module) => ({ default: module.VendorsPage })),
)
const BudgetPage = lazy(() =>
  import('@/pages/BudgetPage').then((module) => ({ default: module.BudgetPage })),
)
const EmailsPage = lazy(() =>
  import('@/pages/EmailsPage').then((module) => ({ default: module.EmailsPage })),
)
const AssistantPage = lazy(() =>
  import('@/pages/AssistantPage').then((module) => ({ default: module.AssistantPage })),
)

function RouteFallback() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8" aria-busy="true" aria-live="polite">
      <Skeleton className="h-10 w-64 max-w-full" />
      <Skeleton className="h-5 w-96 max-w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/emails" element={<EmailsPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster richColors position="top-right" closeButton />
    </AppProvider>
  )
}
