import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/hooks/use-auth";

interface Like {
  likeId: number;
  username: string;
  entityId: number; // Could be postId or reblogId
}

export function useLikes(entityId: number, type: "post" | "reblog") {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  // Define base endpoints based on type
  const baseEndpoint =
    type === "post" ? `/posts/${entityId}/likes` : `/posts/reblogs/${entityId}/likes`;

  const likeEndpoint =
    type === "post"
      ? `/posts/${entityId}/likes/like`
      : `/posts/reblogs/${entityId}/likes/like`;

  const unlikeEndpoint =
    type === "post"
      ? `/posts/${entityId}/likes/`
      : `/posts/reblogs/${entityId}/likes`;

  // Get likes for the entity
  const { data: likes } = useQuery({
    queryKey: ["likes", type, entityId],
    queryFn: async () => {
      const response = await axiosInstance.get<Like[]>(baseEndpoint);
      return response.data;
    },
  });

  // Create like mutation
  const { mutate: addLike } = useMutation({
    mutationFn: async () => {
      return axiosInstance.post<Like>(likeEndpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", type, entityId] });
      toast.success("Liked successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to like");
    },
  });

  // Remove like mutation
  const { mutate: removeLike } = useMutation({
    mutationFn: async (likeId: number) => {
      return axiosInstance.delete(`${unlikeEndpoint}/${likeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", type, entityId] });
      toast.success("Like removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to remove like");
    },
  });

  // Find current user's like if it exists
  const currentUserLike = likes?.find((like) => like.username === user?.username);

  return {
    likes: likes || [],
    likeCount: likes?.length || 0,
    isLiked: !!currentUserLike,
    currentUserLikeId: currentUserLike?.likeId,
    addLike,
    removeLike,
  };
}
