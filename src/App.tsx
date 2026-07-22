import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider } from '@/context/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TimelinePage } from '@/pages/TimelinePage'
import { VendorsPage } from '@/pages/VendorsPage'
import { BudgetPage } from '@/pages/BudgetPage'
import { EmailsPage } from '@/pages/EmailsPage'
import { AssistantPage } from '@/pages/AssistantPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
      </BrowserRouter>
      <Toaster richColors position="top-right" closeButton />
    </AppProvider>
  )
}
