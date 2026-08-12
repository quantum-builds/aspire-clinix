import { Resend } from "resend";

console.log("Resend API key is:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;