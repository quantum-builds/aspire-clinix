import PlanSubscriptionForm from "../../../components/EditForm";

export default function EditPlanPage() {
  const defaultValues = {
    title: "",
    tagline: "",
    description: "",
    price: "",
  };

  return (
    <div className=" w-full h-full flex flex-col gap-7">
      <h1 className="font-medium text-3xl">Plans & Subscriptions</h1>
      <PlanSubscriptionForm type="subscription" defaultValues={defaultValues} />
    </div>
  );
}
