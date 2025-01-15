import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

const BUCKET_NAME = "profilepicturesfbe74-dev";
const BUCKET_REGION = "us-east-1";
const BUCKET_URL = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com`;

export default function SettingsPage() {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch and set avatar on load
  useEffect(() => {
    if (user?.profilePictureUrl) {
      const imageUrl = `${BUCKET_URL}/${user.profilePictureUrl}`;

      // Preload avatar before setting it
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setAvatar(imageUrl);
    }
  }, [user?.profilePictureUrl]);

  // Mutation for updating profile picture URL in the database
  const updateProfilePictureMutation = useMutation({
    mutationFn: async (profilePictureUrl: string) => {
      const response = await axiosInstance.put("/bloggers/profile-picture", {
        profilePictureUrl,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] }); // Re-fetch user data
    },
  });

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Generate a unique file name
      const fileExtension = file.name.split(".").pop();
      const fileName = `profile-pictures/${user?.username || "user"}-${Date.now()}.${fileExtension}`;

      // Construct the upload URL
      const uploadUrl = `${BUCKET_URL}/${fileName}`;

      // Upload directly to S3 via a PUT request
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }

      // Update the avatar state with the new URL
      setAvatar(uploadUrl);

      // Update database with the new profile picture URL
      await updateProfilePictureMutation.mutateAsync(fileName);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="px-4 space-y-6 md:px-6">
      <header className="space-y-1.5">
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-40 h-40 rounded-full shadow-md cursor-pointer object-cover"
              onClick={toggleModal}
            />
          ) : isUploading ? (
            <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
              Uploading...
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-300"></div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />

          {/* User Info */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{user?.username}</p>
          </div>

          {/* Change Profile Picture Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUploadClick}
            disabled={
              isUploading || updateProfilePictureMutation.status === "pending"
            }
          >
            {isUploading
              ? "Uploading..."
              : updateProfilePictureMutation.status === "pending"
                ? "Saving..."
                : "Change Profile Picture"}
          </Button>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && avatar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <img
              src={avatar}
              alt="Full-Size Avatar"
              className="rounded-lg max-w-full max-h-fit"
              style={{ width: "300px", height: "auto" }}
            />
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="space-y-8">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Enter your first name" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Enter your last name" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Label className="block text-lg font-medium">Change Password</Label>
          <ul className="space-y-6 list-none">
            <li className="space-y-1">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                placeholder="Enter your current password"
                type="password"
                className="w-full"
              />
            </li>
            <li className="space-y-1">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                placeholder="Enter your new password"
                type="password"
                className="w-full"
              />
            </li>
            <li className="space-y-1">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                placeholder="Confirm your new password"
                type="password"
                className="w-full"
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button size="lg">Save</Button>
        <Button size="lg" className="!bg-red-600 !text-white hover:!bg-red-700">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
