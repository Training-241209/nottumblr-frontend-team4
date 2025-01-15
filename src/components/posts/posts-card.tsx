import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Repeat } from "lucide-react";
import { useS3Get } from "@/components/auth/hooks/use-s3-get";

// Update interface to include profilePictureUrl
interface PostCardProps {
  postId: number;
  username: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  bloggerId: number;
  profilePictureUrl: string | null | undefined;
  onProfileClick?: (username: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  username,
  content,
  mediaUrl,
  mediaType,
  createdAt,
  profilePictureUrl,
  onProfileClick
}) => {
  const [showComments, setShowComments] = useState(false);
  const { getImageUrl } = useS3Get();

  const toggleComments = () => setShowComments((prev) => !prev);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onProfileClick) {
      onProfileClick(username);
    }
  };

  return (
<Card className="bg-gray-800 text-white relative overflow-hidden rounded-lg">
  <a
  href={`/profile/${username}`}
  onClick={handleProfileClick}
  className="block transition-colors duration-200"
>
  <CardHeader className="flex flex-row items-center border-b border-gray-700 p-4 hover:bg-gray-700">
    {/* Avatar - Now using getImageUrl */}
    <img
      src={getImageUrl(profilePictureUrl, '', '/default-avatar.png')}
      alt={`${username}'s avatar`}
      className="w-12 h-12 rounded-full object-cover"
    />
    {/* Username */}
    <div className="ml-4">
      <p className="text-gray-400">@{username}</p>
    </div>
  </CardHeader>
</a>

      {/* Post Content */}
      <CardContent className="p-4">
        <p className="mb-4">{content}</p>
        {mediaUrl && mediaType === 'image' && (
          <img
            src={getImageUrl(mediaUrl, 'post-images')}
            alt="Post content"
            className="rounded-lg w-full h-auto"
          />
        )}
        <p className="text-sm text-gray-400 mt-2">
          {new Date(createdAt).toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="flex justify-end items-center space-x-4 border-t border-gray-700 pt-4 px-4">
        {/* Like Button */}
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Heart size={20} />
          <span>Like</span>
        </button>
        {/* Comment Button */}
        <button
          onClick={toggleComments}
          className="flex items-center space-x-2 text-gray-300 hover:text-white"
        >
          <MessageCircle size={20} />
          <span>Comments</span>
        </button>
        {/* Reblog Button */}
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Repeat size={20} />
          <span>Reblog</span>
        </button>
      </CardFooter>

      {showComments && (
        <div className="p-4 mt-4 border-t border-gray-700">
          <h4 className="text-gray-400 mb-2">Comments</h4>
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;