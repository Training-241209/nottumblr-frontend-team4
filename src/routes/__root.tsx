import { ThemeProvider } from "@/components/ui/theme-provider";
import QueryProvider from "@/providers/query-provider";
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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryProvider>
          <Outlet />
          <Toaster />
          <TanStackRouterDevtools />
        </QueryProvider>
      </ThemeProvider>
    </>
  ),
  notFoundComponent: NotFoundRedirect,
});
