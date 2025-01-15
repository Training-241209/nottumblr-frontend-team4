import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";

interface Reblog {
    reblogId: number;
    comment?: string;
    rebloggedAt: string;
    bloggerUsername: string;
    bloggerProfilePictureUrl?: string | null;
    originalPostContent: string;
    originalPostUsername: string;
    originalPostProfilePictureUrl?: string | null;
    originalPostMediaUrl?: string | null;
  }
  

export function useReblogs(): UseQueryResult<Reblog[]> {
  return useQuery({
    queryKey: ["reblogs"],
    queryFn: async () => {
      try {
        const resp = await axiosInstance.get("/reblogs/my-reblogs");
        console.log("Reblogs Response:", resp.data);

        return resp.data;
      } catch (e: any) {
        console.error("Error fetching reblogs:", e);
        toast.error("Failed to load reblogs. Please try again.");
        throw new Error(e.response?.data?.error || "An error occurred while fetching reblogs.");
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
