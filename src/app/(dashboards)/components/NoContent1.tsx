import Image from "next/image";
import { ReactNode } from "react";
import { NoContentIcon } from "@/assets";

interface NoContent1Props {
  text?: string
  appointmentFlow?: boolean
  action?: ReactNode
}
export default function NoContent1({ text = "The data you have searched is not found at this moment", appointmentFlow = false, action }: NoContent1Props) {
  return (
    <div className={`${appointmentFlow ? '' : 'bg-dashboardBarBackground'}  py-[60px] px-6 flex flex-col items-center justify-center gap-4 rounded-2xl`}>
      <Image
        src={NoContentIcon}
        alt="no content"
        className="w-[200px] h-[200px]"
      />
      <div className="flex flex-col justify-center items-center gap-2 ">
        <p className={`${appointmentFlow ? 'text-white' : ''} text-2xl font-medium`}>Content Not Found</p>
        <p className="italix text-lg text-lightBlack">
          {text}
        </p>
      </div>
      {action}
    </div>
  );
}
