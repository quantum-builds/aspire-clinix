import { UserTypes } from "@/utils/userRoles";

const LOGIN = "/login";
const ROOT = "/";

const PUBLIC_ROUTES = ["/login", "/create-account"];

const AUTHERIZED_ROUTES = {
  patient: "/patient/",
  dentist: "/dentist/",
};

export { LOGIN, ROOT, PUBLIC_ROUTES, AUTHERIZED_ROUTES };
