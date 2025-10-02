import ProfileForm from "./components/ProfileForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

export default function ProfilePage() {
  return (
    <div className=" w-full min-h-[98vh] flex flex-col gap-5">
      <PageTopBar
        pageHeading="Profile Details"
        showFilters={false}
        showSearch={false}
        statusOptions={null}
        showBackBtn={true}
      />
      <ProfileForm />
    </div>
  );
}
