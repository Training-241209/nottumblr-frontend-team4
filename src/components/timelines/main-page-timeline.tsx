import React from "react";
import { useAllPosts } from "@/components/posts/hooks/use-allposts";
import { useAllReblogs } from "@/components/posts/hooks/use-allreblogs";
import PostCard from "@/components/posts/posts-card"; // Adjust path if needed
import ReblogCard from "@/components/posts/reblogs-card"; // Adjust path if needed
import { toast } from "sonner";

interface Post {
  postId: number;
  username: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  bloggerId: number;
  profilePictureUrl?: string | null;
}

interface Reblog {
  reblogId: number;
  bloggerUsername: string;
  originalPostContent: string;
  originalPostUsername: string;
  comment?: string;
  rebloggedAt: string;
  profilePictureUrl?: string;
  originalPostProfilePictureUrl?: string;
  originalPostMediaUrl?: string;
}

// Type guard for Post
const isPost = (item: Post | Reblog): item is Post => {
  return "postId" in item;
};

// Get timestamp for sorting
const getTimestamp = (item: Post | Reblog): string => {
  if ("createdAt" in item) {
    return item.createdAt; // For posts
  } else {
    return item.rebloggedAt; // For reblogs
  }
};

const MainPageTimeline: React.FC = () => {
  const { data: posts, isLoading: postsLoading, error: postsError } = useAllPosts();
  const { data: reblogs, isLoading: reblogsLoading, error: reblogsError } = useAllReblogs();

  // Show loading state
  if (postsLoading || reblogsLoading) {
    return <div className="text-center py-4 text-white">Loading...</div>;
  }

  // Handle errors in fetching posts or reblogs
  if (postsError || reblogsError) {
    toast.error("Error loading timeline.");
    return <div className="text-center py-4 text-red-500">Error loading timeline.</div>;
  }

  // Combine and sort timeline items
  const timelineItems = [
    ...(posts || []).map((post: Post) => ({ ...post, type: "post" })),
    ...(reblogs || []).map((reblog: Reblog) => ({ ...reblog, type: "reblog" })),
  ];

  const sortedItems = timelineItems.sort((a, b) =>
    new Date(getTimestamp(b)).getTime() - new Date(getTimestamp(a)).getTime()
  );

  return (
    <div className="min-w-[600px] max-w-2xl mx-auto">
      <div className="space-y-6">
        {sortedItems.length > 0 ? (
          sortedItems.map((item, index) =>
            isPost(item) ? (
              <PostCard
                key={`post-${item.postId}-${index}`}
                postId={item.postId}
                username={item.username}
                content={item.content}
                mediaUrl={item.mediaUrl}
                mediaType={item.mediaType}
                createdAt={item.createdAt}
                bloggerId={item.bloggerId}
                profilePictureUrl={item.profilePictureUrl}
                onProfileClick={(username) => {
                  window.location.href = `/profile/${username}`;
                }}
              />
            ) : (
              <ReblogCard
                key={`reblog-${item.reblogId}-${index}`}
                reblogId={item.reblogId}
                bloggerUsername={item.bloggerUsername}
                originalPostContent={item.originalPostContent}
                originalPostUsername={item.originalPostUsername}
                comment={item.comment}
                rebloggedAt={item.rebloggedAt}
                profilePictureUrl={item.profilePictureUrl}
                originalPostProfilePictureUrl={item.originalPostProfilePictureUrl}
                originalPostMediaUrl={item.originalPostMediaUrl}
                onProfileClick={(username) => {
                  window.location.href = `/profile/${username}`;
                }}
              />
            )
          )
        ) : (
          <div className="text-center py-4 text-white">No items to display.</div>
        )}
      </div>
    </div>
  );
};

export default MainPageTimeline;
