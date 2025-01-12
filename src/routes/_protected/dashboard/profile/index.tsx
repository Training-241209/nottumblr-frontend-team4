import MainPage from '@/app/dashboard/main-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainPage>
        <h1>Profile Page</h1>
    </MainPage>
  )
}
