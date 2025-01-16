import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

interface Comment {
  commentId: number;
  content: string;
  bloggerUsername: string;
  createdAt: string;
}

export function useComments(entityId: number, type: "post" | "reblog") {
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

  // Fetch comments for a post or reblog
  const { data: comments } = useQuery({
    queryKey: ["comments", type, entityId],
    queryFn: async () => {
      try {
        const endpoint =
          type === "post" ? `/posts/${entityId}/comments` : `/reblogs/${entityId}/comments`;
        const response = await axiosInstance.get<Comment[]>(endpoint, {
          headers: getAuthorizationHeaders(),
        });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching comments:", error);
        toast.error(error.response?.data?.error || "Failed to fetch comments.");
        throw error;
      }
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        const endpoint =
          type === "post"
            ? `/posts/${entityId}/comments/create`
            : `/reblogs/${entityId}/comments/create`;
        const response = await axiosInstance.post<Comment>(
          endpoint,
          { content },
          { headers: getAuthorizationHeaders() }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error adding comment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", type, entityId] });
      toast.success("Comment added successfully!");
    },
    onError: (error: any) => {
      console.error("Error in create comment mutation:", error);
      toast.error(error.response?.data?.error || "Failed to add comment.");
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      try {
        const endpoint =
          type === "post"
            ? `/posts/${entityId}/comments/delete/${commentId}`
            : `/reblogs/${entityId}/comments/delete/${commentId}`;
        const response = await axiosInstance.delete(endpoint, {
          headers: getAuthorizationHeaders(),
        });
        return response.data;
      } catch (error: any) {
        console.error("Error deleting comment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", type, entityId] });
      toast.success("Comment deleted successfully.");
    },
    onError: (error: any) => {
      console.error("Error in delete comment mutation:", error);
      toast.error(error.response?.data?.error || "Failed to delete comment.");
    },
  });

  return {
    comments: comments || [],
    createComment: createCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isAddingComment: createCommentMutation.status === "pending", // Updated loading state
    isDeletingComment: deleteCommentMutation.status === "pending", // Updated loading state
  };
}
