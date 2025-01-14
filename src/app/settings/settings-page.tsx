import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { uploadData } from "aws-amplify/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-config";

export default function SettingsPage() {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BUCKET_NAME = "profilepicturesfbe74-dev";
  const BUCKET_REGION = "us-east-1";

  // Initialize avatar from localStorage or user.profilePictureUrl
  const [avatar, setAvatar] = useState<string | undefined>(() => {
    const savedAvatar = localStorage.getItem("avatar");
    return (
      savedAvatar ||
      (user?.profilePictureUrl
        ? `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${user.profilePictureUrl}`
        : undefined) 
    );
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update avatar state and localStorage when user.profilePictureUrl changes
  useEffect(() => {
    if (user?.profilePictureUrl) {
      const fullS3Url = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${user.profilePictureUrl}`;
      setAvatar(fullS3Url);
      localStorage.setItem("avatar", fullS3Url);
    }
  }, [user?.profilePictureUrl]);

  // Mutation for updating profile picture
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

      // Generate a unique file name using timestamp
      const fileExtension = file.name.split(".").pop();
      const fileName = `profile-pictures/${user?.username || "user"}-${Date.now()}.${fileExtension}`;

      // Upload to S3 using uploadData
      const result = await uploadData({
        path: `public/${fileName}`,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      const dbPath = `public/${fileName}`;
      const fullS3Url = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${dbPath}`;

      // Update avatar and save to localStorage
      setAvatar(fullS3Url);
      localStorage.setItem("avatar", fullS3Url);

      // Update database with storage path
      await updateProfilePictureMutation.mutateAsync(dbPath);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="px-4 space-y-6 md:px-6">
      <header className="space-y-1.5">
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <img
            src={avatar || "/lbj.png"} // Fallback to /lbj.png
            width="96"
            height="96"
            className="border rounded-full cursor-pointer"
            style={{ aspectRatio: "96/96", objectFit: "cover" }}
            alt="User Avatar"
            onClick={toggleModal}
            onError={(e) => {
              console.error("Image failed to load:", avatar);
              e.currentTarget.src = "/lbj.png"; // Fallback image
            }}
          />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />

          {/* User Name and Info */}
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
            className="ml-4"
            onClick={handleUploadClick}
            disabled={isUploading || updateProfilePictureMutation.isPending}
          >
            {isUploading
              ? "Uploading..."
              : updateProfilePictureMutation.isPending
              ? "Saving..."
              : "Change Profile Picture"}
          </Button>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
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
          <h2 className="text-lg font-semibold">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                placeholder="Enter your current password"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                placeholder="Enter your new password"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                placeholder="Confirm your new password"
                type="password"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button size="lg">Save</Button>
        <Button
          size="lg"
          className="!bg-red-600 !text-white hover:!bg-red-700"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
