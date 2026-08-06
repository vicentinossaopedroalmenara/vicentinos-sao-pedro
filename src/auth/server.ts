import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "@neondatabase/serverless";

const trustedOrigins = [
  "http://localhost:3002",
  "http://localhost:3000",
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter((url): url is string => Boolean(url));

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL! }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
  plugins: [nextCookies()],
});
