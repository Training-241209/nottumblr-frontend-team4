import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

interface ReblogInput {
  postId: number;
  comment?: string;
}

export function useReblogMutation() {
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
    mutationFn: async ({ postId, comment }: ReblogInput) => {
      try {
        const response = await axiosInstance.post(
          `/reblogs/posts/${postId}`,
          { comment },
          {
            headers: getAuthorizationHeaders(),
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error reblogging post:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reblogs"] }); 
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["allReblogs"] }); 
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      toast.success("Reblogged successfully!");
    },
    onError: (error: any) => {
      console.error("Error in reblog mutation:", error);
      toast.error(error.response?.data?.message || "Failed to reblog post.");
    },
  });
}
