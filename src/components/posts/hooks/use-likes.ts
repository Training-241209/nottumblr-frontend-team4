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
  const { data: authUser } = useAuth();
  const currentUser = authUser?.username;
  console.log("Current user from useAuth:", currentUser);

  const queryKey = ["likes", type, entityId];

  const baseEndpoint =
    type === "post" ? `/posts/${entityId}/likes` : `/posts/reblogs/${entityId}/likes`;
  const likeEndpoint =
    type === "post"
      ? `/posts/${entityId}/likes/like`
      : `/posts/reblogs/${entityId}/likes/like`;
  const unlikeEndpoint =
    type === "post"
      ? `/posts/${entityId}/likes`
      : `/posts/reblogs/${entityId}/likes`;

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

  const { data: likes = [] } = useQuery<Like[]>({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get<Like[]>(baseEndpoint, {
        headers: getAuthorizationHeaders(),
      });
      console.log("Fetched likes:", response.data);
      return response.data;
    },
  });

  const currentUserLike = likes.find((like) => like.username === currentUser);
  console.log("Current user like:", currentUserLike);

  const addLike = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post<Like>(likeEndpoint, {}, {
        headers: getAuthorizationHeaders(),
      });
      return response.data;
    },
    onMutate: async () => {
      if (!currentUser) {
        console.warn("Current user is not available for optimistic update.");
        return;
      }
      console.log("Optimistic update: Adding like...");
      await queryClient.cancelQueries({ queryKey });
      const previousLikes = queryClient.getQueryData<Like[]>(queryKey) || [];
      queryClient.setQueryData(queryKey, [
        ...previousLikes,
        { likeId: Date.now(), username: currentUser, entityId },
      ]);
      return { previousLikes };
    },
    onError: (error, _, context: any) => {
      console.error("Error adding like:", error);
      queryClient.setQueryData(queryKey, context?.previousLikes);
      toast.error("Failed to like the post.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeLike = useMutation({
    mutationFn: async (likeId: number) => {
      const response = await axiosInstance.delete(`${unlikeEndpoint}/${likeId}`, {
        headers: getAuthorizationHeaders(),
      });
      return response.data;
    },
    onMutate: async (likeId: number) => {
      if (!currentUser) {
        console.warn("Current user is not available for optimistic update.");
        return;
      }
      console.log("Optimistic update: Removing like...");
      await queryClient.cancelQueries({ queryKey });
      const previousLikes = queryClient.getQueryData<Like[]>(queryKey) || [];
      queryClient.setQueryData(
        queryKey,
        previousLikes.filter((like) => like.likeId !== likeId)
      );
      return { previousLikes };
    },
    onError: (error, _, context: any) => {
      console.error("Error removing like:", error);
      queryClient.setQueryData(queryKey, context?.previousLikes);
      toast.error("Failed to remove like.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  console.log("Likes hook state:", {
    likes,
    likeCount: likes.length,
    isLiked: !!currentUserLike,
    currentUserLikeId: currentUserLike?.likeId,
  });

  return {
    likes,
    likeCount: likes.length,
    isLiked: !!currentUserLike,
    currentUserLikeId: currentUserLike?.likeId,
    addLike: addLike.mutate,
    removeLike: removeLike.mutate,
  };
}
