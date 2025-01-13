import UsersProfile from '@/app/profiles/users-profile-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <UsersProfile />
    </div>
  )
}
