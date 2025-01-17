import CommunityGrid from '@/app/communities/community-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/communities/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <CommunityGrid />
    </div>
  )
}
