export default function PatientTreatment({
  params,
}: {
  params: { slug: string };
}) {
  const name = decodeURIComponent(params.slug);
  return (
    <div className="bg-feeGuide p-10 flex flex-col gap-8 w-1/2 rounded-lg min-h-[70%]">
      <p className="font-gillSans text-2xl font-semibold">{name}</p>
      <div className="flex flex-col gap-5">
        <p className="font-opus">Treatment:</p>
        <div className="flex gap-5 items-center font-opus">
          <p>Patient Letter:</p>
          <button className="py-2 px-8 bg-gray-300 rounded-lg">Upload</button>
        </div>
        <div className="flex gap-5 items-center font-opus">
          <p>Patient Video:</p>
          <button className="py-2 px-8 bg-gray-300 rounded-lg">Upload</button>
        </div>
      </div>
    </div>
  );
}
