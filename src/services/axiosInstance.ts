// import axios, {
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
//   AxiosError,
// } from "axios";

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: "https://.com",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     const token = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("token="));
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token.split("=")[1]}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
