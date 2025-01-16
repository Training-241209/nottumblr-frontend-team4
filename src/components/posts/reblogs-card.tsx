import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageCircle, SendHorizontal, Trash2 } from "lucide-react";
import { useS3Get } from "@/components/auth/hooks/use-s3-get";
import { useLikes } from "@/components/posts/hooks/use-likes";
import { useComments } from "@/components/posts/hooks/use-comments";
import { useAuth } from "../auth/hooks/use-auth";
import { useRouter } from "@tanstack/react-router";
import { useDeleteReblog } from "@/components/posts/hooks/use-delete-reblogs";


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
  onDelete?: (postId: number) => void;
  currentuser?: string;
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
  onDelete,
  currentuser
}) => {
  const { getImageUrl } = useS3Get();
  const { likeCount, isLiked, currentUserLikeId, addLike, removeLike } =
    useLikes(reblogId, "reblog");
  const {
    comments,
    createComment,
    deleteComment,
    isAddingComment,
    isDeletingComment,
  } = useComments(reblogId, "reblog");

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { data: currentUser } = useAuth();

  const router = useRouter();

  const handleLikeClick = () => {
    if (isLiked && currentUserLikeId) {
      removeLike(currentUserLikeId);
    } else {
      addLike();
    }
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  const handleProfileClick = (e: React.MouseEvent, username: string) => {
    e.preventDefault();
    if (username === currentUser?.username) {
      // Redirect to the current user's profile
      router.navigate({
        to: "/dashboard/profile",
      });
    } else {
      // Redirect to another user's profile
      router.navigate({
        to: "/dashboard/other-profile/$username",
        params: { username },
      });
    }
  };

  return (
    <Card className="bg-neutral text-white relative overflow-hidden rounded-lg">
      {/* Reblogged Header */}
      <div className="bg-gray-300 dark:bg-gray-700 text-black dark:text-gray-400 text-sm p-2 pl-4">
        <a
          href={`/profile/${bloggerUsername}`}
          onClick={(e) => {
            e.preventDefault();
            console.log("hi");
            handleProfileClick(e, bloggerUsername);
          }}
          className="font-medium text-black dark:text-white hover:underline"
        >
          @{bloggerUsername}
        </a>{" "}
        reblogged
      </div>

      <CardContent className="p-4">
        {/* Reblog Comment */}
        {comment && (
          <p className="italic text-gray-600 dark:text-gray-300 mb-4 border-l-2 border-gray-700 pl-4">
            {comment}
          </p>
        )}

        {/* Original Post Preview */}
        <div className="flex items-center mb-2">
          <a
            href={`/profile/${originalPostUsername}`}
            onClick={(e) => handleProfileClick(e, originalPostUsername)}
            className="flex items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg p-2 transition duration-200"
          >
            <img
              src={getImageUrl(
                originalPostProfilePictureUrl,
                "",
                "/default-avatar.png"
              )}
              alt={`${originalPostUsername}'s avatar`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <p className="text-black dark:text-neutral-200">
                @{originalPostUsername}
              </p>
            </div>
          </a>
        </div>

        <p className="text-black dark:text-neutral-200">
          {originalPostContent}
        </p>
        {originalPostMediaUrl && (
          <img
            src={getImageUrl(originalPostMediaUrl, "post-images")}
            alt="Original post media"
            className="rounded-lg w-full h-auto mt-2"
          />
        )}

        <p className="text-sm text-gray-400 mt-2">
          Reblogged at {new Date(rebloggedAt).toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="flex justify-end items-center space-x-4 border-t border-gray-700 pt-4 px-4">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 ${
            isLiked
              ? "text-pink-500"
              : "text-gray-800 hover:text-gray-300 dark:text-gray-300 dark:hover:text-white"
          }`}
        >
          <Heart size={20} className={isLiked ? "fill-current" : ""} />
          <span>
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
        </button>
        <button
          onClick={toggleComments}
          className="flex items-center space-x-2 text-gray-800 hover:text-gray-300 dark:text-gray-300 dark:hover:text-white"
        >
          <MessageCircle size={20} />
          <span>Comments</span>
        </button>
        {" "}
        {/* Conditionally show the trash icon if the current user owns the post */}
        {currentUser?.username === bloggerUsername && onDelete && (
          <button
            onClick={() => onDelete(reblogId)}
            className="flex items-center space-x-1 text-red-500 hover:text-red-700"
            aria-label="Delete Post"
          >
            <Trash2 size={12} />
          </button>
        )}
      </CardFooter>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 mt-4 border-t border-gray-300 dark:border-gray-700">
          <h4 className="text-gray-600 dark:text-gray-400 mb-4">Comments</h4>

          {/* Comments list */}
          {comments.map((comment) => (
            <div
              key={comment.commentId}
              className="flex items-start mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"
            >
              <div className="flex-grow">
                <p className="text-sm text-black dark:text-white font-medium">
                  @{comment.bloggerUsername}
                </p>
                <p className="text-sm text-black dark:text-gray-300">
                  {comment.content}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              {currentUser?.username === comment.bloggerUsername && (
                <button
                  onClick={() => deleteComment(comment.commentId)}
                  className="ml-4 text-red-500 hover:text-red-700"
                  aria-label="Delete Comment"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}

          {/* Add comment form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (commentText.trim()) {
                createComment(commentText);
                setCommentText("");
              }
            }}
          >
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-grow p-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="ml-2 text-gray-800 hover:text-gray-600 dark:text-neutral-200 dark:hover:text-white"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};

export default ReblogCard;
