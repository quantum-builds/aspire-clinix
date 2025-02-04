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
      const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] =
              value instanceof Date ? value.toISOString() : value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      return `v1/patients?${queryString}`;
    },
    getStats: (id: string) => `v1/patients/${id}/stats`,
    listStats: (queryParams: ListPatientStats) => {
      const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] =
              value instanceof Date ? value.toISOString() : value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      return `v1/patient_stats?${queryString}`;
    },
  },

  dentist: {
    get: (id: string) => `/v1/practitioners/${id}`,
    put: (id: string) => `/v1/practitioners/${id}`,
    list: (queryParams: ListDentist) => {
      const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
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

  referralForm: {
    create: `/api/referral`,
  },

  appointment: {
    get: "/api/patient/appointments",
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
