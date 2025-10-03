import { TAdmin } from "@/types/admin";
import ProfileForm from "./components/ProfileForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { getAdmin } from "@/services/admin/adminQuery";
import { Response } from "@/types/common";

export default async function ProfilePage() {
  const response: Response<TAdmin> = await getAdmin();

  return (
    <div className=" w-full min-h-[105vh] flex flex-col gap-5">
      <PageTopBar
        pageHeading="Profile Details"
        showFilters={false}
        showSearch={false}
        statusOptions={null}
        showBackBtn={true}
      />
      <ProfileForm admin={response.data} />
    </div>
  );
}
