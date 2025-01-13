/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hlFSc6q90xz
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/hooks/use-auth";
import { useState } from "react";

export default function SettingsPage() {
  const { data: user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatar] = useState("/lbj.png");

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="px-4 space-y-6 md:px-6">
        <header className="space-y-1.5">
          <div className="flex items-center space-x-4">
            <img
              src={avatar}
              width="96"
              height="96"
              className="border rounded-full cursor-pointer"
              style={{ aspectRatio: "96/96", objectFit: "cover" }}
              alt="User Avatar"
              onClick={toggleModal}
            />
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-500 dark:text-gray-400">{user?.username}</p>
            </div>
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
              style={{ width: '300px', height: 'auto' }}
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

      

      <header>
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

          <div className="space-y-2">
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
      </header>
    </div>
  );
}