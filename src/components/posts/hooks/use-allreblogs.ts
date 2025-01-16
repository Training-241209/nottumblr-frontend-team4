import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

export function useAllReblogs() {
  return useQuery({
    queryKey: ["allReblogs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/reblogs/all");
      return response.data;
    },
    refetchOnWindowFocus: true,  
    refetchOnMount: true, 
  });
}