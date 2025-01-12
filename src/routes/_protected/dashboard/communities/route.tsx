import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/communities')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Communities Page</h1>
    </div>
  )
}
