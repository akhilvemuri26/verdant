import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/", "/auth/login", "/auth/signup"]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  // Allow public paths
  if (publicPaths.includes(path)) {
    return res
  }

  // Check for authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Special handling for onboarding path
  if (path === "/onboarding") {
    try {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .single()

      // If they have a profile, redirect to dashboard
      if (profile) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Otherwise let them continue to onboarding
      return res
    } catch (error) {
      console.error("Error checking profile:", error)
      return res
    }
  }

  // For all other protected routes, check if they need onboarding
  try {
    const { data: profile } = await supabase.from("user_profiles").select("id").eq("user_id", session.user.id).single()

    if (!profile) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  } catch (error) {
    console.error("Error checking profile:", error)
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quiz/:path*",
    "/profile/:path*",
    "/goals/:path*",
    "/social/:path*",
    "/world/:path*",
    "/onboarding/:path*",
  ],
}

