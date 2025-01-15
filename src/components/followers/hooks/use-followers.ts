import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

interface Follower {
  username: string;
  profilePictureUrl?: string;
}

export function useFollowers(bloggerId: number): UseQueryResult<Follower[]> {
  return useQuery({
    queryKey: ["followers", bloggerId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/followers/${bloggerId}`);
      
      // Directly return the array since the API returns it in this format
      return response.data.map((follower: Follower) => ({
        username: follower.username,
        profilePictureUrl: follower.profilePictureUrl || "/default-avatar.png", // fallback for missing images
      }));
    },
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });
}
