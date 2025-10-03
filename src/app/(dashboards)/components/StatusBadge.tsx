import { AppointmentStatus, PracticeApprovalStatus } from "@prisma/client";

type StatusType = AppointmentStatus | PracticeApprovalStatus;

export default function StatusBadge({ status }: { status: StatusType }) {
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

      case PracticeApprovalStatus.PENDING:
        return { text: "Pending Approval", bgColor: "bg-[#FFF5C2]" };
      case PracticeApprovalStatus.APPROVED:
        return { text: "Approved", bgColor: "bg-[#B5FFB5]" };
      case PracticeApprovalStatus.CANCELLED:
        return { text: "Approval Cancelled", bgColor: "bg-[#FFB3B3]" };

      default:
        return { text: String(status), bgColor: "bg-gray-300" }; // fallback
    }
  };

  const { bgColor, text } = statusStyles();

  return (
    <div
      className={`px-2 py-1 text-sm rounded-lg ${bgColor} text-dashboardTextBlack italic w-fit`}
    >
      {text}
    </div>
  );
}
