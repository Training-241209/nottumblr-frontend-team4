import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Repeat } from "lucide-react";

interface PostCardProps {
  index?: number;
  creatorName: string; // Creator's full name
  username: string; // Creator's username
  title: string;
  body: string | { type: 'image'; url: string };
  avatarUrl: string;
  comments?: string[];
  onProfileClick?: (username: string) => void; // Optional array of comments
}

const PostCard: React.FC<PostCardProps> = ({ creatorName, username, title, body, avatarUrl, comments = [], onProfileClick }) => {
  const [showComments, setShowComments] = useState(false); // Track whether to show comments

  const toggleComments = () => setShowComments((prev) => !prev);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onProfileClick) {
      onProfileClick(username);
    }
  };

  return (
    <Card className="bg-gray-800 text-white relative">
      {/* Clickable Header Section */}
      <a 
        href={`/profile/${username}`} 
        onClick={handleProfileClick}
        className="block hover:bg-gray-700 transition-colors duration-200"
      >
        <CardHeader className="flex flex-row items-center border-b border-gray-700 p-4">
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt={`${creatorName}'s avatar`}
            className="w-12 h-12 rounded-full"
          />
          {/* Creator Name and Username */}
          <div className="ml-4">
            <p className="text-white font-semibold">{creatorName}</p>
            <p className="text-gray-400">@{username}</p>
          </div>
        </CardHeader>
      </a>

      {/* Post Content */}
      <CardContent className="p-4">
        <h3 className="text-white font-bold mb-2">{title}</h3>
        {typeof body === "string" ? (
            body.match(/\.(jpg|jpeg|png|gif)$/) ? (
            <img src={body} alt="Post content" className="rounded-lg w-full h-auto" />
            ) : (
            <p>{body}</p>
            )
        ) : body.type === "image" ? (
            <img src={body.url} alt="Post content" className="rounded-lg w-full h-auto" />
        ) : null}
    </CardContent>

      {/* Footer Buttons */}
      <CardFooter className="flex justify-end items-center space-x-4 border-t border-gray-700 pt-4 px-4">
        {/* Like Button */}
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Heart size={20} />
          <span>Like</span>
        </button>
        {/* Comment Button */}
        <button
          onClick={toggleComments}
          className="flex items-center space-x-2 text-gray-300 hover:text-white"
        >
          <MessageCircle size={20} />
          <span>Comments</span>
        </button>
        {/* Reblog Button */}
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Repeat size={20} />
          <span>Reblog</span>
        </button>
      </CardFooter>

      {/* Conditional Rendering for Comments */}
      {showComments && (
        <div className="p-4 mt-4 border-t border-gray-700">
          <h4 className="text-gray-400 mb-2">Comments</h4>
          <ul className="space-y-2">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <li key={index} className="text-gray-300">
                  {comment}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </ul>
          {/* Add a comment input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
