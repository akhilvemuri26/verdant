import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    // Check if user has a profile
    const { data: profile } = await supabase.from("user_profiles").select("id").single()

    // If no profile exists, this is a new signup - redirect to onboarding
    if (!profile) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  // Otherwise redirect to dashboard (existing user)
  return NextResponse.redirect(new URL("/dashboard", request.url))
}

