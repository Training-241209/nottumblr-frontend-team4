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
      const token = localStorage.getItem("jwt"); // Retrieve the token
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      try {
        const resp = await axiosInstance.get("/reblogs/my-reblogs", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        console.log("Reblogs Response:", resp.data);

        return resp.data.map((reblog: any) => ({
          reblogId: reblog.reblogId,
          comment: reblog.comment,
          rebloggedAt: reblog.rebloggedAt,
          bloggerUsername: reblog.bloggerUsername,
          bloggerProfilePictureUrl: reblog.bloggerProfilePictureUrl,
          originalPostContent: reblog.originalPostContent,
          originalPostUsername: reblog.originalPostUsername,
          originalPostProfilePictureUrl: reblog.originalPostProfilePictureUrl,
          originalPostMediaUrl: reblog.originalPostMediaUrl,
        }));
      } catch (e: any) {
        console.error("Error fetching reblogs:", e);
        toast.error("Failed to load reblogs. Please try again.");
        throw new Error(e.response?.data?.error || "An error occurred while fetching reblogs.");
      }
    },
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
    gcTime: 1000 * 60 * 10, // Garbage collect after 10 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
    refetchOnReconnect: false, // Do not refetch on reconnect
  });
}
