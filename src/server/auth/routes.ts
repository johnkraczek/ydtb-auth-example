/**
 * An array of routes that are accessable to the public.
 * These routes do not need to be authenticated.
 */
export const publicRoutes = ["/", "/kb/learn-more", "/verify-email", "/test"];

/**
 * An array of routes that are used for authentication.
 * these routes must be public to allow the authentication process.
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/verify-reset",
  "/reset",
];

/**
 * The prefix for all authentication api routes.
 * Routes that start with this prefix are used for api authentication purposes
 * these are also public.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
