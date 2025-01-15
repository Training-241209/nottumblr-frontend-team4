import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  bloggerUsername: string;
}

export function useComments(postId: number) {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const resp = await axiosInstance.get(`/posts/${postId}/comments`);
      return resp.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const resp = await axiosInstance.post(`/posts/${postId}/comments/create`, { content });
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add comment.");
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      await axiosInstance.delete(`/posts/${postId}/comments/delete/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete comment.");
    },
  });
}
