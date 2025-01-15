import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

export function useDeleteFollower(bloggerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      await axiosInstance.delete(`/followers/${bloggerId}/${username}`);
    },
    onSuccess: () => {
      toast.success("Follower removed successfully.");
      queryClient.invalidateQueries({
        queryKey: ["followers", bloggerId]
      });
    },
    onError: () => {
      toast.error("Failed to remove follower. Please try again.");
    },
  });
}