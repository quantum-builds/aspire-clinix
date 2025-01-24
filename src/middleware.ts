import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const key = req.cookies.get("key");
  const url = req.nextUrl.clone();

  if (!key && url.pathname !== "/login") {
    url.pathname = "/login";
    url.searchParams.set("callback", req.nextUrl.pathname);
    console.log("url is", url);
    return NextResponse.redirect(url);
  } else if (key && url.pathname === "/login") {
    {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/login"],
};
