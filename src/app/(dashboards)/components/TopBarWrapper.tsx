import TopBar from "./TopBar";
import { getAMedia } from "@/services/s3/s3Query";

interface TopBarWrapperProps {
  name: string;
  profilePic: string | null | undefined;
  role: string;
  profileLink: string;
}
export default async function TopBarWrapper({
  name,
  profilePic,
  role,
  profileLink,
}: TopBarWrapperProps) {
  const file = await getAMedia(profilePic || "");

  return (
    <TopBar
      name={name}
      role={role}
      profilePic={file}
      profileLink={profileLink}
    />
  );
}

export const revalidate = 0;
