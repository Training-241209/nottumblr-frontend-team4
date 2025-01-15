import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useS3Get } from "@/components/auth/hooks/use-s3-get";
import { useS3Upload } from "@/components/auth/hooks/use-s3-upload";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios-config";

export default function SettingsPage() {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const { getImageUrl } = useS3Get();
  const { uploadToS3, isUploading: isAvatarUploading } = useS3Upload();

  const [avatar, setAvatar] = useState<string | undefined>(
    getImageUrl(user?.profilePictureUrl, "profile-pictures")
  );
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Mutations
  const updateProfilePictureMutation = useMutation({
    mutationFn: async (profilePictureUrl: string) => {
      const response = await axiosInstance.put("/bloggers/profile-picture", {
        profilePictureUrl,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Profile picture updated successfully!");
    },
  });

  const updateFirstNameMutation = useMutation({
    mutationFn: async (newFirstName: string) => {
      const response = await axiosInstance.put(`/bloggers/${user?.bloggerId}/first-name`, null, {
        params: { newFirstName },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("First name updated successfully!");
    },
  });

  const updateLastNameMutation = useMutation({
    mutationFn: async (newLastName: string) => {
      const response = await axiosInstance.put(`/bloggers/${user?.bloggerId}/last-name`, null, {
        params: { newLastName },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Last name updated successfully!");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const response = await axiosInstance.put(`/bloggers/${user?.bloggerId}/password`, null, {
        params: { newPassword },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
  });

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadToS3(file, "profile-pictures");
      setAvatar(uploadedUrl);
      const fileKey = uploadedUrl.split("/").slice(-2).join("/");
      await updateProfilePictureMutation.mutateAsync(fileKey);
    } catch (error) {
      toast.error("Failed to upload profile picture. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      if (firstName && firstName !== user?.firstName) {
        await updateFirstNameMutation.mutateAsync(firstName);
      }
      if (lastName && lastName !== user?.lastName) {
        await updateLastNameMutation.mutateAsync(lastName);
      }
      if (newPassword && newPassword === confirmPassword) {
        await updatePasswordMutation.mutateAsync(newPassword);
      } else if (newPassword || confirmPassword) {
        toast.error("Passwords do not match.");
      }
    } catch (error) {
      toast.error("Failed to update settings. Please try again.");
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
          ) : isAvatarUploading ? (
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
            disabled={isAvatarUploading || updateProfilePictureMutation.status === "pending"}
          >
            {isAvatarUploading
              ? "Uploading..."
              : updateProfilePictureMutation.status === "pending"
              ? "Saving..."
              : "Change Profile Picture"}
          </Button>
        </div>
      </header>

      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="space-y-8">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
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
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </li>
            <li className="space-y-1">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                placeholder="Enter your new password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </li>
            <li className="space-y-1">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                placeholder="Confirm your new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button size="lg" onClick={handleSave}>
          Save
        </Button>
        <Button size="lg" className="!bg-red-600 !text-white hover:!bg-red-700">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
