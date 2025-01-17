import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Repeat,
  SendHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useS3Get } from "@/components/auth/hooks/use-s3-get";
import { useLikes } from "@/components/posts/hooks/use-likes";
import { useReblogMutation } from "@/components/posts/hooks/use-reblog-mutation";
import { useComments } from "@/components/posts/hooks/use-comments";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/hooks/use-auth";
import { useRouter } from "@tanstack/react-router";

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
  onDelete?: (postId: number) => void;
  currentUser?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  username,
  content,
  mediaUrl,
  mediaType,
  createdAt,
  profilePictureUrl,
  isReblog,
  originalUsername,
  originalPostContent,
  onDelete
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showReblogModal, setShowReblogModal] = useState(false);
  const [reblogComment, setReblogComment] = useState("");
  const [commentText, setCommentText] = useState("");

  const { getImageUrl } = useS3Get();
  const { likeCount, isLiked, currentUserLikeId, addLike, removeLike } =
    useLikes(postId, "post");
  const reblogMutation = useReblogMutation();
  const {
    comments,
    createComment,
    deleteComment
  } = useComments(postId, "post");

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

  const handleProfileClick = (e: React.MouseEvent) => {
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
      <Card className="bg-neutral text-white relative overflow-hidden rounded-lg">
        {/* Reblog Header */}
        {isReblog && originalUsername && (
          <div className="bg-gray-700 text-black text-sm p-2 pl-4">
            Reblogged from @{originalUsername}
          </div>
        )}

        <a
          href={`/profile/${username}`}
          onClick={handleProfileClick}
          className="block transition-colors duration-200"
        >
          <CardHeader className="flex flex-row items-center border-b border-gray-700 p-4 hover:bg-gray-300 dark:hover:bg-gray-700">
            <img
              src={getImageUrl(profilePictureUrl, "", "/default-avatar.png")}
              alt={`${username}'s avatar`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <p className="text-black dark:text-neutral-200">@{username}</p>
            </div>
          </CardHeader>
        </a>

        <CardContent className="p-4">
          {isReblog && originalPostContent && (
            <p className="italic text-gray-300 mb-4 border-l-2 border-gray-700 pl-4">
              {originalPostContent}
            </p>
          )}
          <p className="text-black dark:text-neutral-200 pb-4">{content}</p>
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

          <button
            onClick={() => setShowReblogModal(true)}
            className="flex items-center space-x-2 text-gray-800 hover:text-gray-300 dark:text-gray-300 dark:hover:text-white"
          >
            <Repeat size={20} />
            <span>Reblog</span>
          </button>

          {currentUser?.username === username && onDelete && (
            <button
              onClick={() => onDelete(postId)}
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

      {showReblogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-neutral-800 text-black dark:text-white relative overflow-hidden rounded-lg w-full max-w-md shadow-xl">
            <div className="border-b border-gray-200 dark:border-neutral-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Reblog Post
              </h2>
              <button
                onClick={() => setShowReblogModal(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <Textarea
                placeholder="Add a comment to your reblog (optional)"
                value={reblogComment}
                onChange={(e) => setReblogComment(e.target.value)}
                className="w-full mb-4 bg-gray-100 dark:bg-neutral-700 text-black dark:text-white border border-gray-300 dark:border-neutral-600 min-h-[100px] focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-700 p-4 flex justify-end space-x-4">
              <Button
                onClick={handleReblogSubmit}
                variant="outline"
                size="lg"
                className="!bg-white dark:!bg-neutral-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600"
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
