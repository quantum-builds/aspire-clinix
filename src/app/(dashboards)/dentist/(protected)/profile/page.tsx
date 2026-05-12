import { TDenstistResponse, TDentist } from "@/types/dentist";
import ProfileForm from "./components/profileForm";
import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { getDentist } from "@/services/dentist/dentistQuery";
import { Response } from "@/types/common";

export default async function ProfilePage() {
  try {
    const response: Response<TDenstistResponse | null> = await getDentist();

    if (!response?.status) {
      return (
        <div className="w-full min-h-screen flex justify-center items-center">
          <p>{response?.message || "Error fetching profile data."}</p>
        </div>
      );
    }

    if (!response.data?.dentist) {
      return (
        <div className="w-full min-h-screen flex justify-center items-center">
          <p>Doctor information not found.</p>
        </div>
      );
    }

    const dentist: TDentist = response.data.dentist;
    const request = response.data.request ?? null;

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
    console.error("Profile fetch error:", error);
  
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Error fetching profile data. Please try again later.</p>
      </div>
    );
  }
}