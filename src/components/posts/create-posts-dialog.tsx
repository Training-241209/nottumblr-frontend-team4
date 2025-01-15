import React, { useRef, useState } from "react";
import { Paperclip, ImageIcon } from "lucide-react";
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
import { useGiphy } from "@/components/posts/hooks/use-giphy";
import { toast } from "sonner";

const CreatePostDialog: React.FC = () => {
  const { data: user } = useAuth();
  const { uploadToS3, isUploading } = useS3Upload();
  const { mutate: createPost, status } = useCreatePost();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showGifModal, setShowGifModal] = useState(false);
  const [gifSearch, setGifSearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: gifs = [], isLoading } = useGiphy(gifSearch);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadToS3(file, "post-images");
      setImageUrl(uploadedUrl);
    } catch {
      // Error handling is already done in the S3 hook
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    setImageUrl(gifUrl);
    setShowGifModal(false);
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
    setContent("");
    setImageUrl("");
  };

  const isPosting = status === "pending";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="!bg-white text-black hover:!bg-sky-300"
        >
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

            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center gap-2 whitespace-nowrap"
              onClick={() => setShowGifModal(true)}
            >
              <ImageIcon className="h-5 w-5" />
              Add GIF
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
                onClick={() => setImageUrl("")}
              >
                Remove
              </Button>
            </div>
          )}

          <Textarea
            className={`resize-none w-full ${
              imageUrl
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
              disabled={isUploading || isPosting}
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      {/* Giphy Modal */}
      {showGifModal && (
        <Dialog open={showGifModal} onOpenChange={setShowGifModal}>
          <DialogContent className="max-w-lg bg-white text-black rounded-lg shadow-lg p-4">
            <DialogHeader>
              <DialogTitle className="text-gray-400">Search for your favorite GIF</DialogTitle>
            </DialogHeader>
              <input
                type="text"
                placeholder="Search for a GIF..."
                value={gifSearch}
                onChange={(e) => setGifSearch(e.target.value)}
                className={`resize-none w-full min-h-[50px] max-h-[50px] p-2 bg-neutral-900 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500`}
              />
            <div
              className="grid grid-cols-3 gap-4 overflow-y-auto"
              style={{ maxHeight: "400px" }}
            >
              {isLoading ? (
                <p className="text-center col-span-3">Loading GIFs...</p>
              ) : (
                gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.mediaUrl}
                    alt={gif.title}
                    className="cursor-pointer rounded-lg hover:scale-105 transition-transform"
                    onClick={() => handleGifSelect(gif.mediaUrl)}
                  />
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default CreatePostDialog;
