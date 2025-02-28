import { convertCamelCaseToSnakeCase } from "@/utils/typeConventionConvertor";
import axios from "axios";

const DENTALLY_BASE_URL = "https://api.dentally.co";

export const ENDPOINTS = {
  auth: {
    register: `/auth/register`,
    dentallyPatientRegister: "/oauth/authorize",
    getAToken: "/oauth/token",
  },

  patient: {
    create: `/v1/patients`,
    get: (id: string) => `/v1/patients/${id}`,
    put: (id: string) => `/v1/patients/${id}`,
    delete: (id: string) => `/v1/patients/${id}`,
    list: (queryParams: ListPatient) => {
      const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

      const queryString = new URLSearchParams(
        Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] =
              value instanceof Date ? value.toISOString() : value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      return `/v1/patients?${queryString}`;
    },
    getStats: (id: string) => `v1/patients/${id}/stats`,
    listStats: (queryParams: ListPatientStats) => {
      const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

      const queryString = new URLSearchParams(
        Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] =
              value instanceof Date ? value.toISOString() : value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      return `/v1/patient_stats?${queryString}`;
    },
  },

  dentist: {
    get: (id: string) => `/v1/practitioners/${id}`,
    put: (id: string) => `/v1/practitioners/${id}`,
    list: (queryParams: ListDentist) => {
      const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

      const queryString = new URLSearchParams(
        Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] =
              value instanceof Date ? value.toISOString() : value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      return `/v1/practitioners?${queryString}`;
    },
  },

  appointment: {
    create: "/v1/appointments",
    get: (id: number) => `/v1/appointments/${id}`,
    put: (id: number) => `/v1/appointments/${id}`,
    delete: (id: number) => `/v1/appointments/${id}`,
    reason: (deleted: boolean) => `/v1/appointment_reasons/${deleted}`,
    list: (queryParams: ListAppointment) => {
      const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

      const queryString = new URLSearchParams(
        Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] =
              value instanceof Date ? value.toISOString() : value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      return `/v1/appointments?${queryString}`;
    },
    available: (queryParams: ListAppointment) => {
      const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

      const queryString = new URLSearchParams(
        Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] =
              value instanceof Date ? value.toISOString() : value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      return `/v1/appointments/availability?${queryString}`;
    },
  },

  plan: {
    getAll: "/api/plans",
    get: (id: string) => `/api/plans/${id}`,
    update: (id: string) => `/api/plans/${id}`,
    create: "/api/plans",
    delete: (id: string) => `/api/plans/${id}`,
  },

  discount: {
    getAll: "/api/discounts",
    get: (id: string) => `/api/discounts/${id}`,
    update: (id: string) => `/api/discounts/${id}`,
    create: "/api/discounts",
    delete: (id: string) => `/api/discounts/${id}`,
  },

  referralForm: {
    create: `/api/referrals`,
    get: (id: string) => `/api/referrals/${id}`,
    getDentistForms: (dentistId: string) =>
      `/api/referral?dentistId=${dentistId}`,
    update: (id: string) => `/api/referrals/${id}`,
    delete: (id: string) => `/api/referrals/${id}`,
  },

  treatment: {
    create: `/api/treatments`,
    get: (id: string) => `/api/treatments/${id}`,
    getAll: "/api/treatments",
    update: (id: string) => `/api/treatments/${id}`,
    delete: (id: string) => `/api/treatments/${id}`,
  },

  patientTreatment: {
    getAll: (patientId: string) =>
      `/api/patient/treatments?patientId=${patientId}`,
    get: (id: string) => `/api/patient/treatments/${id}`,
    create: `/api/patient/treatments`,
    update: (id: string) => `/api/patient/treatments/${id}`,
    delete: (id: string) => `/api/patient/treatments/${id}`,
  },
};

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosDentallyInstance = axios.create({
  baseURL: DENTALLY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
