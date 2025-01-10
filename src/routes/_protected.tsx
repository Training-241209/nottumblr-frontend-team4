import MainPage from '@/app/dashboard/main-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MainPage />
}
