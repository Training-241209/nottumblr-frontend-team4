import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import PostCard from "../posts/posts-card";
import ReblogCard from "../posts/reblogs-card";
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
  bloggerProfilePictureUrl?: string;
  originalPostProfilePictureUrl?: string;
  originalPostMediaUrl?: string;
}

interface TimelinePost extends Post {
  type: 'post';
}

interface TimelineReblog extends Reblog {
  type: 'reblog';
}

type TimelineItem = TimelinePost | TimelineReblog;

// Type guard for Post
const isPost = (item: TimelineItem): item is TimelinePost => {
  return item.type === "post";
};

const getTimestamp = (item: TimelineItem): string => {
  if (isPost(item)) {
    return item.createdAt;
  } else {
    return item.rebloggedAt;
  }
};

interface UserTimelineProps {
  userId: number;
  username?: string;
}

const UserTimeline: React.FC<UserTimelineProps> = ({ userId, username }) => {
  // Fetch user's posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["userPosts", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  // Fetch user's reblogs
  const { data: reblogs, isLoading: reblogsLoading } = useQuery<Reblog[]>({
    queryKey: ["userReblogs", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/reblogs/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  if (postsLoading || reblogsLoading) {
    return <div className="text-center py-4 text-neutral-500">Loading...</div>;
  }

  const timelineItems: TimelineItem[] = [
    ...(posts || []).map((post): TimelinePost => ({ ...post, type: "post" })),
    ...(reblogs || []).map((reblog): TimelineReblog => ({ ...reblog, type: "reblog" })),
  ];

  const sortedItems = timelineItems.sort((a, b) =>
    new Date(getTimestamp(b)).getTime() - new Date(getTimestamp(a)).getTime()
  );

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        {username ? `@${username} hasn't` : "This user hasn't"} posted anything yet.
      </div>
    );
  }

  return (
    <div className="min-w-[600px] max-w-2xl mx-auto">
      <div className="space-y-6">
        {sortedItems.map((item, index) =>
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
        )}
      </div>
    </div>
  );
};

export default UserTimeline;