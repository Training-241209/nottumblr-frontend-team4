import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

const NotFoundRedirect = () => {
  const router = useRouter();
  const currentPath = window.location.pathname;

  useEffect(() => {
    // Only redirect to login if we're not already in an auth route
    if (!currentPath.startsWith('/auth/')) {
      router.navigate({ to: "/auth/login" });
    }
  }, [router, currentPath]);

  return null;
};

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
  notFoundComponent: NotFoundRedirect,
});
