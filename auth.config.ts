import type { AuthConfig } from "@auth0/nextjs-auth0"

export const authConfig: AuthConfig = {
  session: {
    absoluteDuration: 7200, // 2 hours in seconds
  },
  auth0Logout: true,
  baseURL: process.env.AUTH0_BASE_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  routes: {
    callback: "/api/auth/callback",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
}

