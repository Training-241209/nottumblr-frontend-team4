import { axiosInstance, setAuthorizationToken } from "@/lib/axios-config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("jwt");
      const resp = await axiosInstance.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Logged out successfully");

      console.log("logging out.");

      // Invalidate all user-related queries
      queryClient.clear();
      
      // Clear local storage and cookies
      document.cookie = "jwt=; Max-Age=0; path=/;";
      localStorage.removeItem("jwt");
      setAuthorizationToken(null);

      // Navigate to the login page
      router.navigate({ to: "/auth/login" });
    },
    onError: () => {
      toast.error("Failed to log out");
    },
  });
}