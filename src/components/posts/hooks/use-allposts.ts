import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

export function useAllPosts() {
  return useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const response = await axiosInstance.get("/posts/all");
      return response.data;
    },
    refetchOnWindowFocus: true,  
    refetchOnMount: true, 
  });
}