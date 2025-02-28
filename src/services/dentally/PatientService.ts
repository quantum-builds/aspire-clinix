import { axiosDentallyInstance, ENDPOINTS } from "@/config/api-config";
import { convertCamelCaseToSnakeCase } from "@/utils/typeConventionConvertor";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const { mutate: createPatient } = useMutation({
  mutationFn: async ({ patient }: { patient: CreatePatient }) => {
    const reqParams = convertCamelCaseToSnakeCase(patient);
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.post(
      ENDPOINTS.patient.create,
      { params: { reqParams } },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  },
  onError: (error) => {
    console.error("Error creating patient:", error);
  },
  onSuccess: (data) => {
    console.log("Patient created successfully:", data);
  },
});

export const getAPatient = async (id: string) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.patient.get(id),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching patient", error);
  }
};

export const { mutate: updatePatient } = useMutation({
  mutationFn: async ({
    patient,
    id,
  }: {
    patient: Partial<EditPatient>;
    id: string;
  }) => {
    const reqParams = convertCamelCaseToSnakeCase(patient);
    const accessToken = Cookies.get("dentally_access_token");

    const response = await axiosDentallyInstance.put(
      ENDPOINTS.patient.put(id),
      { params: { reqParams } },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return response.data;
  },
  onError: (error) => {
    console.error("Error updating patient:", error);
  },
  onSuccess: (data) => {
    console.log("Patient updated successfully:", data);
  },
});

export const { mutate: deletePatient } = useMutation({
  mutationFn: async (id: string) => {
    const accessToken = Cookies.get("dentally_access_token");

    const response = await axiosDentallyInstance.delete(
      ENDPOINTS.patient.delete(id),
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return response.data;
  },
  onError: (error) => {
    console.error("Error deleting patient:", error);
  },
  onSuccess: (data) => {
    console.log("Patient deleted successfully:", data);
  },
});

export const listPatients = async (queryParams: ListPatient) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.patient.list(queryParams),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in listing patients", error);
  }
};

export const getPatientStats = async (id: string) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.patient.getStats(id),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getting patient stats", error);
  }
};

export const listPatientStats = async (queryParams: ListPatientStats) => {
  try {
    const accessToken = Cookies.get("dentally_access_token");
    const response = await axiosDentallyInstance.get(
      ENDPOINTS.patient.listStats(queryParams),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in listing patient stats", error);
  }
};
