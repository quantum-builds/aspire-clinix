import { hashPassword } from "../src/utils/passwordUtils";
import {
  AppointmentServices,
  AppointmentStatus,
} from "../src/constants/AppointmentConstants";
import { PatientTreatmentStatus } from "../src/constants/PatientTreatmentStatus";
import { UserRoles } from "../src/constants/UserRoles";
import { PrismaClient } from "@prisma/client";
import App from "next/app";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword("securepassword");

  const user0 = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      role: UserRoles.ADMIN,
    },
  });

  // Upsert Users
  const user1 = await prisma.user.upsert({
    where: { email: "patient1@example.com" },
    update: {},
    create: {
      email: "patient1@example.com",
      password: hashedPassword,
      role: UserRoles.PATIENT,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "dentist1@example.com" },
    update: {},
    create: {
      email: "dentist1@example.com",
      password: hashedPassword,
      role: UserRoles.DENTIST,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "patient2@example.com" },
    update: {},
    create: {
      email: "patient2@example.com",
      password: hashedPassword,
      role: UserRoles.PATIENT,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: "dentist2@example.com" },
    update: {},
    create: {
      email: "dentist2@example.com",
      password: hashedPassword,
      role: UserRoles.DENTIST,
    },
  });

  const user5 = await prisma.user.upsert({
    where: { email: "patient3@example.com" },
    update: {},
    create: {
      email: "patient3@example.com",
      password: hashedPassword,
      role: UserRoles.PATIENT,
    },
  });

  const user6 = await prisma.user.upsert({
    where: { email: "dentist3@example.com" },
    update: {},
    create: {
      email: "dentist3@example.com",
      password: hashedPassword,
      role: UserRoles.DENTIST,
    },
  });

  const admin = await prisma.admin.upsert({
    where: { userId: user0.id },
    update: {},
    create: {
      userId: user0.id,
    },
  });

  // Upsert Patients
  const patient1 = await prisma.patient.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      email: "patient1@example.com",
      address: "123 Patient St.",
      dateOfBirth: new Date("1990-01-01T00:00:00Z"),
      mobileNumber: "1234567890",
      name: "John Doe",
      userId: user1.id,
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      email: "patient2@example.com",
      address: "123 Patient St.",
      dateOfBirth: new Date("1990-01-01T00:00:00Z"),
      mobileNumber: "1234567891",
      name: "John Doe",
      userId: user3.id,
    },
  });
  const patient3 = await prisma.patient.upsert({
    where: { userId: user5.id },
    update: {},
    create: {
      email: "patient3@example.com",
      address: "123 Patient St.",
      dateOfBirth: new Date("1990-01-01T00:00:00Z"),
      mobileNumber: "1234567892",
      name: "John Doe",
      userId: user5.id,
    },
  });
  // Upsert Dentists
  const dentist1 = await prisma.dentist.upsert({
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

  const dentist2 = await prisma.dentist.upsert({
    where: { userId: user4.id },
    update: {},
    create: {
      email: "dentist2@example.com",
      GDCnumber: "GDC123457",
      address: "456 Dentist Ave.",
      mobileNumber: "9876543211",
      name: "Dr. Smith",
      specialty: "Orthodontics",
      userId: user4.id,
      yearsOfExperience: 10,
    },
  });
  const dentist3 = await prisma.dentist.upsert({
    where: { userId: user6.id },
    update: {},
    create: {
      email: "dentist3@example.com",
      GDCnumber: "GDC123458",
      address: "456 Dentist Ave.",
      mobileNumber: "9876543212",
      name: "Dr. Smith",
      specialty: "Orthodontics",
      userId: user6.id,
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

  // Upsert Patient Treatments
  await prisma.patientTreatment.upsert({
    where: {
      patientId_treatmentId_treatmentDate: {
        patientId: patient1.id,
        treatmentId: treatment1.id,
        treatmentDate: new Date("2025-01-20T10:30:00Z"),
      },
    },
    update: {},
    create: {
      dentistId: dentist1.id,
      patientId: patient1.id,
      treatmentId: treatment1.id,
      treatmentDate: new Date("2025-01-20T10:30:00Z"),
      treatmentStatus: PatientTreatmentStatus.COMPLETED,
    },
  });

  // Upsert Appointments
  const appointment1 = await prisma.appointment.upsert({
    where: {
      dentistId_patientId_appointmentDate: {
        patientId: patient3.id,
        dentistId: dentist1.id,
        appointmentDate: new Date("2025-01-21T10:30:00Z"),
      },
    },
    update: {},
    create: {
      dentistId: dentist3.id,
      patientId: patient1.id,
      service: AppointmentServices.ROOT_CANAL,
      appointmentDate: new Date("2025-01-21T10:30:00Z"),
      appointmentStatus: AppointmentStatus.CONFIRMED,
    },
  });

  const appointment2 = await prisma.appointment.upsert({
    where: {
      dentistId_patientId_appointmentDate: {
        patientId: patient1.id,
        dentistId: dentist1.id,
        appointmentDate: new Date("2025-01-22T20:00:00Z"),
      },
    },
    update: {},
    create: {
      dentistId: dentist1.id,
      patientId: patient1.id,
      service: AppointmentServices.FILLING,
      appointmentDate: new Date("2025-01-22T20:00:00Z"),
      appointmentStatus: AppointmentStatus.CONFIRMED,
    },
  });

  const appointment3 = await prisma.appointment.upsert({
    where: {
      dentistId_patientId_appointmentDate: {
        patientId: patient1.id,
        dentistId: dentist2.id,
        appointmentDate: new Date("2025-01-23T10:30:00Z"),
      },
    },
    update: {},
    create: {
      dentistId: dentist2.id,
      patientId: patient1.id,
      service: AppointmentServices.CHECKUP,
      appointmentDate: new Date("2025-01-23T10:30:00Z"),
      appointmentStatus: AppointmentStatus.PENDING,
    },
  });

  const appointment4 = await prisma.appointment.upsert({
    where: {
      dentistId_patientId_appointmentDate: {
        patientId: patient1.id,
        dentistId: dentist1.id,
        appointmentDate: new Date("2025-01-23T12:00:00Z"),
      },
    },
    update: {},
    create: {
      dentistId: dentist1.id,
      patientId: patient1.id,
      service: AppointmentServices.ORTHODONTIC_CONSULTATION,
      appointmentDate: new Date("2025-01-23T12:00:00Z"),
      appointmentStatus: AppointmentStatus.CONFIRMED,
    },
  });
  const appointment5 = await prisma.appointment.upsert({
    where: {
      dentistId_patientId_appointmentDate: {
        patientId: patient1.id,
        dentistId: dentist2.id,
        appointmentDate: new Date("2025-01-19T10:30:00Z"),
      },
    },
    update: {},
    create: {
      dentistId: dentist2.id,
      patientId: patient1.id,
      appointmentDate: new Date("2025-01-19T10:30:00Z"),
      service: AppointmentServices.ROOT_CANAL,
      downloadReport: "this is patient report",
    },
  });

  const appointment6 = await prisma.appointment.upsert({
    where: {
      dentistId_patientId_appointmentDate: {
        patientId: patient1.id,
        dentistId: dentist3.id,
        appointmentDate: new Date("2025-01-18T09:00:00Z"),
      },
    },
    update: {},
    create: {
      dentistId: dentist3.id,
      patientId: patient1.id,
      appointmentDate: new Date("2025-01-18T09:00:00Z"),
      service: AppointmentServices.EMERGENCY_VISIT,
      downloadReport: "this is patient report",
    },
  });

  console.log("Seeded data successfully!");
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
