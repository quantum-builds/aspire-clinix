import { axiosInstance } from "@/config/api-config";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    const response = await axiosInstance.post("/api/send-email", {
      to,
      subject,
      text,
    });

    console.log("Email sent response: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error in sending email", error);
    throw error;
  }
}
