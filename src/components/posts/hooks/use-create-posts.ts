import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

// Input interface - what you send to the API
interface CreatePostInput {
  content: string;
  mediaUrl?: string | null;
  mediaType?: string | null;
}

// Response interface - what you get back from the API
interface CreatePostResponse {
  postId: number;
  username: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  bloggerId: number;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: CreatePostInput) => {
      const resp = await axiosInstance.post<CreatePostResponse>("/posts/create", post);
      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!");
    },
    onError: (error: any) => {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post.");
    },
  });
}