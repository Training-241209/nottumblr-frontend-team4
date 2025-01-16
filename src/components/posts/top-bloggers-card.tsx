import React from "react";
import { useTopBloggers } from "@/components/posts/hooks/use-top-bloggers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "@tanstack/react-router";

const BUCKET_NAME = "profilepicturesfbe74-dev";
const BUCKET_REGION = "us-east-1";

const TopBloggersCard: React.FC = () => {
  const { data: bloggers = [], isLoading, isError } = useTopBloggers();
  const router = useRouter();

  const getProfilePictureUrl = (profilePictureKey: string | null | undefined) =>
    profilePictureKey
      ? `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${profilePictureKey}`
      : "/default-avatar.png";

  const handleProfileClick = (username: string) => {
    router.navigate({
      to: username === "currentUser" ? "/dashboard/profile" : "/dashboard/other-profile/$username",
      params: { username },
    });
  };

  return (
    <Card className="bg-neutral text-black dark:text-white w-full max-w-md mx-auto p-1.5">
      <CardHeader className="border-b border-gray-300 dark:border-gray-700 pb-1">
        <CardTitle className="text-sm text-gray-600 dark:text-gray-300 text-center">
          Top Bloggers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {isLoading && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Loading top bloggers...
          </p>
        )}
        {isError && (
          <p className="text-xs text-red-500">Failed to load top bloggers.</p>
        )}
        {!isLoading && !isError && (
          <ul>
            {bloggers.map((blogger, index) => (
              <li
                key={blogger.bloggerId}
                className={`flex items-center space-x-2 py-1.5 ${
                  index < bloggers.length - 1 ? "border-b border-gray-300 dark:border-gray-700" : ""
                }`}
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    src={getProfilePictureUrl(blogger.profilePictureUrl)}
                    alt={blogger.username}
                  />
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                    {blogger.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <button
                    className="font-medium text-gray-800 dark:text-neutral-300 hover:text-gray-600 dark:hover:text-white hover:underline text-xs"
                    onClick={() => handleProfileClick(blogger.username)}
                  >
                    @{blogger.username}
                  </button>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {blogger.followerCount} followers
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TopBloggersCard;