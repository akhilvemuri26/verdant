"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { AuthUser } from "@/lib/auth"
import { signIn, signUp, signOut, getUser } from "@/lib/auth"
import { AuthError } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const checkAuth = useCallback(async () => {
    try {
      const user = await getUser()
      setUser(user)
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as AuthUser) || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [checkAuth])

  const login = async (email: string, password: string) => {
    try {
      const trimmedEmail = email.trim()

      if (!trimmedEmail.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        throw new Error("Please enter a valid email address")
      }

      const user = await signIn(trimmedEmail, password)
      setUser(user)
      router.push("/dashboard")
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
    } catch (error) {
      console.error("Login failed:", error)
      let message = "An error occurred during login"

      if (error instanceof AuthError) {
        switch (error.code) {
          case "email_address_invalid":
            message = "The email address format is invalid"
            break
          case "invalid_credentials":
            message = "Invalid email or password"
            break
          default:
            message = error.message
        }
      } else if (error instanceof Error) {
        message = error.message
      }

      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      })
      throw new Error(message)
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      // Remove any leading/trailing whitespace from email
      const trimmedEmail = email.trim()

      // Basic email validation
      if (!trimmedEmail.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        throw new Error("Please enter a valid email address")
      }

      const user = await signUp(trimmedEmail, password)
      setUser(user)
      router.push("/dashboard")
      toast({
        title: "Welcome!",
        description: "Please check your email to verify your account.",
      })
    } catch (error) {
      console.error("Signup failed:", error)
      let message = "An error occurred during signup"

      if (error instanceof AuthError) {
        switch (error.code) {
          case "email_address_invalid":
            message = "The email address format is invalid"
            break
          case "user_already_registered":
            message = "An account with this email already exists"
            break
          default:
            message = error.message
        }
      } else if (error instanceof Error) {
        message = error.message
      }

      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      })
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      await signOut()
      setUser(null)
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getAuthErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    "Invalid login credentials": "Invalid email or password",
    "Email not confirmed": "Please verify your email address",
    "User already registered": "An account with this email already exists",
    "Password should be at least 6 characters": "Password must be at least 6 characters",
    email_address_invalid: "Please enter a valid email address",
  }
  return errorMessages[error] || "An error occurred. Please try again."
}

