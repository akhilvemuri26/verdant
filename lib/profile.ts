import { supabase } from "./supabase"
import type { UserProfileFormData } from "@/types/profile"

export async function saveUserProfile(userId: string, data: UserProfileFormData) {
  try {
    // First save the profile data
    const { error: profileError } = await supabase.from("user_profiles").upsert({
      user_id: userId,
      ...data,
    })

    if (profileError) throw profileError

    // Get eco score
    const scoreRes = await fetch("/api/eco-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!scoreRes.ok) {
      throw new Error("Failed to calculate eco-score")
    }

    const scoreData = await scoreRes.json()

    // Update the profile with the eco score
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ eco_score: Math.round(scoreData.score * 10) })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Generate initial goals
    const goalsRes = await fetch("/api/generate-goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: data,
        ecoScore: scoreData.score,
      }),
    })

    if (!goalsRes.ok) {
      throw new Error("Failed to generate goals")
    }

    const goalsData = await goalsRes.json()

    // Insert the generated goals
    const { error: goalsError } = await supabase.from("goals").insert(
      goalsData.goals.map((goal: any) => ({
        user_id: userId,
        title: goal.title,
        timeline: goal.timeline,
        category: goal.category,
        completed: false,
      })),
    )

    if (goalsError) throw goalsError
  } catch (error) {
    console.error("Error saving profile:", error)
    throw error
  }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle()

  if (error) throw error
  return data
}

