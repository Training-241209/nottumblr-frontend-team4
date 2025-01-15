import React, { useRef, useState } from 'react';  // Removed useState for title
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
import { useS3Upload } from "@/components/auth/hooks/use-s3-upload";
import { useCreatePost } from "@/components/posts/hooks/use-create-posts";
import { toast } from "sonner";

const CreatePostDialog: React.FC = () => {
  const { data: user } = useAuth();
  const { uploadToS3, isUploading } = useS3Upload();
  const { mutate: createPost, status } = useCreatePost();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadToS3(file, "post-images");
      setImageUrl(uploadedUrl);
    } catch {
      // Error handling is already done in the S3 hook
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && !imageUrl.trim()) {
      toast.error("Content or an image is required.");
      return;
    }

    createPost({
      content: content.trim(),
      mediaUrl: imageUrl || null,
      mediaType: imageUrl ? "image" : null,
    });

    // Reset fields after submission
    setContent('');
    setImageUrl('');
  };

  const isPosting = status === "pending";

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
            Write a post, upload an image, or do both!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Removed title textarea */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center gap-2 whitespace-nowrap"
              onClick={handleUploadClick}
              disabled={isUploading || isPosting}
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

          {imageUrl && (
            <div className="relative w-full h-64 bg-neutral-900 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="w-full h-full object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setImageUrl('')}
              >
                Remove
              </Button>
            </div>
          )}

          <Textarea
            className={`resize-none w-full ${
              imageUrl ? "min-h-[250px] max-h-[250px]" : "min-h-[550px] max-h-[550px]"
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
              disabled={isUploading || isPosting}
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;