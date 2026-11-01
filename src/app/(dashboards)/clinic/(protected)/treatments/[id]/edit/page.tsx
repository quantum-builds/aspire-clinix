import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import EditTreatmentWrapper from "./components/EditTreatmentWrapper";

export default function EditTreatmentPage() {
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
        <EditTreatmentWrapper />
      </div>
    </div>
  );
}
