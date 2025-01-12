import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Explore Page</h1>
    </div>
  )
}
