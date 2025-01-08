import LoginPage from '@/app/login/login-page'
import { createFileRoute } from '@tanstack/react-router' //<-- React Router

export const Route = createFileRoute('/_auth/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage />
}
