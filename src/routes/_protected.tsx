
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useAuth } from '@/components/auth/hooks/use-auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
})

function RouteComponent() {
 // Check authentication state from your context or state
  const { data: auth } = useAuth(); //<-- Using the custom hook
  //      ^^^^^^^^^^
  // Returning an object with multiple properties from our custom use-auth hook
  const router = useRouter(); // <-- Using the router

  useEffect(() => { //<-- The side effect is checking if the user is authenticated
    if (auth?.email) { //<-- If the user is authenticated
      //auth?.email because auth can return an empty object ({}) if there is no user to authenticate which results in a truthy value.
      // If the user does exist we navigate to the dashboard
      router.navigate({ to: "/dashboard" });
    }
  }, [auth]);

  return (
    <>
      <Outlet />
    </>
  )
}
