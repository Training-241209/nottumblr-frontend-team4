import { useState } from "react";
import { toast } from "sonner";

const BUCKET_NAME = "profilepicturesfbe74-dev";
const BUCKET_REGION = "us-east-1";
const BUCKET_URL = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com`;

export function useS3Upload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToS3 = async (file: File, folder: string): Promise<string> => {
    try {
      setIsUploading(true);

      // Generate a unique file name
      const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s/g, "_")}`;

      // Construct the upload URL
      const uploadUrl = `${BUCKET_URL}/${fileName}`;

      // Upload the file to S3
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

      toast.success("File uploaded successfully!");
      return uploadUrl; // Return the S3 URL of the uploaded file
    } catch (error) {
      console.error("Error uploading to S3:", error);
      toast.error("Failed to upload file. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToS3, isUploading };
}
