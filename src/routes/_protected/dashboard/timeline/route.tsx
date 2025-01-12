import Timeline from '@/components/timeline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/timeline')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Timeline />
    </div>
  )
}
