import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import { Toaster } from "sonner";

const NotFoundRedirect = () => { 
  const router = useRouter(); 

  useEffect(() => { 
    router.navigate({ to: "/auth/login" });
  }, [router]);

  return null;
};

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: NotFoundRedirect,
});
