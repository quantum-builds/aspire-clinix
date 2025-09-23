import BackButton from "@/app/(dashboards)/components/BackButton";
import ProfileForm from "./components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Profile Details</h1>
        <BackButton />
      </div>
      <ProfileForm />
    </div>
  );
}
