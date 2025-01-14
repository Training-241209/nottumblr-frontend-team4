import React, { useState, useRef } from 'react';
import { Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/hooks/use-auth";
import { uploadData } from "aws-amplify/storage";

interface CreatePostDialogProps {
  onCreatePost: (post: {
    id: number;
    creatorName: string;
    username: string;
    title: string;
    body: string;
    avatarUrl: string;
    comments: string[];
  }) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ onCreatePost }) => {
  const { data: user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BUCKET_NAME = "profilepicturesfbe74-dev";
  const BUCKET_REGION = "us-east-1";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Generate a unique file name using timestamp
      const fileExtension = file.name.split(".").pop();
      const fileName = `post-images/${user?.username || "user"}-${Date.now()}.${fileExtension}`;

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

      // Set the content to the image URL
      setContent(fullS3Url);

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) return;

    onCreatePost({
      id: Date.now(),
      creatorName: `${user?.firstName} ${user?.lastName}` || "Anonymous",
      username: user?.username || "anonymous",
      title: title.trim(),
      body: content.trim(),
      avatarUrl: user?.profilePictureUrl ? 
        `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${user.profilePictureUrl}` : 
        "/lbj.png",
      comments: []
    });

    setTitle('');
    setContent('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="!bg-white text-black hover:!bg-sky-300">
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-white min-w-[830px] max-w-[830px] min-h-[830px] max-h-[830px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Write a post, ask a question, share a link, and more.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Textarea
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="resize-none h-16 flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center gap-2 whitespace-nowrap"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <Paperclip className="h-5 w-5" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {content && content.match(/\.(jpg|jpeg|png|gif)$/) && (
            <div className="relative w-full h-64 bg-neutral-900 rounded-lg overflow-hidden">
              <img 
                src={content} 
                alt="Upload preview" 
                className="w-full h-full object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setContent('')}
              >
                Remove
              </Button>
            </div>
          )}

          <Textarea
            className={`resize-none w-full ${
              content && content.match(/\.(jpg|jpeg|png|gif)$/)
                ? "min-h-[250px] max-h-[250px]"
                : "min-h-[550px] max-h-[550px]"
            }`}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isUploading || (!title.trim() && !content.trim())}
            >
              {isUploading ? "Uploading..." : "Post"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;