import React from "react";
import { useAllPosts } from "@/components/posts/hooks/use-allposts"; // Hook for fetching all posts
import { useAllReblogs } from "@/components/posts/hooks/use-allreblogs"; // Hook for fetching all reblogs
import PostCard from "@/components/posts/posts-card"; 
import ReblogCard from "@/components/posts/reblogs-card";
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

// Helper to get timestamp for sorting
const getTimestamp = (item: Post | Reblog): string => {
  return isPost(item) ? item.createdAt : item.rebloggedAt;
};

const CommunityTimeline: React.FC<{ communityName: string }> = ({ communityName }) => {
  // Fetch all posts and all reblogs
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useAllPosts();

  const {
    data: reblogs = [],
    isLoading: reblogsLoading,
    error: reblogsError,
  } = useAllReblogs();

  // Display loading state
  if (postsLoading || reblogsLoading) {
    return <div className="text-center py-4 text-white">Loading...</div>;
  }

  // Handle errors
  if (postsError || reblogsError) {
    toast.error("Error loading community timeline.");
    return (
      <div className="text-center py-4 text-red-500">
        Error loading community timeline.
      </div>
    );
  }

  /**
   * Filter posts and reblogs by the community hashtag.
   * For posts, we check `post.content`.
   * For reblogs, we check both `reblog.comment` and `reblog.originalPostContent`.
   */
  const timelineItems = [
    ...(posts as Post[])
      .filter(post => post.content.includes(`#${communityName}`))
      .map(post => ({ ...post, type: "post" as const })),
      
    ...(reblogs as Reblog[])
      .filter(reblog =>
        reblog.comment?.includes(`#${communityName}`) ||
        reblog.originalPostContent.includes(`#${communityName}`)
      )
      .map(reblog => ({ ...reblog, type: "reblog" as const }))
  ];

  // Sort items by timestamp (descending)
  const sortedItems = timelineItems.sort(
    (a, b) =>
      new Date(getTimestamp(b)).getTime() -
      new Date(getTimestamp(a)).getTime()
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
                onProfileClick={(username) =>
                  (window.location.href = `/profile/${username}`)
                }
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
                originalPostProfilePictureUrl={
                  item.originalPostProfilePictureUrl
                }
                originalPostMediaUrl={item.originalPostMediaUrl}
                onProfileClick={(username) =>
                  (window.location.href = `/profile/${username}`)
                }
              />
            )
          )
        ) : (
          <div className="text-center py-4 text-white">
            No items in #{communityName} community.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityTimeline;
