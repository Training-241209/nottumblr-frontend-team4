import { toast } from "sonner"; // <-- Toaster
import { LoginSchema } from "../schemas/login-schema"; // <-- Login Schemas

import { useMutation, useQueryClient } from "@tanstack/react-query"; // <-- TanStack Query
import { axiosInstance } from "@/lib/axios-config"; // <-- Axios
// Axios gets the data and TanStack Query handles the data
import { useRouter } from "@tanstack/react-router"; // <-- TanStack Router

//Custom useLogin Hook
export function useLogin() {
  const queryClient = useQueryClient(); //<-- Being able to use the queryClient
  const router = useRouter(); //<-- using the router

  return useMutation({//<-- we are using useMutation because this is a post request and we are mutating the data
    mutationFn: async (values: LoginSchema) => {// <-- Mutation function called
      const resp = await axiosInstance.post("/auth/login", values); //<-- calling the postrequest using axios
      return resp.data; //<-- returning the data
    },
    /**
     * When the mutation is successful, it will:
     * 1. Invalidate the cache for the "auth" query
     * 2. Show a success toast message
     * 3. Navigate to the dashboard
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ // <-- invalidating what we had before..
        queryKey: ["auth"], // <---------------- with this key
      });
      console.log("hi");
      toast.success("Logged in successfully."); //<-- logging in successfully
      router.navigate({ to: "/dashboard" }); //<-- navigating to the dashboard because we were successful
    },
    onError: () => {
      toast.error("Failed to login.");
    },
  });
}