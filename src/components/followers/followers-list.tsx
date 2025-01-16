import React from "react";
import { useFollowers } from "@/components/followers/hooks/use-followers";
import { useDeleteFollower } from "@/components/followers/hooks/use-delete-followers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface FollowersListProps {
  bloggerId: number;
}

const FollowersList: React.FC<FollowersListProps> = ({ bloggerId }) => {
  const { data: followers = [], isLoading, isError } = useFollowers(bloggerId);
  const deleteFollowerMutation = useDeleteFollower(bloggerId);

  if (isLoading) {
    return <p>Loading followers...</p>;
  }

  if (isError) {
    return <p>Failed to load followers. Please try again later.</p>;
  }

  if (followers.length === 0) {
    return <p>No followers yet.</p>;
  }

  const handleDeleteFollower = (username: string) => {
    deleteFollowerMutation.mutate(username);
  };

  return (
    <ul className="space-y-2">
      {followers.map((follower, index) => (
        <li
          key={index}
          className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-md flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={follower.profilePictureUrl || "/default-avatar.png"}
                alt={follower.username}
              />
              <AvatarFallback>
                {follower.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-gray-800 dark:text-gray-300">@{follower.username}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FollowersList;