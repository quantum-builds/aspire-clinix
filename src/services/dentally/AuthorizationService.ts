import { axiosDentallyInstance, ENDPOINTS } from "@/config/api-config";
import {
  GetATokenParams,
  RequestAuthorizationParams,
} from "@/types/dentally-authentication";
import { convertSnakeCaseToCamelCase } from "@/utils/typeConventionConvertor";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const requestAuthorization = async (
  params: RequestAuthorizationParams
) => {
  try {
    const reqParams = convertSnakeCaseToCamelCase(params);

    const response = await axiosDentallyInstance.get(
      ENDPOINTS.auth.dentallyPatientRegister,
      { params: { reqParams } }
    );
    const data = response.data;
    if (params.state && data.state !== params.state) {
      throw new Error(
        "Request has been created by third party. Process aborted"
      );
    }
    return data;
  } catch (error) {
    console.log("Error in requesting authorization", error);
  }
};
export const { mutate: getAToken ,isPending:LoadingGetAToken} = useMutation({
  mutationFn: async (params: GetATokenParams) => {
    const reqParams = convertSnakeCaseToCamelCase(params);

    if (reqParams.grantType !== "authorization_code") {
      throw new Error("Invalid grant_type");
    }

    const response = await axiosDentallyInstance.post(
      ENDPOINTS.auth.getAToken,
      { params: { reqParams } }
    );

    const data = response.data;

    // Rolling 2 weeks expiry date as mentioned in docs
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14);

    // Set token in cookies
    Cookies.set("dentally_access_token", data.accessToken, {
      expires: expiryDate,
    });

    return data;
  },
  onError: (error) => {
    console.error("Error in getting a token:", error);
  },
  onSuccess: (data) => {
    console.log("Token retrieved successfully:", data);
  },
});
