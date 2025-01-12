import MainPage from '@/app/dashboard/main-page'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

// Memoize the DashboardComponent to prevent recreation on route changes
function DashboardComponent() {
  const router = useRouter();

  useEffect(() => {
    // Redirect from /dashboard to /dashboard/timeline
    if (router.state.location.pathname === '/dashboard') {
      router.navigate({ to: '/dashboard/timeline' });
    }
  }, [router]);
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