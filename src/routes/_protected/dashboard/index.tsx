import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/dashboard/')({
  component: () => null, // No component rendered since we redirect
  loader: async () => {
    // Redirect to the desired route
    return redirect({ to: '/dashboard/timeline' }); //<-- Basic Redirection using the loader function from tanstack query
  },
});