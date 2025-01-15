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

  // Fetch comments for a post or reblog
  const { data: comments } = useQuery({
    queryKey: ["comments", type, entityId],
    queryFn: async () => {
      const endpoint = type === "post" ? `/posts/${entityId}/comments` : `/reblogs/${entityId}/comments`;
      const response = await axiosInstance.get<Comment[]>(endpoint);
      return response.data;
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const endpoint = type === "post" ? `/posts/${entityId}/comments/create` : `/reblogs/${entityId}/comments/create`;
      return axiosInstance.post<Comment>(endpoint, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", type, entityId] });
      toast.success("Comment added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to add comment");
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const endpoint =
        type === "post"
          ? `/posts/${entityId}/comments/delete/${commentId}`
          : `/reblogs/${entityId}/comments/delete/${commentId}`;
      return axiosInstance.delete(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", type, entityId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to delete comment");
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
