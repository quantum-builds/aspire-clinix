import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config";
import { CreateAppointment, ListAppointment, TChangeAppointmentState } from "@/types/appointment";
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers";

export async function createAppointment(appointmentData: CreateAppointment) {
  const response = await axiosDentallyInstance.post(
    DENTALLY_ENDPOINTS.appointment.create,
    appointmentData,
  );
  return dentallyErrorHelper(response, DATA_TYPE.APPOINTMENT);
}

export async function editAppointment(
  appointmentId: string,
  appointmentData: TChangeAppointmentState
) {
  const response = await axiosDentallyInstance.patch(
    DENTALLY_ENDPOINTS.appointment.edit(appointmentId),
    { appointment: appointmentData }
  );
  
  return dentallyErrorHelper(response.data, DATA_TYPE.APPOINTMENT);
}

export async function listAppointment(params?: ListAppointment) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.appointment.list(params),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.APPOINTMENTS);
}

export async function getAppointment(id: string) {
  const response = await axiosDentallyInstance.get(
    DENTALLY_ENDPOINTS.appointment.get(id),
  );
  return dentallyErrorHelper(response.data, DATA_TYPE.APPOINTMENT);
}

export async function deleteAppointment(id: string) {
  const response = await axiosDentallyInstance.delete(
    DENTALLY_ENDPOINTS.appointment.delete(id),
  );
  return dentallyErrorHelper(response);
}

export function buildAppointmentQuery(params?: ListAppointment): string {
  if (!params) return "";

  const queryParams = new URLSearchParams();

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date | string): string => {
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date;
  };

  // Add parameters only if they exist
  if (params.page) queryParams.append("page", String(params.page))
  if (params.perPage) queryParams.append("per_page", String(params.perPage))
  if (params.on) queryParams.append("on", formatDate(params.on));
  if (params.before) queryParams.append("before", formatDate(params.before));
  if (params.after) queryParams.append("after", formatDate(params.after));
  if (params.updatedAfter)
    queryParams.append("updated_after", formatDate(params.updatedAfter));
  if (params.practitionerId)
    queryParams.append("practitioner_id", params.practitionerId);
  if (params.patientId) queryParams.append("patient_id", params.patientId);
  if (params.roomId) queryParams.append("room_id", params.roomId);
  if (params.siteId) queryParams.append("site_id", params.siteId);
  if (params.state) queryParams.append("state", params.state);
  if (params.cancelled !== undefined)
    queryParams.append("cancelled", String(params.cancelled));

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
}
