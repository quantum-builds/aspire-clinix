import { AppointmentStatus } from "@prisma/client";

export default function StatusBage({ status }: { status: AppointmentStatus }) {
  const statusStyles = () => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return { text: "Pending", bgColor: "bg-[#FFF5C2]" };
      case AppointmentStatus.IN_SURGERY:
        return { text: "In surgery", bgColor: "bg-[#C7F5FF]" };
      case AppointmentStatus.DID_NOT_ATTEND:
        return { text: "Did not attend", bgColor: "bg-[#FFB3B3]" };
      case AppointmentStatus.CONFIRMED:
        return { text: "Confirmed", bgColor: "bg-[#B5FFB5]" };
      case AppointmentStatus.COMPLETED:
        return { text: "Completed", bgColor: "bg-[#B5FFB5]" };
      case AppointmentStatus.CANCELLED:
        return { text: "Cancelled", bgColor: "bg-[#FFB3B3]" };
      case AppointmentStatus.ARRIVED:
        return { text: "Arrived", bgColor: "bg-[#FFC8FA]" };
    }
  };

  const { bgColor, text } = statusStyles();

  return (
    <div
      className={`px-2 py-1 text-sm rounded-lg ${bgColor} text-dashboardTextBlack italic`}
    >
      {text}
    </div>
  );
}
