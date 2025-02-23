"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { UserProfileForm } from "@/components/user-profile-form"
import { supabase } from "@/lib/supabase"

export default function OnboardingPage() {
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Check if user has already completed onboarding
    async function checkProfile() {
      try {
        const { data, error } = await supabase.from("user_profiles").select("id").eq("user_id", user.id).maybeSingle() // Use maybeSingle() instead of single() to handle no rows gracefully

        // If they have a profile, redirect to dashboard
        if (data) {
          router.push("/dashboard")
        }
        // If no profile exists (data is null), stay on onboarding page
      } catch (error) {
        console.error("Error checking profile:", error)
      }
    }

    checkProfile()
  }, [user, router])

  if (!user) return null

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Verdant</h1>
        <p className="text-muted-foreground mt-2">
          Let's get to know your environmental impact. This will help us personalize your experience.
        </p>
      </div>
      <UserProfileForm />
    </div>
  )
}

