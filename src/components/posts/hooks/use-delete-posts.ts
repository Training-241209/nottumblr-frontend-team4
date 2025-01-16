import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

// Optional: If you have an interface for the post, you can import or define here

export function useDeletePost() {
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
    mutationFn: async (postId: number) => {
      try {
        await axiosInstance.delete(`/posts/${postId}`, {
          headers: getAuthorizationHeaders(),
        });
      } catch (error: any) {
        console.error("Error deleting post:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate or refetch relevant queries to remove the post from the timeline
      queryClient.invalidateQueries({ queryKey: ["reblogs"] }); 
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["allReblogs"] }); 
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Error in delete post mutation:", error);
      toast.error(error.response?.data?.error || "Failed to delete post.");
    },
  });
}
