import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useTopBloggers } from "@/components/posts/hooks/use-top-bloggers";
import { useAuth } from "@/components/auth/hooks/use-auth";
import { axiosInstance } from "@/lib/axios-config";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function ExplorePage() {
  const { data: bloggers = [], isLoading, isError } = useTopBloggers();
  const { data: authUser } = useAuth();
  const [followedUsers, setFollowedUsers] = useState<Record<number, boolean>>({});

  const fetchFollowStatus = async (bloggerId: number) => {
    const response = await axiosInstance.get('/followers/isFollowing', {
      params: {
        followerId: authUser?.bloggerId,
        followeeId: bloggerId,
      },
    });
    return response.data; // Should return a boolean
  };

  const { data: displayedBloggers } = useQuery({
    queryKey: ["displayedBloggers"],
    queryFn: async () => {
      // Filter out the current user and shuffle
      const otherBloggers = bloggers.filter(
        (blogger) => blogger.bloggerId !== authUser?.bloggerId
      );
      return otherBloggers.sort(() => Math.random() - 0.5);
    },
    enabled: !isLoading && !isError,
  });

  useEffect(() => {
    if (displayedBloggers) {
      const fetchFollowStates = async () => {
        const states: Record<number, boolean> = {};
        for (const blogger of displayedBloggers) {
          const isFollowing = await fetchFollowStatus(blogger.bloggerId);
          states[blogger.bloggerId] = isFollowing;
        }
        setFollowedUsers(states);
      };
      fetchFollowStates();
    }
  }, [displayedBloggers]);

  const followMutation = useMutation({
    mutationFn: async (bloggerId: number) => {
      await axiosInstance.post(`/followers/follow/${bloggerId}`);
      return bloggerId;
    },
    onSuccess: (bloggerId: number) => {
      setFollowedUsers((prev) => ({ ...prev, [bloggerId]: true }));
      toast.success("You are now following this user.");
    },
    onError: () => {
      toast.error("Failed to follow user. Please try again.");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (bloggerId: number) => {
      await axiosInstance.delete(`/followers/unfollow/${bloggerId}`);
      return bloggerId;
    },
    onSuccess: (bloggerId: number) => {
      setFollowedUsers((prev) => ({ ...prev, [bloggerId]: false }));
      toast.success("You have unfollowed this user.");
    },
    onError: () => {
      toast.error("Failed to unfollow user. Please try again.");
    },
  });

  const handleFollowToggle = (bloggerId: number, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate(bloggerId);
    } else {
      followMutation.mutate(bloggerId);
    }
  };

  const MAX_BLOGGERS = 12;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center h-full">
        <h1 className="text-3xl font-bold">Explore</h1>
      </div>

          {/* Trending Hashtags */}
          <section>
        <h2 className="text-xl font-semibold mb-4">Trending Hashtags</h2>
        <div className="flex flex-wrap gap-2">
          {["#Aesthetic", "#Anime", "#Community Spotlight", "#Books & Literature", "#Gaming", "#Art", "#Movies", "#TV Shows", "#Culture"].map((tag, index) => (
            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Suggested People</h2>
        {isLoading && <p>Loading suggested people...</p>}
        {isError && <p>Failed to load suggested people.</p>}
        {displayedBloggers && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedBloggers.slice(0, MAX_BLOGGERS).map((blogger) => (
              <Card key={blogger.bloggerId} className="hover:shadow-lg">
                <CardHeader className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={blogger.profilePictureUrl || "/default-avatar.png"}
                      alt={blogger.username}
                    />
                    <AvatarFallback>{blogger.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{blogger.username}</p>
                    <p className="text-sm text-gray-500">{blogger.followerCount} followers</p>
                  </div>
                </CardHeader>
                <CardFooter>
                  {authUser?.bloggerId !== blogger.bloggerId && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        handleFollowToggle(blogger.bloggerId, followedUsers[blogger.bloggerId])
                      }
                      variant={followedUsers[blogger.bloggerId] ? "outline" : "default"}
                    >
                      {followedUsers[blogger.bloggerId] ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
