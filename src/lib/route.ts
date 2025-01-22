import { UserRoles } from "@/constants/UserRoles";

const LOGIN = "/login";
const ROOT = "/";

const PUBLIC_ROUTES = ["/login", "/create-account"];

const AUTHERIZED_ROUTES = {
  patient: "/patient",
  dentist: "/dentist",
  admin: "/admin",
};

export { LOGIN, ROOT, PUBLIC_ROUTES, AUTHERIZED_ROUTES };
