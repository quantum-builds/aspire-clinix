import PractitionersPage from "./component/practitioners";

export default async function Page(props: {
  searchParams?: Promise<{
    treatmentId?: string;
    duration?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <PractitionersPage
      treatmentId={searchParams?.treatmentId}
      duration={searchParams?.duration}
    />
  );
}
