import { axiosInstance } from "@/lib/axios-config"; //<-- Axios library to make HTTP requests to your API
import { useQuery, UseQueryResult } from "@tanstack/react-query"; // <-- TanStack Query
import { useRouter } from "@tanstack/react-router"; //<-- TanStack Router

interface AuthUser { // <-- Defining the shape of AuthUser and what the data will look like
  email: string;
  username: string;
  roleName: string;
  fullName: string; 
}

export function useAuth(): UseQueryResult<AuthUser> { // <-- Defining the custom hook useAuth that we used in _auth.tsx
  const router = useRouter(); //<-- Defining the router

  return useQuery({ //<-- Using TanStack Query (useQuery becuase we are using a get request)
    queryKey: ["auth"], // <-- Defining the query key
    // What is the Query Key?
    // The query key is a unique identifier for the query. It is used to identify and cache the results of the query.
    queryFn: async () => { //Async function that returns a promise (the get request)
//  ^^^^^^^
//  queryFn is from TanStack Query... it's the function we use to fetch the data
// Whenever we use useQuery.. we use queryFn: async() => ... as part of the options
      try {
        const resp = await axiosInstance.get("/auth/me"); //<-- Navigate to the /auth/me route if it works | AWAIT function awaiting the promise of the get request
        return resp.data; //<-- Respond with the data
      } catch (e) {
        console.error(e); // <-- Logging the error
        router.navigate({ to: "/auth/login" }); //<-- If the user is not authenticated we navigate to the login page
        return null; //<-- Return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins // Determines how long before the milk becomes stale
    gcTime: 1000 * 60 * 10, // 10 mins // Garbage Collection
    refetchOnWindowFocus: false, // Refetches the data when the window is focused if it was true
    refetchOnReconnect: false, // Refetches the data when the user reconnects if it was true
  });

  
}