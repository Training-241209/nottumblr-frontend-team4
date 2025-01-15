import { useMemo } from 'react';

const BUCKET_NAME = "profilepicturesfbe74-dev";
const BUCKET_REGION = "us-east-1";
const BUCKET_URL = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com`;

export function useS3Get() {
  const getImageUrl = useMemo(() => {
    return (key: string | null | undefined, folder?: string, defaultImage: string = '/default-avatar.png') => {
      if (!key) return defaultImage;
      
      // If the key is already a full URL, return it
      if (key.startsWith('http')) return key;
      
      // If the key already includes a folder structure, don't add the folder parameter
      if (key.includes('/')) {
        return `${BUCKET_URL}/${key}`;
      }
      
      // If no folder structure in key, add the folder parameter
      return `${BUCKET_URL}/${folder ? `${folder}/` : ''}${key}`;
    };
  }, []);

  return { getImageUrl };
}