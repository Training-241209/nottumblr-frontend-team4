import RegisterPage from '@/app/login/register-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterPage />
}
