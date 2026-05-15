import ProfileForm from "./components/ProfileForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";

import { TPatient } from "@/types/patient";
import { getPatient } from "@/services/patient/patientQuery";
import { Response } from "@/types/common";

export default async function ProfilePage() {
  
  const response: Response<TPatient> = await getPatient();

  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <PageTopBar
        pageHeading="Profile Details"
        showFilters={false}
        showSearch={false}
        statusOptions={null}
        showBackBtn={true}
      />
      <ProfileForm patient={response.data } />
    </div>
  );
}
