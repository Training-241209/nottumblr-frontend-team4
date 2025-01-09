import { ThemeProvider } from "@/components/ui/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";

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
});
