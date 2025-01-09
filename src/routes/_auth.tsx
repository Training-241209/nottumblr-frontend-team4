import { useAuth } from "@/components/auth/hooks/use-auth"; //Custom hook to check if user is authenticated
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router"; //Creating the route with the TanStack
import { useEffect } from "react"; //useEffect

export const Route = createFileRoute("/_auth")({ //<-- Basic creation of the route 
  component: RouteComponent, //<-- RouteComponent being rendered
});

function RouteComponent() { //<-- Route Component from above
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
  }, [auth]); //<-- Dependency is auth. We are checking auth and if auth changes is when useEffect is run. Here it's only run once.
  return (
      <Outlet />
  );
}