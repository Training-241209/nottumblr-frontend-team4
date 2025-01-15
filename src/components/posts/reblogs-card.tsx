import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { useS3Get } from "@/components/auth/hooks/use-s3-get";
import { useLikes } from "@/components/posts/hooks/use-likes";

interface ReblogCardProps {
  reblogId: number;
  bloggerUsername: string;
  originalPostContent: string;
  originalPostUsername: string;
  comment?: string;
  rebloggedAt: string;
  profilePictureUrl?: string | null; // Blogger's profile picture
  originalPostProfilePictureUrl?: string | null; // Original post blogger's profile picture
  originalPostMediaUrl?: string | null; // Original post media URL
  onProfileClick?: (username: string) => void;
}

const ReblogCard: React.FC<ReblogCardProps> = ({
  reblogId,
  bloggerUsername,
  originalPostContent,
  originalPostUsername,
  comment,
  rebloggedAt,
  profilePictureUrl,
  originalPostProfilePictureUrl,
  originalPostMediaUrl,
  onProfileClick,
}) => {
  const { getImageUrl } = useS3Get();
  const { likeCount, isLiked, currentUserLikeId, addLike, removeLike } =
    useLikes(reblogId);

  const handleLikeClick = () => {
    if (isLiked && currentUserLikeId) {
      removeLike(currentUserLikeId);
    } else {
      addLike();
    }
  };

  const handleProfileClick = (username: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onProfileClick) {
      onProfileClick(username);
    }
  };

  return (
    <Card className="bg-transparent text-white relative overflow-hidden rounded-lg shadow-md">
      {/* Reblogged Header */}
      <div className="text-gray-400 text-sm p-2">
        <a
          href={`/profile/${bloggerUsername}`}
          onClick={(e) => handleProfileClick(bloggerUsername, e)}
          className="font-medium text-white hover:underline"
        >
          @{bloggerUsername}
        </a>{" "}
        reblogged
      </div>

      <CardContent className="p-4">
        {/* Reblog Comment */}
        {comment && (
          <p className="text-base text-gray-300 mb-4 border-b border-gray-700 pb-4">
            {comment}
          </p>
        )}

        {/* Original Post Preview */}
        <div>
          <div className="flex items-center mb-2">
            <img
              src={getImageUrl(
                originalPostProfilePictureUrl,
                "",
                "/default-avatar.png"
              )}
              alt={`${originalPostUsername}'s avatar`}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="ml-3">
              <a
                href={`/profile/${originalPostUsername}`}
                onClick={(e) => handleProfileClick(originalPostUsername, e)}
                className="text-sm font-medium text-white hover:underline"
              >
                @{originalPostUsername}
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-300">{originalPostContent}</p>
          {originalPostMediaUrl && (
            <img
              src={getImageUrl(originalPostMediaUrl, "post-images")}
              alt="Original post media"
              className="rounded-lg w-full h-auto mt-3"
            />
          )}
        </div>

        {/* Reblogged At Timestamp */}
        <p className="text-xs text-gray-500 mt-4">
          Reblogged at {new Date(rebloggedAt).toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="flex justify-end items-center space-x-4 border-t border-gray-700 pt-4 px-4">
        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 ${
            isLiked ? "text-pink-500" : "text-gray-300 hover:text-white"
          }`}
        >
          <Heart size={20} className={isLiked ? "fill-current" : ""} />
          <span>
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
        </button>
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <MessageCircle size={20} />
          <span>Comments</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default ReblogCard;
