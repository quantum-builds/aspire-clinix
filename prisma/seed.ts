import { hashPassword } from "../src/utils/passwordUtils";
import { AppointmentStatus } from "../src/constants/AppointmentStatus";
import { PatientTreatmentStatus } from "../src/constants/PatientTreatmentStatus";
import { UserTypes } from "../src/constants/UserRoles";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert Users

  const hashedPassword = await hashPassword("securepassword");
  const user1 = await prisma.user.upsert({
    where: { email: "patient1@example.com" },
    update: {}, // Update nothing if the user exists
    create: {
      email: "patient1@example.com",
      password: hashedPassword,
      role: UserTypes.PATIENT,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "dentist1@example.com" },
    update: {},
    create: {
      email: "dentist1@example.com",
      password: hashedPassword,
      role: UserTypes.DENTIST,
    },
  });

  // Upsert Patient
  const patient = await prisma.patient.upsert({
    where: { userId: user1.id },
    update: {}, // Update nothing if the patient exists
    create: {
      email: "patient1@example.com",
      address: "123 Patient St.",
      dateOfBirth: new Date("1990-01-01"),
      mobileNumber: "1234567890",
      name: "John Doe",
      userId: user1.id,
    },
  });

  // Upsert Dentist
  const dentist = await prisma.dentist.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      email: "dentist1@example.com",
      GDCnumber: "GDC123456",
      address: "456 Dentist Ave.",
      mobileNumber: "9876543210",
      name: "Dr. Smith",
      specialty: "Orthodontics",
      userId: user2.id,
      yearsOfExperience: 10,
    },
  });

  // Upsert Treatments
  const treatment1 = await prisma.treatment.upsert({
    where: { name: "Root Canal" },
    update: {},
    create: {
      name: "Root Canal",
      description: "Procedure to remove infected pulp.",
      cost: 250.0,
    },
  });

  const treatment2 = await prisma.treatment.upsert({
    where: { name: "Teeth Whitening" },
    update: {},
    create: {
      name: "Teeth Whitening",
      description: "Cosmetic procedure to whiten teeth.",
      cost: 150.0,
    },
  });

  // Upsert PatientTreatment
  const patientTreatment = await prisma.patientTreatment.upsert({
    where: {
      patientId_treatmentId_treatmentDate: {
        patientId: patient.id,
        treatmentId: treatment1.id,
        treatmentDate: new Date("2025-01-20"), // Make sure the treatmentDate matches the actual date
      },
    },
    update: {},
    create: {
      dentistId: dentist.id,
      patientId: patient.id,
      treatmentId: treatment1.id,
      treatmentDate: new Date(),
      treatmentStatus: PatientTreatmentStatus.COMPLETED,
    },
  });

  // Upsert Appointments
  const appointment = await prisma.appointment.upsert({
    where: {
      dentistId_patientId_appointmentDate: {
        patientId: patient.id,
        dentistId: dentist.id,
        appointmentDate: new Date("2025-01-20"), // Make sure the appointmentDate matches the actual date
      },
    },
    update: {},
    create: {
      dentistId: dentist.id,
      patientId: patient.id,
      appointmentDate: new Date("2025-01-20"),
      appointmentStatus: AppointmentStatus.SCHEDULED,
    },
  });

  // Upsert ReferralForm
  const referralForm = await prisma.referralForm.upsert({
    where: {
      patientId_dentistId: { patientId: patient.id, dentistId: dentist.id },
    },
    update: {},
    create: {
      medicalHistory: "Diabetes",
      createdAt: new Date(),
      referralDetails: ["Needs orthodontic consultation."],
      treatmentDetails: "Braces required.",
      DOB: "1990-01-01",
      address: "123 Patient St.",
      email: "patient1@example.com",
      mobileNumber: "1234567890",
      name: "John Doe",
      other: "N/A",
      referralAddress: "456 Dentist Ave.",
      referralEmail: "dentist1@example.com",
      referralGDC: "GDC123456",
      referralMobileNumber: "9876543210",
      referralName: "Dr. Smith",
      treatMeantAppointment: "2025-01-20",
      dentistId: dentist.id,
      patientId: patient.id,
    },
  });

  console.log("Seeded data successfully:");
  console.log({
    user1,
    user2,
    patient,
    dentist,
    treatment1,
    treatment2,
    patientTreatment,
    appointment,
    referralForm,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
