"use client"

import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser extends User {
  ecoScore?: number
}

// Update the signIn function to use the same email normalization
export async function signIn(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  })

  if (error) {
    console.error("Supabase signin error:", error)
    throw error
  }

  return data.user as AuthUser
}

// Update the signUp function to properly handle email formatting
export async function signUp(email: string, password: string) {
  // Normalize email: trim whitespace and convert to lowercase
  const normalizedEmail = email.trim().toLowerCase()

  // Validate email format
  if (!normalizedEmail.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
    throw new Error("Please enter a valid email address")
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Supabase signup error:", error)
    throw error
  }

  if (!data.user) {
    throw new Error("No user data returned")
  }

  return data.user as AuthUser
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user as AuthUser | null
}

