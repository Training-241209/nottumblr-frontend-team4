import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/hooks/use-auth";

const BUCKET_NAME = "profilepicturesfbe74-dev";
const BUCKET_REGION = "us-east-1";

export function UserAvatar() {
  const { data: auth } = useAuth();

  if (!auth) return null;

  // Construct full S3 URL if profilePictureUrl exists
  const profilePictureUrl = auth.profilePictureUrl
    ? `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${auth.profilePictureUrl}`
    : null;

  console.log("Auth data:", auth);
  
  return (
    <Avatar>
      {/* Display profile picture if available */}
      {profilePictureUrl && (
        <AvatarImage
          src={profilePictureUrl}
          alt="User Avatar"
          onError={(e) => {
            console.error("Error loading avatar image:", e);
            e.currentTarget.src = "/lbj.png"; // Fallback to default
          }}
        />
      )}

      {/* Fallback initials if no profile picture */}
      <AvatarFallback>
        {auth.email.charAt(0).toUpperCase() +
          auth.email.charAt(1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
