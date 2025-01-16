import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./input.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./components/ui/theme-provider";
import QueryProvider from "./providers/query-provider";

import { setAuthorizationToken } from "@/lib/axios-config"; // Import the function for setting the token


// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const initializeToken = () => {
  const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage or use cookies
  if (token) {
    setAuthorizationToken(token);
    console.log("Authorization token set during app initialization:", token);
  } else {
    console.log("No authorization token found during app initialization.");
  }
};

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  initializeToken();
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryProvider>
    </StrictMode>
  );
}
