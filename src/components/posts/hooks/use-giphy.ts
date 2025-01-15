import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface Gif {
  id: string;
  title: string;
  mediaUrl: string;
}

interface GiphyResponse {
  data: Array<{
    id: string;
    title: string;
    images: {
      fixed_height: {
        url: string;
      };
    };
  }>;
}

const GIPHY_API_URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "jSKmqD5XyEE9hvfrz8bH7Osc7ua8oJOv"; 

export function useGiphy(query: string): UseQueryResult<Gif[]> {
  return useQuery({
    queryKey: ["giphy", query],
    queryFn: async () => {
      if (!query.trim()) {
        return []; 
      }

      try {
        const resp = await fetch(`${GIPHY_API_URL}?api_key=${API_KEY}&q=${query}&limit=25&rating=g`);
        if (!resp.ok) {
          throw new Error("Failed to fetch GIFs");
        }
        const data: GiphyResponse = await resp.json();

        // Transform the response data to fit the Gif interface
        return data.data.map((gif) => ({
          id: gif.id,
          title: gif.title,
          mediaUrl: gif.images.fixed_height.url,
        }));
      } catch (e: any) {
        console.error("Error fetching GIFs:", e);
        toast.error("Failed to fetch GIFs. Please try again.");
        throw new Error(e.message || "An error occurred while fetching GIFs.");
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!query.trim(), // Prevents query from running if the query string is empty
  });
}
