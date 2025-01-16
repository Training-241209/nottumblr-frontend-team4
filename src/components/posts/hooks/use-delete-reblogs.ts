import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

export function useDeleteReblog() {
  const queryClient = useQueryClient();

  // Helper function to retrieve the token for Authorization
  const getAuthorizationHeaders = () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      throw new Error("Missing JWT token");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  return useMutation({
    mutationFn: async (reblogId: number) => {
      try {
        // This calls your backend’s DELETE /reblogs/{reblogId} endpoint
        await axiosInstance.delete(`/reblogs/${reblogId}`, {
          headers: getAuthorizationHeaders(),
        });
      } catch (error: any) {
        console.error("Error deleting reblog:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reblogs"] });
      queryClient.invalidateQueries({ queryKey: ["allReblogs"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      toast.success("Reblog deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Error in delete reblog mutation:", error);
      toast.error(error.response?.data?.error || "Failed to delete reblog.");
    },
  });
}
