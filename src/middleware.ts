import { NextAuthRequest } from "node_modules/next-auth/lib";
import { auth } from "~/server/auth";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "~/server/auth/routes";

export const middleware = auth((req: NextAuthRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const hasError = nextUrl.searchParams.get("error");

  if (isApiAuthRoute) return;
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (hasError) {
        return Response.redirect(
          new URL(DEFAULT_LOGIN_REDIRECT + "?error=" + hasError, nextUrl),
        );
      }

      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
