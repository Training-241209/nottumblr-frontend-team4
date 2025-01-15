import React from "react";
import { usePosts } from "@/components/posts/hooks/use-posts"; // Hook for fetching posts
import { useReblogs } from "@/components/posts/hooks/use-reblogs"; // Hook for fetching reblogs
import { useAuth } from "@/components/auth/hooks/use-auth"; // Authentication hook
import PostCard from "../posts/posts-card"; // Component for posts
import ReblogCard from "../posts/reblogs-card"; // Component for reblogs
import { toast } from "sonner"; // For notifications

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
}

// Type guard for Post
const isPost = (item: Post | Reblog): item is Post => {
  return "postId" in item;
};

const getTimestamp = (item: Post | Reblog): string => {
  return "createdAt" in item ? item.createdAt : item.rebloggedAt;
};

const CommunityTimeline: React.FC<{ communityName: string }> = ({ communityName }) => {
  const { data: user } = useAuth();
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const { data: reblogs, isLoading: reblogsLoading, error: reblogsError } = useReblogs();

  if (!user) {
    toast.error("Please log in to view the community timeline.");
    return (
      <div className="text-center py-4 text-white">
        Please log in to view the community timeline.
      </div>
    );
  }

  if (postsLoading || reblogsLoading) {
    return <div className="text-center py-4 text-white">Loading...</div>;
  }

  if (postsError || reblogsError) {
    return (
      <div className="text-center py-4 text-red-500">
        Error loading community timeline.
      </div>
    );
  }

  // Filter items based on community hashtag
  const timelineItems = [
    ...(posts || [])
      .filter((post) => post.content.includes(`#${communityName}`))
      .map((post) => ({ ...post, type: "post" })),
    ...(reblogs || [])
      .filter((reblog) => reblog.comment?.includes(`#${communityName}`) || reblog.originalPostContent.includes(`#${communityName}`))
      .map((reblog) => ({ ...reblog, type: "reblog" })),
  ];

  // Sort items by timestamp
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
                profilePictureUrl={item.bloggerProfilePictureUrl}
                originalPostProfilePictureUrl={item.originalPostProfilePictureUrl}
                originalPostMediaUrl={item.originalPostMediaUrl}
                onProfileClick={(username) => {
                  window.location.href = `/profile/${username}`;
                }}
              />
            )
          )
        ) : (
          <div className="text-center py-4 text-white">No items in #{communityName} community.</div>
        )}
      </div>
    </div>
  );
};

export default CommunityTimeline;
