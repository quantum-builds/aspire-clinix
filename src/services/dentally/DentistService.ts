// import { axiosDentallyInstance, ENDPOINTS } from "@/config/api-config";
// import { convertCamelCaseToSnakeCase } from "@/utils/typeConventionConvertor";
// import { useMutation } from "@tanstack/react-query";
// import Cookies from "js-cookie";
// import { string } from "zod";

// export const getADentist = async (id: string) => {
//   try {
//     const accessToken = Cookies.get("dentally_access_token");
//     const response = await axiosDentallyInstance.get(
//       ENDPOINTS.dentist.get(id),
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.log("Error in fetching dentist", error);
//   }
// };

// export const { mutate: updateDentist } = useMutation({
//   mutationFn: async ({ dentist, id }: { dentist: EditDentist; id: string }) => {
//     const reqParams = convertCamelCaseToSnakeCase(dentist);
//     const accessToken = Cookies.get("dentally_access_token");

//     const response = await axiosDentallyInstance.put(
//       ENDPOINTS.dentist.put(id),
//       { params: { reqParams } },
//       { headers: { Authorization: `Bearer ${accessToken}` } }
//     );

//     return response.data;
//   },
//   onError: (error) => {
//     console.error("Error updating dentist:", error);
//   },
//   onSuccess: (data) => {
//     console.log("Dentist updated successfully:", data);
//   },
// });

// export const listDentists = async (queryParams: ListDentist) => {
//   try {
//     const accessToken = Cookies.get("dentally_access_token");
//     const response = await axiosDentallyInstance.get(
//       ENDPOINTS.dentist.list(queryParams),
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error in listing dentists", error);
//   }
// };
