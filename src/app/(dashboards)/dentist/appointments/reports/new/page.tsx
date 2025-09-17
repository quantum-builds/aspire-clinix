import BackButton from "@/app/(dashboards)/components/BackButton";

export default function NewReport() {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Reports</h1>
        <div className="flex items-center gap-3">
          <BackButton />
        </div>
      </div>
    </div>
  );
}
