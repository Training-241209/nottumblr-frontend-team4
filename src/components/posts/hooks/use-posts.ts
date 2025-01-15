import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";


interface Post {
  postId: number;           
  username: string;
  content: string;          
  mediaUrl: string | null;  
  mediaType: string | null; 
  createdAt: string;       
  bloggerId: number;
  profilePictureUrl?: string | null;       
}

export function usePosts(): UseQueryResult<Post[]> {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const resp = await axiosInstance.get("/posts/my-posts");
        console.log("Posts Response:", resp.data);
        
        
        const transformedPosts: Post[] = resp.data.map((post: any) => ({
          postId: post.postId,
          username: post.username,
          content: post.content,
          mediaUrl: post.mediaUrl,
          mediaType: post.mediaType,
          createdAt: post.createdAt,
          bloggerId: post.bloggerId,
          profilePictureUrl: post.profilePictureUrl
        }));
        
        return transformedPosts;
      } catch (e: any) {
        console.error("Error fetching posts:", e);
        toast.error("Failed to load posts. Please try again.");
        throw new Error(e.response?.data?.error || "An error occurred while fetching posts.");
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}