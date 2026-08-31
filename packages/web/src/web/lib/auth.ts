import { createAuthClient } from "better-auth/react";

// Standard Better Auth client. Session lives in a same-origin cookie, so the
// API (served from the same host in production) is authenticated automatically.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_WEBSITE_URL ?? window.location.origin,
  basePath: "/api/auth",
});

export const useSession = authClient.useSession;
