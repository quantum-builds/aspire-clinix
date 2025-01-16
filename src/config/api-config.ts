import axios from "axios";

export const ENDPOINTS = {
  auth: {
    register: `/auth/register`,
  },

  referralForm: {
    create: `/api/referral`,
  },
};

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
