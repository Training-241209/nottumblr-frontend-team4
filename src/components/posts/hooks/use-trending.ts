import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

// Define the shape of the data returned by /posts/trending
export interface TrendingPostsDTO {
  postId: number;
  content: string;
  username: string;
  profilePictureUrl?: string;
  mediaUrl?: string;
  mediaType?: string;
  likeCount: number;
  commentCount: number;
  reblogCount: number;
  totalInteractions: number;
}

// Our custom hook
export function useTrendingPost() {
  return useQuery<TrendingPostsDTO>({
    queryKey: ["trendingPost"],
    queryFn: async () => {
      const response = await axiosInstance.get<TrendingPostsDTO>("/posts/trending");
      return response.data; 
    },
  });

}
