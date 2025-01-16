import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

interface Post {
  content: string;
  mediaUrl?: string;
  mediaType?: string;
}

export function useCreatePost() {
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

  const createPostMutation = useMutation({
    mutationFn: async (newPost: Post) => {
      try {
        const response = await axiosInstance.post<Post>("/posts/create", newPost, {
          headers: getAuthorizationHeaders(),
        });
        return response.data;
      } catch (error: any) {
        console.error("Error creating post:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!");
    },
    onError: (error: any) => {
      console.error("Error in create post mutation:", error);
      toast.error(error.response?.data?.error || "Failed to create post.");
    },
  });

  return {
    mutate: createPostMutation.mutate,   // Explicitly returning 'mutate'
    status: createPostMutation.status,  // Returning 'status' for tracking
  };
}
