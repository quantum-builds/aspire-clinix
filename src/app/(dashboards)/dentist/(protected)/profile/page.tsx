import { TDenstistResponse, TDentist } from "@/types/dentist";
import ProfileForm from "./components/profileForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { getDentist } from "@/services/dentist/dentistQuery";
import { Response } from "@/types/common";
import { TDentistPractice } from "@/types/dentistRequest";

export default async function ProfilePage() {
  const response: Response<TDenstistResponse> = await getDentist();
  const dentist: TDentist = response.data.dentist;
  // const status = response.data.request.status;
  // const practiceEmail = response.data.request.practice.email;
  const request: TDentistPractice = response.data.request;

  return (
    <div className=" w-full min-h-[105px] flex flex-col gap-7">
      <PageTopBar
        pageHeading="Profile Details"
        showFilters={false}
        showSearch={false}
        showBackBtn={true}
        statusOptions={null}
      />
      <ProfileForm dentist={dentist} request={request} />
    </div>
  );
}
