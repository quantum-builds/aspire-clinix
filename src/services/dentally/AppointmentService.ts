import { axiosDentallyInstance, ENDPOINTS } from "@/config/api-config";
import { convertCamelCaseToSnakeCase } from "@/utils/typeConventionConvertor";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const getAnAppointment = async (id: number) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.appointment.get(id),
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.log("Error in getting the appointment ", error);
  }
};

export const { mutate: createAppointment } = useMutation({
  mutationFn: async ({ appointment }: { appointment: CreateAppointment }) => {
    const reqParams = convertCamelCaseToSnakeCase(appointment);
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.post(
      ENDPOINTS.appointment.create,
      { params: { reqParams } },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  },
  onError: (error) => {
    console.error("Error creating appointment:", error);
  },
  onSuccess: (data) => {
    console.log("Appointment created successfully:", data);
  },
});

export const { mutate: updateAppointment } = useMutation({
  mutationFn: async ({
    appointment,
    id,
  }: {
    appointment: Partial<CreateAppointment>;
    id: number;
  }) => {
    const reqParams = convertCamelCaseToSnakeCase(appointment);
    const accessToken = Cookies.get("dentally_access_token");

    const response = await axiosDentallyInstance.put(
      ENDPOINTS.appointment.put(id),
      { params: { reqParams } },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  },
  onError: (error) => {
    console.error("Error updating appointment:", error);
  },
  onSuccess: (data) => {
    console.log("Appointment updated successfully:", data);
  },
});

export const { mutate: deleteAppointment } = useMutation({
  mutationFn: async (id: number) => {
    const accessToken = Cookies.get("dentally_access_token");

    const response = await axiosDentallyInstance.delete(
      ENDPOINTS.appointment.delete(id),
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return response.data;
  },
  onError: (error) => {
    console.error("Error deleting appointment:", error);
  },
  onSuccess: (data) => {
    console.log("Appointment deleted successfully:", data);
  },
});

export const listAppointment = async (queryParams: ListPatient) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.appointment.list(queryParams),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in listing appointment", error);
  }
};

export const availableAppointment = async (queryParams: ListPatient) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.appointment.available(queryParams),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in listing appointment", error);
  }
};

export const reasonsForAppointment = async (deleted: boolean) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.appointment.reason(deleted),
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.log("Error in getting reasons for the appointment ", error);
  }
};
