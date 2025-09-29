import { cn } from "@/lib/utils";
import { TPlan } from "@/types/common";
import Button from "@/app/(dashboards)/components/Button";

interface CardProps {
  plan: TPlan;
  borderColor: string;
  backgroundColor: string;
  classname: string;
}

export default function Card({
  plan,
  borderColor,
  backgroundColor,
  classname,
}: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-10 px-6 py-10 border rounded-2xl shadow-xl h-fit w-[472px]",
        classname
      )}
      style={{
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-2xl">{plan.title}</p>
        <p className="text-lg text-lightBlack">{plan.name}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-green font-semibold text-[40px]">€{plan.price}</p>
        <p className="text-lightBlack italic text-lg">
          Exclusive of all taxes{" "}
        </p>
      </div>
      <div className="flex flex-col gap-5 text-lg">
        <div className="flex flex-col gap-2">
          <p className="font-medium ">Target:</p>
          <p className="text-lightBlack">{plan.target}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-medium ">Services:</p>
          <ul className="list-disc text-lightBlack pl-5">
            {plan.services.map((service, index) => (
              <li key={index} className="mb-1">
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Button text="Buy Now" href="/patient/plans" />
    </div>
  );
}
