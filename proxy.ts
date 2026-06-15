import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicPaths = ["/login", "/signup"];

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isPublic = publicPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p),
  );

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if (!isLoggedIn && !isPublic) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon\\.ico).*)"],
};
