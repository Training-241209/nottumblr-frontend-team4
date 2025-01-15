import React, { useState } from "react";
import { useAuth } from "@/components/auth/hooks/use-auth"; // For user authentication
import PersonalTimeline from  "@/components/timelines/personal-page-timeline"; // Import PersonalTimeline
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UsersProfile = () => {
  const [activeSection, setActiveSection] = useState("posts");
  const { data: user } = useAuth();

  const showSection = (section: React.SetStateAction<string>) => {
    setActiveSection(section);
  };

  const BUCKET_NAME = "profilepicturesfbe74-dev";
  const BUCKET_REGION = "us-east-1";

  const profilePictureUrl = user?.profilePictureUrl
    ? `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${user.profilePictureUrl}`
    : "lbj.png"; // Fallback image

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
        <div className="absolute bottom-[-60px] left-[200px]">
          <h1 className="text-2xl font-bold text-black dark:text-neutral-100">
            {user?.username}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      {/* Section Toggle Tabs */}
      <div className="mt-24 border-b dark:border-neutral-800 flex space-x-8 justify-start text-sm font-medium text-neutral-500 dark:text-neutral-400">
        <div
          onClick={() => showSection("posts")}
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
          onClick={() => showSection("follows")}
          className={`relative pb-2 cursor-pointer text-lg ${
            activeSection === "follows"
              ? "text-black dark:text-neutral-100"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Following
          {activeSection === "follows" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-neutral-100"></div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="mr-10">
        <div className="mt-8 flex flex-col space-y-5">
          {activeSection === "posts" && <PersonalTimeline />} {/* Render PersonalTimeline */}
          {activeSection === "follows" &&
            [1, 2].map((user) => (
              <Card
                key={user}
                className="bg-white shadow-md h-15 w-96 max-w-lg mx-auto flex flex-col"
              >
                <CardHeader>
                  <CardTitle>Username {user}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>name</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
