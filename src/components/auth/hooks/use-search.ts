// hooks/use-search-bloggers.ts
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

interface BloggerDTO {
  bloggerId: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePictureUrl: string;
  roleName: string;
}

export function useSearchBloggers(searchTerm: string) {
  return useQuery<BloggerDTO[]>({
    queryKey: ["bloggers", "search", searchTerm],
    queryFn: async () => {
      const response = await axiosInstance.get("/bloggers/search", {
        params: { searchTerm }
      });
      return response.data;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}