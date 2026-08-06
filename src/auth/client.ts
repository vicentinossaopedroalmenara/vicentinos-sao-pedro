import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3002";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
