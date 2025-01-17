import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

import { useS3Get } from "@/components/auth/hooks/use-s3-get";
import { useTrendingPost } from "@/components/posts/hooks/use-trending"; 


const TrendingPostCard: React.FC = () => {
  const { getImageUrl } = useS3Get();
  const router = useRouter();

  const { data: trendingPost, isLoading, isError } = useTrendingPost();

  

  if (isLoading) {
    return (
      <Card className="bg-neutral text-black dark:text-white w-full max-w-md mx-auto p-1.5">
        <CardContent className="flex items-center justify-center h-32">
          Loading trending post...
        </CardContent>
      </Card>
    );
  }

  if (isError || !trendingPost) {
    // Either show an error or "no trending post found" message
    return (
      <Card className="bg-neutral text-black dark:text-white w-full max-w-md mx-auto p-1.5">
        <CardContent className="text-center text-red-500">
          No trending post found.
        </CardContent>
      </Card>
    );
  }


  // 3) Render the trending post data
  const handleProfileClick = (username: string) => {
    router.navigate({
      to: "/dashboard/other-profile/$username",
      params: { username },
    });
  };

  return (
    <Card className="bg-neutral text-black dark:text-white w-full max-w-md mx-auto p-1.5">
      <CardHeader className="border-b border-gray-300 dark:border-gray-700 pb-1">
        <CardTitle className="text-sm text-gray-600 dark:text-gray-300 text-center">
          Top Post Today!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {/* User Info */}
        <div className="flex items-center space-x-2">
          <img
            src={getImageUrl(
              trendingPost.profilePictureUrl,
              "",
              "/default-avatar.png"
            )}
            alt={trendingPost.username}
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={() => handleProfileClick(trendingPost.username)}
            className="text-gray-800 dark:text-neutral-300 hover:underline"
          >
            @{trendingPost.username}
          </button>
        </div>

        {/* Post Content */}
        <p className="text-black dark:text-neutral-200">
          {trendingPost.content}
        </p>

        {/* Media (if any) */}
        {trendingPost.mediaUrl && trendingPost.mediaType === "image" && (
          <img
            src={getImageUrl(trendingPost.mediaUrl, "post-images")}
            alt="Post content"
            className="rounded-lg w-full max-h-32 object-contain"
          />
        )}

        {/* Interaction Stats */}
        <div className="inline-flex w-full justify-end items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 pt-2">
          <Heart size={16} />
          <span>{trendingPost.likeCount}</span>
          <MessageCircle size={16} />
          <span>{trendingPost.commentCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingPostCard;
