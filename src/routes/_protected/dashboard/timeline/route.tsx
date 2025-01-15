import TopBloggersCard from '@/components/posts/top-bloggers-card'
import Timeline from '@/components/timelines/main-page-timeline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/timeline')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1> Timeline </h1>
    </div>
  )
}
