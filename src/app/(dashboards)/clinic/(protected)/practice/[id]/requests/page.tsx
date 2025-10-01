import PageTopBar from "@/app/(dashboards)/components/custom-components/PageTopBar";
import { TPractice } from "@/types/practice";
import { DentistRole, GenderType } from "@prisma/client";
import { PracticeDentistDataTable } from "../components/PracticeDentistsDataTable";
import Pagination from "@/app/(dashboards)/components/Pagination";

const PRACTICE_DATA: TPractice[] = [
  {
    id: "1",
    email: "smile@brightdental.com",
    name: "Bright Smile Dental Clinic",
    nhs: true,
    openingHours: {
      Monday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T18:00:00"),
      },
      Tuesday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T18:00:00"),
      },
      Wednesday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T18:00:00"),
      },
      Thursday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T18:00:00"),
      },
      Friday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T17:00:00"),
      },
      Saturday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T13:00:00"),
      },
      Sunday: undefined,
    },
    addressLine1: "123 Health Street",
    addressLine2: "Medical District",
    phoneNumber: "+44 20 7123 4567",
    postcode: "SW1A 1AA",
    timeZone: "Europe/London",
    town: "London",
    logoUrl: "/logos/bright-smile-logo.png",
    logo: "/logos/bright-smile-logo.png",
    dentists: [
      {
        id: "1",
        email: "dr.sarah.johnson@brightdental.com",
        fullName: "Dr. Sarah Johnson",
        phoneNumber: "+44 20 7123 4567",
        country: "United Kingdom",
        dateOfBirth: new Date("1985-03-15"),
        gender: GenderType.FEMALE,
        gdcNo: "GDC123456",
        practiceAddress: "123 Health Street, Medical District, London SW1A 1AA",
        role: DentistRole.RECIEVING_DENTIST,
        fileUrl: "/dentists/dr-sarah-johnson.jpg",
        file: "/dentists/dr-sarah-johnson.jpg",
        createdAt: new Date("2020-03-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        email: "dr.michael.chen@brightdental.com",
        fullName: "Dr. Michael Chen",
        phoneNumber: "+44 20 7123 4568",
        country: "United Kingdom",
        dateOfBirth: new Date("1988-07-22"),
        gender: GenderType.MALE,
        gdcNo: "GDC123457",
        practiceAddress: "123 Health Street, Medical District, London SW1A 1AA",
        role: DentistRole.RECIEVING_DENTIST,
        fileUrl: "/dentists/dr-michael-chen.jpg",
        file: "/dentists/dr-michael-chen.jpg",
        createdAt: new Date("2019-08-22"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        id: "3",
        email: "dr.emma.wilson@premiumdental.co.uk",
        fullName: "Dr. Emma Wilson",
        phoneNumber: "+44 20 7654 3210",
        country: "United Kingdom",
        dateOfBirth: new Date("1987-11-05"),
        gender: GenderType.FEMALE,
        gdcNo: "GDC123458",
        practiceAddress: "456 Quality Road, West End, London W1J 7NT",
        role: DentistRole.RECIEVING_DENTIST,
        fileUrl: "/dentists/dr-emma-wilson.jpg",
        file: "/dentists/dr-emma-wilson.jpg",
        createdAt: new Date("2018-11-05"),
        updatedAt: new Date("2024-01-08"),
      },
      {
        id: "4",
        email: "dr.james.rodriguez@communitydental.org",
        fullName: "Dr. James Rodriguez",
        phoneNumber: "+44 20 8989 1234",
        country: "United Kingdom",
        dateOfBirth: new Date("1979-12-30"),
        gender: GenderType.MALE,
        gdcNo: "GDC123459",
        practiceAddress: "789 Local Avenue, High Street, London N1 2BC",
        role: DentistRole.RECIEVING_DENTIST,
        fileUrl: "/dentists/dr-james-rodriguez.jpg",
        file: "/dentists/dr-james-rodriguez.jpg",
        createdAt: new Date("2017-06-12"),
        updatedAt: new Date("2024-01-12"),
      },
      {
        id: "5",
        email: "dr.lisa.patel@emergencydental.uk",
        fullName: "Dr. Lisa Patel",
        phoneNumber: "+44 20 3456 7890",
        country: "United Kingdom",
        dateOfBirth: new Date("1976-04-18"),
        gender: GenderType.FEMALE,
        gdcNo: "GDC123460",
        practiceAddress: "321 Urgent Care Lane, City Centre, London EC1A 1BB",
        role: DentistRole.RECIEVING_DENTIST,
        fileUrl: "/dentists/dr-lisa-patel.jpg",
        file: "/dentists/dr-lisa-patel.jpg",
        createdAt: new Date("2016-09-30"),
        updatedAt: new Date("2024-01-05"),
      },
    ],
    appointments: [],
  },
  {
    id: "2",
    email: "info@premiumdental.co.uk",
    name: "Premium Dental Care",
    nhs: false,
    openingHours: {
      Monday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T19:00:00"),
      },
      Tuesday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T19:00:00"),
      },
      Wednesday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T19:00:00"),
      },
      Thursday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T19:00:00"),
      },
      Friday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T17:00:00"),
      },
      Saturday: {
        open: new Date("2024-01-01T10:00:00"),
        close: new Date("2024-01-01T14:00:00"),
      },
      Sunday: undefined,
    },
    addressLine1: "456 Quality Road",
    addressLine2: "West End",
    phoneNumber: "+44 20 7654 3210",
    postcode: "W1J 7NT",
    timeZone: "Europe/London",
    town: "London",
    logoUrl: "/logos/premium-dental-logo.png",
    logo: "/logos/premium-dental-logo.png",
    dentists: [],
    appointments: [],
  },
  {
    id: "3",
    email: "hello@communitydental.org",
    name: "Community Dental Practice",
    nhs: true,
    openingHours: {
      Monday: {
        open: new Date("2024-01-01T08:30:00"),
        close: new Date("2024-01-01T17:30:00"),
      },
      Tuesday: {
        open: new Date("2024-01-01T08:30:00"),
        close: new Date("2024-01-01T17:30:00"),
      },
      Wednesday: {
        open: new Date("2024-01-01T08:30:00"),
        close: new Date("2024-01-01T17:30:00"),
      },
      Thursday: {
        open: new Date("2024-01-01T08:30:00"),
        close: new Date("2024-01-01T17:30:00"),
      },
      Friday: {
        open: new Date("2024-01-01T08:30:00"),
        close: new Date("2024-01-01T16:30:00"),
      },
      Saturday: undefined,
      Sunday: undefined,
    },
    addressLine1: "789 Local Avenue",
    addressLine2: "High Street",
    phoneNumber: "+44 20 8989 1234",
    postcode: "N1 2BC",
    timeZone: "Europe/London",
    town: "London",
    logoUrl: "/logos/community-dental-logo.png",
    logo: "/logos/community-dental-logo.png",
    dentists: [],
    appointments: [],
  },
  {
    id: "4",
    email: "contact@emergencydental.uk",
    name: "Emergency Dental Centre",
    nhs: true,
    openingHours: {
      Monday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T20:00:00"),
      },
      Tuesday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T20:00:00"),
      },
      Wednesday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T20:00:00"),
      },
      Thursday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T20:00:00"),
      },
      Friday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T20:00:00"),
      },
      Saturday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T18:00:00"),
      },
      Sunday: {
        open: new Date("2024-01-01T10:00:00"),
        close: new Date("2024-01-01T16:00:00"),
      },
    },
    addressLine1: "321 Urgent Care Lane",
    addressLine2: "City Centre",
    phoneNumber: "+44 20 3456 7890",
    postcode: "EC1A 1BB",
    timeZone: "Europe/London",
    town: "London",
    logoUrl: "/logos/emergency-dental-logo.png",
    logo: "/logos/emergency-dental-logo.png",
    dentists: [],
    appointments: [],
  },
  {
    id: "5",
    email: "info@familydentalpractice.com",
    name: "Family Dental Practice",
    nhs: true,
    openingHours: {
      Monday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T17:00:00"),
      },
      Tuesday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T17:00:00"),
      },
      Wednesday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T17:00:00"),
      },
      Thursday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T17:00:00"),
      },
      Friday: {
        open: new Date("2024-01-01T08:00:00"),
        close: new Date("2024-01-01T16:00:00"),
      },
      Saturday: {
        open: new Date("2024-01-01T09:00:00"),
        close: new Date("2024-01-01T12:00:00"),
      },
      Sunday: undefined,
    },
    addressLine1: "654 Family Road",
    addressLine2: "Suburbia",
    phoneNumber: "+44 20 2233 4455",
    postcode: "SE1 9ZZ",
    timeZone: "Europe/London",
    town: "London",
    logoUrl: "/logos/family-dental-logo.png",
    logo: "/logos/family-dental-logo.png",
    dentists: [],
    appointments: [],
  },
];

export default async function PracticePage(props: { params: { id: string } }) {
  return (
    <div>
      <div className="min-h-[98vh] flex flex-col gap-5">
        <PageTopBar
          pageHeading="Practice Requests"
          showSearch={false}
          showFilters={false}
          showBackBtn={true}
          statusOptions={[]}
        />

        {PRACTICE_DATA[0].dentists?.length && (
          <PracticeDentistDataTable entries={PRACTICE_DATA[0].dentists} />
        )}
        <Pagination page={1} />
      </div>
    </div>
  );
}
