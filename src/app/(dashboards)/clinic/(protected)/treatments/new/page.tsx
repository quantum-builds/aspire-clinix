import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import TreatmentForm from "../components/TreatmentForm";

export default function NewTreatmentPage() {
  return (
    <div>
      <div className="min-h-full flex flex-col gap-5 mb-10">
        <PageTopBar
          pageHeading="Treatments"
          showSearch={false}
          showFilters={false}
          statusOptions={[]}
          showBackBtn={true}
        />
        <TreatmentForm />
      </div>
    </div>
  );
}
