// @/components/followers/hooks/use-followers-follow.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/hooks/use-auth";

export const useFollowToggle = (username: string) => {
    const queryClient = useQueryClient();
    const { data: authUser } = useAuth();
  
    // Function to check follow status
    const checkFollowStatus = async (bloggerId: number) => {
      try {
        const response = await axiosInstance.get('/followers/isFollowing', {
          params: {
            followerId: authUser?.bloggerId,
            followeeId: bloggerId
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error checking follow status:', error);
        return false;
      }
    };
  
    const followMutation = useMutation({
      mutationFn: async (bloggerId: number) => {
        try {
          await axiosInstance.post(`/followers/follow/${bloggerId}`);
          return await checkFollowStatus(bloggerId);
        } catch (error: any) {
          if (error.response?.data === "You are already following this blogger.") {
            return true;
          }
          throw error;
        }
      },
      onSuccess: (isFollowing) => {
        queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
        
        if (isFollowing) {
          toast.success(`You are now following @${username}`);
        }
      },
      onError: () => {
        toast.error("Failed to follow user. Please try again.");
      },
    });
  
    const unfollowMutation = useMutation({
      mutationFn: async (bloggerId: number) => {
        await axiosInstance.delete(`/followers/unfollow/${bloggerId}`);
        return await checkFollowStatus(bloggerId);
      },
      onSuccess: (isFollowing) => {
        queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
        
        if (!isFollowing) {
          toast.success(`You have unfollowed @${username}`);
        }
      },
      onError: () => {
        toast.error("Failed to unfollow user. Please try again.");
      },
    });
  
    return {
      follow: (bloggerId: number) => followMutation.mutate(bloggerId),
      unfollow: (bloggerId: number) => unfollowMutation.mutate(bloggerId),
      isFollowLoading: followMutation.isPending || unfollowMutation.isPending,
      checkFollowStatus
    };
  };