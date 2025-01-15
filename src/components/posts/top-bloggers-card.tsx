import React from "react";
import { useTopBloggers } from "@/components/posts/hooks/use-top-bloggers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TopBloggersCard: React.FC = () => {
  const { data: bloggers = [], isLoading, isError } = useTopBloggers();

  return (
    <Card className="w-full max-w-md mx-auto p-1.5"> {/* Smaller padding */}
      <CardHeader className="border-b border-neutral-700 pb-1"> {/* Adjusted bottom padding */}
        <CardTitle className="text-sm"> {/* Reduced font size */}
          Top Bloggers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5"> {/* Reduced spacing between items */}
        {isLoading && <p className="text-xs">Loading top bloggers...</p>} {/* Smaller font */}
        {isError && <p className="text-xs text-red-500">Failed to load top bloggers.</p>} {/* Smaller font */}
        {!isLoading && !isError && (
          <ul>
            {bloggers.map((blogger, index) => (
              <li
                key={blogger.bloggerId}
                className={`flex items-center space-x-2 py-1.5 ${
                  index < bloggers.length - 1 ? "border-b border-neutral-800" : ""
                }`}
              >
                <Avatar className="w-9 h-9"> {/* Further reduced avatar size */}
                  <AvatarImage
                    src={blogger.profilePictureUrl || "/default-avatar.png"}
                    alt={blogger.username}
                  />
                  <AvatarFallback>
                    {blogger.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-400 text-xs">@{blogger.username}</p> {/* Smaller font */}
                  <p className="text-xs text-gray-500">{blogger.followerCount} followers</p> {/* Smaller font */}
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
