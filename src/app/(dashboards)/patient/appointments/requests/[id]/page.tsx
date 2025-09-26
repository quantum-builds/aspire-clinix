import { Suspense } from "react";
import AppointmentRequestCardWrapper from "./components/AppointmentRequestCardWrapper";

export default async function AppointmentRequestDetailPage(props: {
  params: { id: string };
}) {
  const { id } = props.params;

  return (
    <div className="min-h-full flex flex-col gap-7 mb-10">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Reports</h1>
      </div>
      <div className="bg-white p-6 rounded-2xl space-y-10">
        <div className="text-2xl font-medium">Appointment Requests</div>
        <Suspense key={id} fallback={<div>Loading...</div>}>
          <AppointmentRequestCardWrapper id={id} />
        </Suspense>
      </div>
    </div>
  );
}
