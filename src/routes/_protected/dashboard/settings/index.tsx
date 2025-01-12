import MainPage from '@/app/dashboard/main-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainPage>
      <h1>Account Settings Page</h1>
    </MainPage>
  )
}
