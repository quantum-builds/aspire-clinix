import sendgrid from "@sendgrid/mail";

console.log("api key is ", process.env.SENDGRID_API_KEY);

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export default sendgrid;
