import CustomButton from "../../../components/custom-components/CustomButton";
import PageTopBar from "../../../components/custom-components/PageTopBar";
import TreatmentDataTable from "./components/TreatmentDataTable";

export default function TreatmentsPage() {
  return (
    <div>
      <div className="min-h-screen flex flex-col gap-5">
        <PageTopBar
          pageHeading="Treatments"
          showSearch={false}
          showFilters={false}
          statusOptions={[]}
          extraBtns={
            <CustomButton
              text="Create Treatment"
              href="/clinic/treatments/new"
            />
          }
        />
        <TreatmentDataTable />
      </div>
    </div>
  );
}
