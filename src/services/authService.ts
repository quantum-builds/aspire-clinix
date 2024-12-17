// import axiosInstance from "./axiosInstance";

// let token: string | null = null;

// export async function registerUser (email:string, password:string, confirmPassword:string):Promise<>{
// try{
//   const response=await axiosInstance.post<>("", {email, password, confirmPassword})
//   return response.data;
// }catch(error){
//   throw error;
// }
// }

// export const loginUser = async (credentials: {
//   email: string;
//   password: string;
// }) => {
//   const response = await axiosInstance.post("", credentials);
//   token = response.data.token;
//   return response.data;
// };

// // Function to fetch protected data
// export const getProtectedData = async () => {
//   const response = await axiosInstance.get("/protected-route", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// // Function to log out
// export const logoutUser = async () => {
//   await axiosInstance.post("/auth/logout");
//   token = null;
// };
