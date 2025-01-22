import { axiosInstance, ENDPOINTS } from "@/config/api-config";

export const fetchAppointments = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.appointment.get, {});
    const appointments = response.data.data;
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
};
