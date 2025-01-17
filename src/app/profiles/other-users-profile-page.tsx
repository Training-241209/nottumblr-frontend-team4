import { useState } from "react";
import { useAuth } from "@/components/auth/hooks/use-auth";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";
import { Button } from "@/components/ui/button";
import UserTimeline from "@/components/timelines/other-user-timeline";
import FollowersList from "@/components/followers/followers-list";
import { useFollowToggle } from "@/components/followers/hooks/use-followers-follow";

interface UserProfile {
  bloggerId: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  isFollowing?: boolean;
}

const OtherUserProfile = () => {
  const [activeSection, setActiveSection] = useState("posts");

  const { username } = useParams({
    from: "/_protected/dashboard/other-profile/$username",
  });

  const { data: authUser } = useAuth();

  const BUCKET_NAME = "profilepicturesfbe74-dev";
  const BUCKET_REGION = "us-east-1";

  // Fetch user profile data
  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      // Fetch the profile
      const response = await axiosInstance.get(`/bloggers/profile/${username}`);

      // Check follow status
      const followStatusResponse = await axiosInstance.get(
        "/followers/isFollowing",
        {
          params: {
            followerId: authUser?.bloggerId,
            followeeId: response.data.bloggerId,
          },
        }
      );

      // Merge the follow status with the profile data
      return {
        ...response.data,
        isFollowing: followStatusResponse.data,
      };
    },
    enabled: !!username && !!authUser,
  });

  // Follow/Unfollow mutations


  const { follow, unfollow, isFollowLoading } = useFollowToggle(username || "");

  const handleFollowToggle = () => {
    if (user?.bloggerId) {
      if (user.isFollowing) {
        unfollow(user.bloggerId);
      } else {
        follow(user.bloggerId);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const profilePictureUrl = user?.profilePictureUrl
    ? `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${user.profilePictureUrl}`
    : "lbj.png";

  console.log("Raw profilePictureUrl:", user?.profilePictureUrl);
  console.log("Constructed profilePictureUrl:", profilePictureUrl);

  return (
    <div className="min-w-[896px] max-w-4xl mx-auto">
      {/* Profile Section */}
      <div
        className="relative h-64 bg-sky-400 rounded-lg shadow-lg"
        style={{
          backgroundImage: "url('/fallback-cover.jpg')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        {/* Profile Picture */}
        <img
          src={profilePictureUrl}
          alt="Profile"
          className="absolute bottom-0 left-4 transform translate-y-1/2 w-40 h-40 rounded-full shadow-md"
        />

        {/* Profile Details */}
        <div className="absolute bottom-[-60px] left-[200px] flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-neutral-100">
              {user?.username}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Follow Button - Only show if viewing another user's profile */}
          {authUser?.bloggerId !== user?.bloggerId && (
            <Button
              onClick={handleFollowToggle}
              variant={user?.isFollowing ? "outline" : "default"}
              className={`ml-4 ${
                user?.isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  : ""
              }`}
              disabled={isFollowLoading}
            >
              {user?.isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      {/* Section Toggle Tabs */}
      <div className="mt-24 border-b dark:border-neutral-800 flex space-x-8 justify-start text-sm font-medium text-neutral-500 dark:text-neutral-400">
        <div
          onClick={() => setActiveSection("posts")}
          className={`relative pb-2 cursor-pointer text-lg ${
            activeSection === "posts"
              ? "text-black dark:text-neutral-100"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Posts
          {activeSection === "posts" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-neutral-100"></div>
          )}
        </div>
        <div
          onClick={() => setActiveSection("follows")}
          className={`relative pb-2 cursor-pointer text-lg ${
            activeSection === "follows"
              ? "text-black dark:text-neutral-100"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Followers
          {activeSection === "follows" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-neutral-100"></div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="mr-10">
        <div className="mt-8 flex flex-col space-y-5">
          {activeSection === "posts" && user?.bloggerId !== undefined && (
            <UserTimeline userId={user?.bloggerId} username={user?.username} />
          )}
          {activeSection === "follows" && user?.bloggerId !== undefined && (
            <FollowersList bloggerId={user.bloggerId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
