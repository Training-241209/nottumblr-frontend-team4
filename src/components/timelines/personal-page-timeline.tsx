import React from "react";
import { usePosts } from "@/components/posts/hooks/use-posts"; // Import the Post interface
import { useAuth } from "@/components/auth/hooks/use-auth";
import PostCard from "../posts/posts-card";
import { toast } from "sonner";

// Remove the local Post interface since we're importing it

const PersonalTimeline: React.FC = () => {
  const { data: user } = useAuth();
  const { data: posts, isLoading, error } = usePosts();

  if (!user) {
    toast.error("Please log in to view your timeline.");
    return <div className="text-center py-4 text-white">Please log in to view your timeline.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-4 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading posts.</div>;
  }

  return (
    <div className="min-w-[600px] max-w-2xl mx-auto">
      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.postId}
              postId={post.postId}
              username={post.username}
              content={post.content}
              mediaUrl={post.mediaUrl}
              mediaType={post.mediaType}
              createdAt={post.createdAt}
              bloggerId={post.bloggerId}
              profilePictureUrl={post.profilePictureUrl}
              onProfileClick={(username) => {
                window.location.href = `/profile/${username}`;
              }}
            />
          ))
        ) : (
          <div className="text-center py-4 text-white">No posts to display.</div>
        )}
      </div>
    </div>
  );
};

export default PersonalTimeline;