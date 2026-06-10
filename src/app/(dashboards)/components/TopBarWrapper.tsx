import TopBar from "./TopBar";
import { getAMedia } from "@/services/s3/s3Query";
import { S3File } from "@/services/s3/s3Query";

interface TopBarWrapperProps {
  name: string;
  profilePic: S3File | string | null;
  role: string;
  profileLink: string;
  familyId?: string;
  currentPatientId?: number;
}
export default async function TopBarWrapper({
  name,
  profilePic,
  role,
  profileLink,
  familyId,
  currentPatientId,
}: TopBarWrapperProps) {

  console.log("profile pic in wrapper is ", JSON.stringify(profilePic, null, 2));
  return (
    <TopBar
      name={name}
      role={role}
      profilePic={profilePic}
      profileLink={profileLink}
      familyId={familyId}
      currentPatientId={currentPatientId}
    />
  );
}

export const revalidate = 0;
