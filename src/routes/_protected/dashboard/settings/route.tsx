import SettingsPage from '@/app/settings/settings-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SettingsPage />
    </div>
  )
}
