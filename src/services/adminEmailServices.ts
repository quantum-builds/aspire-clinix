import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response, UserRoles } from "@/types/common";
import { useMutation } from "@tanstack/react-query";

export const useSendEmailToAdmin = () => {
  return useMutation({
    mutationFn: async ({
      subject,
      html,
    }: {
      subject: string;
      html: string;
    }) => {
      const response: Response<null> = await axiosInstance.post(
        ENDPOINTS.email.sendEmailToAdmin,
        {
          subject,
          html,
        },
      );
      return response;
    },
  });
};

// export async function sendEmail({
//   subject,
//   text,
// }: {
//   subject: string;
//   text: string;
// }) {
//   try {
//     const response = await axiosInstance.post(ENDPOINTS.email.sendEmail, {
//       subject,
//       text,
//     });

//     console.log("Email sent response: ", response.data);
//     return response.data;
//   } catch (error) {
//     console.log("Error in sending email", error);
//     throw error;
//   }
// }

// export const useSendEmail = () => {
//   return useMutation({
//     mutationFn: async ({
//       subject,
//       html,
//     }: {
//       subject: string;
//       html: string;
//     }) => {
//       const response: Response<null> = await axiosInstance.post(
//         ENDPOINTS.email.sendEmail,
//         {
//           subject,
//           html,
//         }
//       );
//       return response;
//     },
//   });
// };
