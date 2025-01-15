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
      return response.data.followers; // Assuming the API returns { followers: [] }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}
