import CommingSoon from "../components/CommingSoon";
import SearchBar from "@/app/(dashboards)/components/SearchBar";

export default function ConsentPage() {
  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Consent</h1>
        <div>
          <SearchBar placeholder="Enter Consent Name" />
        </div>
      </div>
      <CommingSoon />
    </div>
  );
}
