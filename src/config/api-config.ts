import { AppointmentDateType } from "@/types/common";
import { convertCamelCaseToSnakeCase } from "@/utils/typeConventionConvertor";
import { ReferralRequestStatus } from "@prisma/client";
import axios from "axios";

const DENTALLY_BASE_URL = "https://api.dentally.co";

export const ENDPOINTS = {
  auth: {
    register: `/auth/register`,
    dentallyPatientRegister: "/oauth/authorize",
    getAToken: "/oauth/token",
  },

  patient: {
    // create: `/v1/patients`,
    // get: (id: string) => `/v1/patients/${id}`,
    // put: (id: string) => `/v1/patients/${id}`,
    // delete: (id: string) => `/v1/patients/${id}`,
    // list: (queryParams: ListPatient) => {
    //   const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

    //   const queryString = new URLSearchParams(
    //     Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
    //       if (value !== undefined && value !== null) {
    //         acc[key] =
    //           value instanceof Date ? value.toISOString() : value.toString();
    //       }
    //       return acc;
    //     }, {} as Record<string, string>)
    //   ).toString();

    //   return `/v1/patients?${queryString}`;
    // },
    // getStats: (id: string) => `v1/patients/${id}/stats`,
    // listStats: (queryParams: ListPatientStats) => {
    //   const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

    //   const queryString = new URLSearchParams(
    //     Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
    //       if (value !== undefined && value !== null) {
    //         acc[key] =
    //           value instanceof Date ? value.toISOString() : value.toString();
    //       }
    //       return acc;
    //     }, {} as Record<string, string>)
    //   ).toString();

    //   return `/v1/patient_stats?${queryString}`;
    // },

    createPatient: "/api/patient",
    getPatient: `/api/patient`,
    editPatient: `/api/patient`,
  },

  dentist: {
    // get: (id: string) => `/v1/practitioners/${id}`,
    // put: (id: string) => `/v1/practitioners/${id}`,
    // list: (queryParams: ListDentist) => {
    //   const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

    //   const queryString = new URLSearchParams(
    //     Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
    //       if (value !== undefined && value !== null) {
    //         acc[key] =
    //           value instanceof Date ? value.toISOString() : value.toString();
    //       }
    //       return acc;
    //     }, {} as Record<string, string>)
    //   ).toString();

    //   return `/v1/practitioners?${queryString}`;
    // },
    createDentist: "/api/dentist",
    getDentist: `/api/dentist`,
    editDentist: `/api/dentist`,
  },

  admin: {
    createAdmin: "/api/admin",
    getAdmin: "/api/admin",
    editAdmin: "/api/admin",
  },

  // appointment: {
  //   create: "/v1/appointments",
  //   get: (id: number) => `/v1/appointments/${id}`,
  //   put: (id: number) => `/v1/appointments/${id}`,
  //   delete: (id: number) => `/v1/appointments/${id}`,
  //   reason: (deleted: boolean) => `/v1/appointment_reasons/${deleted}`,
  //   list: (queryParams: ListAppointment) => {
  //     const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

  //     const queryString = new URLSearchParams(
  //       Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
  //         if (value !== undefined && value !== null) {
  //           acc[key] =
  //             value instanceof Date ? value.toISOString() : value.toString();
  //         }
  //         return acc;
  //       }, {} as Record<string, string>)
  //     ).toString();

  //     return `/v1/appointments?${queryString}`;
  //   },
  //   available: (queryParams: ListAppointment) => {
  //     const snakeCaseParams = convertCamelCaseToSnakeCase(queryParams);

  //     const queryString = new URLSearchParams(
  //       Object.entries(snakeCaseParams).reduce((acc, [key, value]) => {
  //         if (value !== undefined && value !== null) {
  //           acc[key] =
  //             value instanceof Date ? value.toISOString() : value.toString();
  //         }
  //         return acc;
  //       }, {} as Record<string, string>)
  //     ).toString();

  //     return `/v1/appointments/availability?${queryString}`;
  //   },
  // },

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
    getById: (id: string) => `/api/referrals/${id}`,
    get: `/api/referral`,
    update: (id: string) => `/api/referrals/${id}`,
    delete: (id: string) => `/api/referrals/${id}`,
  },

  referralRequest: {
    get: (
      page?: number,
      search?: string,
      on?: string,
      before?: string,
      after?: string,
      status?: string
    ) =>
      `/api/referral-requests?page=${page ?? 1}&search=${search ?? ""}&on=${
        on ?? ""
      }&before=${before ?? ""}&after=${after ?? ""}&status=${status ?? ""}`,
    getById: (id: string) => `/api/referral-requests/${id}`,
  },

  email: {
    sendEmail: "/api/send-email",
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

  s3: {
    getSignedUrl: "/api/s3",
  },
  uploads: {
    getMedia: "/api/uploads",
  },

  resources: {
    getAll: (page?: number, fileType?: string, search?: string) =>
      `/api/resources?page=${page}&fileType=${fileType}&search=${search}`,
  },

  practices: {
    getAll: (page?: number, search?: string, status?: string) =>
      `/api/practices?page=${page ?? 1}&search=${search ?? ""}&status=${
        status ?? ""
      }`,
    getById: (id: string) => `/api/practices/${id}`,
    createPractice: "/api/practices",
  },

  appointemt: {
    get: (
      page?: number,
      search?: string,
      on?: string,
      before?: string,
      after?: string,
      dateType?: AppointmentDateType | null,
      status?: string
    ) =>
      `/api/appointments?page=${page ?? 1}&search=${search ?? ""}&on=${
        on ?? ""
      }&before=${before ?? ""}&after=${after ?? ""}&dateType=${
        dateType ?? ""
      }&status=${status ?? ""}`,
    post: "/api/appointments",
    patch: (id: string, patientId?: string, dentistId?: string) =>
      `/api/appointments/${id}?patientId=${patientId ?? ""}&dentistId=${
        dentistId ?? ""
      }`,
    getById: (id: string) => `/api/appointments/${id}`,
  },

  dentistToPractice: {
    get: (dentistId?: string, practiceId?: string, status?: string) =>
      `/api/dentist-practice?dentistId=${dentistId ?? ""}&practiceId=${
        practiceId ?? ""
      }&status=${status ?? ""}`,
    create: (status: string, dentistId?: string, practiceId?: string) =>
      `/api/dentist-practice?dentistId=${dentistId ?? ""}&practiceId=${
        practiceId ?? ""
      }&status=${status ?? ""}`,
    updatedStatus: (dentistId?: string, practiceId?: string, status?: string) =>
      `/api/dentist-practice?dentistId=${dentistId ?? ""}&practiceId=${
        practiceId ?? ""
      }&status=${status ?? ""}`,
  },

  reports: {
    get: (
      search?: string,
      appointmentId?: string,
      on?: string,
      before?: string,
      after?: string
    ) =>
      `/api/reports?search=${search ?? ""}&appointmentId=${
        appointmentId ?? ""
      }&on=${on ?? ""}&before=${before ?? ""}&after=${after ?? ""}`,
    create: "/api/reports",
  },

  products: {
    getAll: (search?: string, page?: number, limit?: number) =>
      `/api/products?search=${search}&page=${page}&limit=${limit}`,
  },

  cartProduct: {
    getAll: (patientId?: string) => `/api/cart-product?patientId=${patientId}`,
    addToCart: "/api/cart-product",
    deletecartProduct: (patientId: string, productId: string) =>
      `/api/cart-product/${productId}?patientId=${patientId}`,
  },

  stripe: {
    buyProducts: "/api/stripe/product/checkout",
  },

  appointemtRequest: {
    get: (
      page?: number,
      search?: string,
      on?: string,
      before?: string,
      after?: string,
      status?: string
    ) =>
      `/api/appointment-requests?page=${page ?? 1}&search=${search ?? ""}&on=${
        on ?? ""
      }&before=${before ?? ""}&after=${after ?? ""}&status=${status ?? ""}`,

    getById: (id: string) => `/api/appointment-requests/${id}`,
    post: "/api/appointment-requests",
    delete: (id: string, patientId: string) =>
      `/api/appointment-requests/${id}?patientId=${patientId}`,
    patch: (id: string) => `/api/appointment-requests/${id}`,
  },
};

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const axiosDentallyInstance = axios.create({
  baseURL: DENTALLY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
