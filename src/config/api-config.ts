import { buildAppointmentQuery } from "@/dentallyHelpers/appointment";
import { ListAppointment } from "@/types/appointment";
import { AppointmentDateType } from "@/types/common";
import { toCamel, toSnake } from "@/utils/typeConventionConvertor";
import axios from "axios";


export const ENDPOINTS = {
  auth: {
    register: `/auth/register`,
    dentallyPatientRegister: "/oauth/authorize",
    getAToken: "/oauth/token",
  },

  patient: {
    createPatient: "/api/patient",
    getPatient: (email?: string) => `/api/patient?email=${email ?? null}`,
    getById: (id: string) => `/api/patient/${id}`,
    editPatient: `/api/patient`,
  },

  dentist: {
    createDentist: "/api/referral-dentist",
    getDentist: `/api/referral-dentist`,
    editDentist: `/api/referral-dentist`,
  },

  admin: {
    createAdmin: "/api/admin",
    getAdmin: "/api/admin",
    editAdmin: "/api/admin",
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
    getById: (id: string) => `/api/referrals/${id}`,
    get: `/api/referral`,
    update: (id: string) => `/api/referrals/${id}`,
    delete: (id: string) => `/api/referrals/${id}`,
  },

  referralRequest: {
    get: (
      statsOnly: boolean,
      page?: number,
      search?: string,
      on?: string,
      before?: string,
      after?: string,
      status?: string,
      pageType?: string,
    ) =>
      `/api/referral-requests?page=${page ?? 1}&search=${search ?? ""}&on=${on ?? ""
      }&before=${before ?? ""}&after=${after ?? ""}&status=${status ?? ""}&page-type=${pageType ?? ""}&stats-only=${statsOnly}`,
    getById: (id: string) => `/api/referral-requests/${id}`,
    patch: (id: string) => `/api/referral-requests/${id}`,
    delete: (id: string) => `/api/referral-requests/${id}`,
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
    getAll: (page?: number, fileType?: string, search?: string, on?: string,
      before?: string,
      after?: string,) =>
      `/api/resources?page=${page}&fileType=${fileType}&search=${search}&on=${on ?? ""
      }&before=${before ?? ""}&after=${after ?? ""}`,
    create: "/api/resources",
    delete: (id: string) => `/api/resources/${id}`
  },

  practices: {
    getAll: (page?: number, search?: string, status?: string) =>
      `/api/practices?page=${page ?? 1}&search=${search ?? ""}&status=${status ?? ""
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
      `/api/appointments?page=${page ?? 1}&search=${search ?? ""}&on=${on ?? ""
      }&before=${before ?? ""}&after=${after ?? ""}&dateType=${dateType ?? ""
      }&status=${status ?? ""}`,
    post: "/api/appointments",
    patch: (id: string) =>
      `/api/appointments/${id}`,
    getById: (id: string) => `/api/appointments/${id}`,
  },

  dentistToPractice: {
    get: (dentistId?: string, practiceId?: string, status?: string) =>
      `/api/dentist-practice?dentistId=${dentistId ?? ""}&practiceId=${practiceId ?? ""
      }&status=${status ?? ""}`,
    create: (status: string, dentistId?: string, practiceId?: string) =>
      `/api/dentist-practice?dentistId=${dentistId ?? ""}&practiceId=${practiceId ?? ""
      }&status=${status ?? ""}`,
    updatedStatus: (dentistId?: string, practiceId?: string, status?: string) =>
      `/api/dentist-practice?dentistId=${dentistId ?? ""}&practiceId=${practiceId ?? ""
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
      `/api/reports?search=${search ?? ""}&appointmentId=${appointmentId ?? ""
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
      `/api/appointment-requests?page=${page ?? 1}&search=${search ?? ""}&on=${on ?? ""
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

export const DENTALLY_ENDPOINTS = {
  patient: {
    create: `patients`,
    get: (patientId: string) => `patients/${patientId}`,
    edit: (patientId: string) => `patients/${patientId}`,
    delete: (patientId: string) => `patients/${patientId}`,
    list: (query?: string) =>
      query ? `patients?query=${encodeURIComponent(query)}` : `patients`,
  },
  practitioner: {
    get: (practitionerId: string) => `practitioners/${practitionerId}`,
    edit: (practitionerId: string) => `practitioners/${practitionerId}`,
    list: (dentallyParams: URLSearchParams) => `practitioners?${dentallyParams.toString()}`
  },
  appointment: {
    create: "appointments",
    list: (params?: ListAppointment): string => {
      return `appointments${buildAppointmentQuery(params)}`;
    },
  }
};

const DENTALLY_BASE_URL = process.env.DENTALLY_ENDPOINT;
const DENTALLY_TOKEN = process.env.DENTALLY_TOKEN

export const axiosDentallyInstance = axios.create({
  baseURL: DENTALLY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${DENTALLY_TOKEN}`,
    "User-Agent": "MyApp/1.0"
  },
});


axiosDentallyInstance.interceptors.request.use(async (config) => {
  if (config.data) {
    config.data = toSnake(config.data);
  }
  if (config.params) {
    config.params = toSnake(config.params);
  }
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  if (response.data) {
    response.data = toCamel(response.data);
  }
  return response;
});