interface IPreferredPhoneNumber {
  HOME: 1;
  WORK: 2;
  MOBILE: 3;
}
interface IRecallMethod {
  LETTER: "Letter";
  SMS: "SMS";
  EMAIL: "Email";
  PHONE: "Phone";
}
interface ITitle {
  MR: "Mr";
  MRS: "Mrs";
  MISS: "Miss";
  MIS: "Ms";
  DR: "Dr";
  MASTER: "Master";
  PROF: "Prof";
  HON: "Hon";
  REV: "Rev";
  SIR: "Sir";
  LADY: "Lady";
  LORD: "Lord";
  EARL: "Earl";
  JUDGE: "Judge";
  DAME: "Dame";
}
interface CreatePatient {
  title: ITitle;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Date as a string in ISO format (YYYY-MM-DD)
  gender: boolean; // true for male, false for female
  ethnicity: string; // Expected to match specific codes
  addressLine1: string;
  postcode: string;
  paymentPlanId: number;
  active?: boolean; // Default true
  addressLine2?: string;
  county?: string;
  dentistId?: number;
  dentistRecallDate?: string; // Date in ISO format
  dentistRecallInterval?: number; // Between 0 and 24
  emailAddress?: string;
  homePhone?: string;
  homePhoneCountry?: string; // ISO country code
  hygienistId?: number;
  hygienistRecallDate?: string; // Date in ISO format
  hygienistRecallInterval?: number; // Between 0 and 24
  legacyId?: string;
  marketing?: number; // Consent for marketing
  medicalAlert?: number; // 1 for true, 0 for false
  medicalAlertText?: string;
  metadata?: { [key: string]: any };
  middleName?: string;
  mobilePhone?: string;
  mobilePhoneCountry?: string; // ISO country code
  nhsNumber?: string;
  niNumber?: string;
  ppsNumber?: string;
  preferredName?: string;
  preferredPhoneNumber?: IPreferredPhoneNumber; // 1 for home, 2 for work, 3 for mobile
  recallMethod?: IRecallMethod; // Default is Letter
  siteId?: string;
  town?: string;
  useEmail?: boolean; // Default true
  useSms?: boolean; // Default true
  workPhone?: string;
  workPhoneCountry?: string; // ISO country code
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactPhoneCountry?: string; // ISO country code
}

interface EditPatient extends CreatePatient {}

interface ListPatient {
  query?: string;
  updatedAfter?: Date;
  createdAfter?: Date;
  paymentPlanId?: number;
  siteId?: string;
}

interface ListPatientStats {
  createdAtAfter?: Date;
  createdAtBefore?: Date;
  updatedAtfter?: Date;
  updatedAtBefore?: Date;
}

