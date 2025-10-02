import ProfileForm from "./components/profileForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default function ProfilePage() {
  return (
    <div className=" w-full min-h-[103px] flex flex-col gap-7">
      <PageTopBar
        pageHeading="Profile Details"
        showFilters={false}
        showSearch={false}
        showBackBtn={true}
        statusOptions={null}
      />
      <ProfileForm />
    </div>
  );
}
