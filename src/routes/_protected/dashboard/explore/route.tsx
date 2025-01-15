import ExplorePage from '@/app/explore/explore-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ExplorePage />
    </div>
  )
}
