import { AppointmentState } from "@/types/appointment";
import { PracticeApprovalStatus } from "@prisma/client";

type StatusType = AppointmentState | PracticeApprovalStatus;

interface StatusStyle {
  text: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export default function StatusBadge({ status }: { status: StatusType }) {
  const statusStyles = (): StatusStyle => {
    switch (status) {
      // Appointment Statuses
      case AppointmentState.PENDING:
        return {
          text: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-900",
          borderColor: "border-yellow-300",
        };
      case AppointmentState.CONFIRMED:
        return {
          text: "Confirmed",
          bgColor: "bg-blue-50",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      case AppointmentState.ARRIVED:
        return {
          text: "Arrived",
          bgColor: "bg-purple-50",
          textColor: "text-purple-800",
          borderColor: "border-purple-200",
        };
      case AppointmentState.INSURGERY:
        return {
          text: "In Surgery",
          bgColor: "bg-cyan-50",
          textColor: "text-cyan-800",
          borderColor: "border-cyan-200",
        };
      case AppointmentState.COMPLETED:
        return {
          text: "Completed",
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-800",
          borderColor: "border-emerald-200",
        };
      case AppointmentState.CANCELLED:
        return {
          text: "Cancelled",
          bgColor: "bg-red-50",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      case AppointmentState.DIDNOTATTEND:
        return {
          text: "Did Not Attend",
          bgColor: "bg-orange-50",
          textColor: "text-orange-800",
          borderColor: "border-orange-200",
        };

      // Practice Approval Statuses
      case PracticeApprovalStatus.PENDING:
        return {
          text: "Pending Approval",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-900",
          borderColor: "border-yellow-300",
        };
      case PracticeApprovalStatus.APPROVED:
        return {
          text: "Approved",
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-800",
          borderColor: "border-emerald-200",
        };
      case PracticeApprovalStatus.CANCELLED:
        return {
          text: "Approval Cancelled",
          bgColor: "bg-red-50",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };

      default:
        return {
          text: String(status),
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const { bgColor, textColor, borderColor, text } = statusStyles();

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${bgColor} ${textColor} border ${borderColor} shadow-sm`}
    >
      <span className={`h-1.5 rounded-full ${textColor.replace('text-', 'bg-')}`} />
      {text}
    </span>
  );
}
