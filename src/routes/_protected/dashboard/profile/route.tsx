import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  )
}
