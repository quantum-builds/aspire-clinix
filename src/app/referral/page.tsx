import HeroSection from "@/components/HeroSection";
import ReferralForm from "@/components/ReferralForm";
import { Response } from "@/types/common";
import { TPracticeResponse } from "@/types/practice";
import { getPractices } from "@/services/practice/practiceQuery";

export default async function ReferralPage() {
  const heroBackgroundColor = "#DCD4C9";
  const herobuttonColor = "#ECE8E3";
  const response: Response<TPracticeResponse> = await getPractices({});
  const practices = response.data
    ? response.data.practices
      ? response.data.practices
      : []
    : [];

  return (
    <div className="bg-feeGuide h-auto">
      <HeroSection
        title={"Referral Form"}
        description="Aspire Dental is pleased to accept referrals from fellow dentists. And we offer referring dentists a series of promises to guarantee the best care for their patients."
        backgroundColor={heroBackgroundColor}
        buttonColor={herobuttonColor}
        textColor="#423C36"
        descLineHeight={45.4}
        titleFontSize="text-[35px] md:text-[60px]"
        heroScreenHieght="min-h-[55vh] md:min-h-[70vh]"
      />
      <div id="form">
        <ReferralForm practices={practices} />
      </div>
    </div>
    // <img src="https://aspire-media.s3.eu-west-2.amazonaws.com/uploads/aspire-clinic/images/aspire-logo.png" alt="Aspire Clinic Logo" />

  );
}
