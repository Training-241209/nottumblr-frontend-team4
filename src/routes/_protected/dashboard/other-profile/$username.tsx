import OtherUserProfile from '@/app/profiles/other-users-profile-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/dashboard/other-profile/$username',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <OtherUserProfile />
}
