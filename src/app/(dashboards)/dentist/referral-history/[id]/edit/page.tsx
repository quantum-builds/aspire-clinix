import BackButton from "@/app/(dashboards)/components/BackButton";
import ReferralForm from "./components/referral-form";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ReferralDetailsPage({ params }: PageProps) {
  const referralId = params.id;

  console.log(referralId);

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Referral Form</h1>
        <BackButton />
      </div>
      <ReferralForm />
    </div>
  );
}
