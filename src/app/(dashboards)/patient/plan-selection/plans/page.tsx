import PlansPage from "./component/plans";

export default function Page() {
  return (
    <div className="relative h-full">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B0A08]"
      />
      <PlansPage />
    </div>
  );
}