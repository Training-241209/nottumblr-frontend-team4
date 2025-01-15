import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageCircle, Repeat, X } from "lucide-react";
import { useS3Get } from "@/components/auth/hooks/use-s3-get";
import { useLikes } from "@/components/posts/hooks/use-likes";
import { useReblogMutation } from "@/components/posts/hooks/use-reblog-mutation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  isReblog?: boolean;
  originalUsername?: string;
  originalPostContent?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  username,
  content,
  mediaUrl,
  mediaType,
  createdAt,
  profilePictureUrl,
  onProfileClick,
  isReblog,
  originalUsername,
  originalPostContent,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showReblogModal, setShowReblogModal] = useState(false);
  const [reblogComment, setReblogComment] = useState("");

  const { getImageUrl } = useS3Get();
  const { likeCount, isLiked, currentUserLikeId, addLike, removeLike } =
    useLikes(postId);
  const reblogMutation = useReblogMutation();

  const handleLikeClick = () => {
    if (isLiked && currentUserLikeId) {
      removeLike(currentUserLikeId);
    } else {
      addLike();
    }
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onProfileClick) {
      onProfileClick(username);
    }
  };

  const handleReblogSubmit = () => {
    reblogMutation.mutate(
      { postId, comment: reblogComment },
      {
        onSuccess: () => {
          setShowReblogModal(false);
          setReblogComment("");
        },
      }
    );
  };

  return (
    <>
      <Card className="bg-gray-800 text-white relative overflow-hidden rounded-lg">
        {/* Reblog Header */}
        {isReblog && originalUsername && (
          <div className="bg-gray-700 text-gray-300 text-sm p-2 pl-4">
            Reblogged from @{originalUsername}
          </div>
        )}

        <a
          href={`/profile/${username}`}
          onClick={handleProfileClick}
          className="block transition-colors duration-200"
        >
          <CardHeader className="flex flex-row items-center border-b border-gray-700 p-4 hover:bg-gray-700">
            <img
              src={getImageUrl(profilePictureUrl, "", "/default-avatar.png")}
              alt={`${username}'s avatar`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <p className="text-gray-400">@{username}</p>
            </div>
          </CardHeader>
        </a>

        <CardContent className="p-4">
          {isReblog && originalPostContent && (
            <p className="italic text-gray-300 mb-4 border-l-2 border-gray-700 pl-4">
              {originalPostContent}
            </p>
          )}
          <p>{content}</p>
          {mediaUrl && mediaType === "image" && (
            <img
              src={getImageUrl(mediaUrl, "post-images")}
              alt="Post content"
              className="rounded-lg w-full h-auto"
            />
          )}
          <p className="text-sm text-gray-400 mt-2">
            {new Date(createdAt).toLocaleString()}
          </p>
        </CardContent>

        <CardFooter className="flex justify-end items-center space-x-4 border-t border-gray-700 pt-4 px-4">
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

          <button
            onClick={toggleComments}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <MessageCircle size={20} />
            <span>Comments</span>
          </button>

          <button
            onClick={() => setShowReblogModal(true)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
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

      {showReblogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral-800 text-white relative overflow-hidden rounded-lg w-full max-w-md shadow-xl">
            <div className="border-b border-neutral-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Reblog Post</h2>
              <button
                onClick={() => setShowReblogModal(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <Textarea
                placeholder="Add a comment to your reblog (optional)"
                value={reblogComment}
                onChange={(e) => setReblogComment(e.target.value)}
                className="w-full mb-4 bg-neutral-700 text-white border-none min-h-[100px]"
              />
            </div>

            <div className="border-t border-neutral-700 p-4 flex justify-end space-x-4">
              <Button
                onClick={handleReblogSubmit}
                variant="outline"
                size="lg"
                className="!bg-white text-black hover:bg-black hover:text-white"
              >
                Reblog
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
