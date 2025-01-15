import React, { useState, useEffect, useRef } from "react";
import PostCard from "../posts/posts-card";
import { useRouter } from "@tanstack/react-router";
import { axiosInstance } from "@/lib/axios-config";

interface Post {
  postId: number;
  username: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  bloggerId: number;
  profilePictureUrl: string | null | undefined;  // Added profilePictureUrl
}

const Timeline: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get("/posts/timeline");
      const newPosts: Post[] = response.data.map((post: any) => ({
        postId: post.postId,
        username: post.username,
        content: post.content,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        createdAt: post.createdAt,
        bloggerId: post.bloggerId,
        profilePictureUrl: post.profilePictureUrl  // Added profilePictureUrl
      }));

      setPosts((prev) => [...prev, ...newPosts]);
    } catch (error) {
      console.error("Error fetching timeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (bottomRef.current) {
      const bottom = bottomRef.current.getBoundingClientRect().bottom;
      if (bottom <= window.innerHeight) {
        fetchData();
      }
    }
  };

  useEffect(() => {
    fetchData(); // Initial load
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-w-[600px] max-w-2xl mx-auto">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.postId}
            postId={post.postId}
            username={post.username}
            content={post.content}
            mediaUrl={post.mediaUrl}
            mediaType={post.mediaType}
            createdAt={post.createdAt}
            bloggerId={post.bloggerId}
            profilePictureUrl={post.profilePictureUrl || null}  // Added profilePictureUrl
            onProfileClick={(username) => {
              router.navigate({ to: `/dashboard/profile/${username}` });
            }}
          />
        ))}
      </div>
      {loading && <div className="text-center py-4 text-white">Loading...</div>}
      <div ref={bottomRef} className="h-10"></div>
    </div>
  );
};

export default Timeline;