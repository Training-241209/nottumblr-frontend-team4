// hooks/use-likes.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/hooks/use-auth";

interface Like {
  likeId: number;
  username: string;
  postId: number;
}

export function useLikes(postId: number) {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  // Get likes for a post
  const { data: likes } = useQuery({
    queryKey: ["likes", postId],
    queryFn: async () => {
      const response = await axiosInstance.get<Like[]>(`/posts/${postId}/likes`);
      return response.data;
    }
  });

  // Create like mutation
  const { mutate: addLike } = useMutation({
    mutationFn: async () => {
      return axiosInstance.post<Like>(`/posts/${postId}/likes/like`);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
      toast.success("Post liked successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to like post");
    }
  });

  // Remove like mutation
  const { mutate: removeLike } = useMutation({
    mutationFn: async (likeId: number) => {
      return axiosInstance.delete(`/posts/${postId}/likes/${likeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
      toast.success("Like removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to remove like");
    }
  });

  // Find current user's like if it exists
  const currentUserLike = likes?.find(like => like.username === user?.username);

  return {
    likes: likes || [],
    likeCount: likes?.length || 0,
    isLiked: !!currentUserLike,
    currentUserLikeId: currentUserLike?.likeId,
    addLike,
    removeLike
  };
}