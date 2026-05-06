import { TDenstistResponse, TDentist } from "@/types/dentist";
import ProfileForm from "./components/profileForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { getDentist } from "@/services/dentist/dentistQuery";
import { Response } from "@/types/common";
import { TDentistPractice } from "@/types/dentistRequest";

export default async function ProfilePage() {
  try {
    const response: Response<TDenstistResponse> = await getDentist(); // Fixed typo here

    if (!response.data.dentist) {
      return (
        <div className="w-full min-h-screen flex justify-center items-center">
          <p>Doctor information not found.</p>
        </div>
      );
    }

    const dentist: TDentist = response.data.dentist;
    const request: TDentistPractice = response.data.request;

    return (
      <div className="w-full min-h-screen flex flex-col gap-7">
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
  } catch (error) {
    // Handle any errors that occur during the fetch or processing
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Error fetching profile data. Please try again later.</p>
      </div>
    );
  }
}