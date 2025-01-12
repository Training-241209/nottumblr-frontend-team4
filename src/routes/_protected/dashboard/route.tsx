import MainPage from '@/app/dashboard/main-page'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useMemo } from 'react'

// Memoize the DashboardComponent to prevent recreation on route changes
function DashboardComponent() {
  // Memoize the MainPage wrapper
  const MemoizedLayout = useMemo(() => (
    <MainPage>
      <Outlet />
    </MainPage>
  ), []) // Empty dependency array since nothing changes

  return MemoizedLayout
}

DashboardComponent.displayName = 'DashboardComponent'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardComponent,
})