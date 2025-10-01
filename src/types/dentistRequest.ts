import { PracticeApprovalStatus } from "@prisma/client";
import { TDentist } from "./dentist";
import { TPractice } from "./practice";

export interface TDentistPractice {
  dentistId: string;
  practiceId: string;
  dentist: TDentist;
  practice: TPractice;
  status:PracticeApprovalStatus
}
