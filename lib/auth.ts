import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";

const betterAuthUrl = process.env.BETTER_AUTH_URL?.trim().replace(/\/$/, "");
const trustedOrigins = [
  "http://localhost:3000",
  "https://*.vercel.app",
  ...(betterAuthUrl ? [betterAuthUrl] : []),
];

export const auth = betterAuth({
  trustedOrigins,
  baseURL: {
    allowedHosts: ["localhost:3000", "*.vercel.app"],
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 min
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
