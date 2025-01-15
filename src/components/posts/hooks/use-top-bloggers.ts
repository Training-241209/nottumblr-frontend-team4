import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

interface Blogger {
  bloggerId: number;
  username: string;
  followerCount: number;
  profilePictureUrl?: string;
}

export function useTopBloggers(limit: number = 5) {
  return useQuery<Blogger[]>({
    queryKey: ["topBloggers", limit],
    queryFn: async () => {
      const response = await axiosInstance.get(`/followers/top-bloggers?limit=${limit}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // Cache the result for 10 minutes
  });
}
