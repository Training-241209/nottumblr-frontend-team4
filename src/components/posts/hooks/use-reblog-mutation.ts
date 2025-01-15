import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

interface ReblogInput {
  postId: number;
  comment?: string;
}

export function useReblogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, comment }: ReblogInput) => {
      const response = await axiosInstance.post(`/reblogs/posts/${postId}`, { comment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reblogs"] }); // Refresh reblogs query
      toast.success("Reblogged successfully!");
    },
    onError: (error: any) => {
      console.error("Error reblogging post:", error);
      toast.error(error.response?.data?.message || "Failed to reblog post.");
    },
  });
}
