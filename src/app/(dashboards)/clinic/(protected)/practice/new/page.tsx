import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import BackButton from "@/app/(dashboards)/components/BackButton";
import PracticeForm from "../components/PracticeForm";

export default async function NewPracticePage() {
  return (
    <div>
      <div className="min-h-full flex flex-col gap-5 mb-10">
        <PageTopBar
          pageHeading="Practices"
          showSearch={false}
          showFilters={false}
          statusOptions={[]}
          extraBtns={<BackButton />}
        />
        <PracticeForm />
      </div>
    </div>
  );
}
