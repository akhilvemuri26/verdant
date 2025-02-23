import { supabase } from "@/lib/supabase"
import type { Goal } from "@/lib/supabase/schema"

export type GoalError = {
  message: string
  details?: unknown
}

export async function completeGoal(goalId: string, userId: string): Promise<void> {
  try {
    console.log("Starting goal completion for:", { goalId, userId })

    // Start a Supabase transaction
    const { data: goal, error: goalError } = await supabase.from("goals").select("*").eq("id", goalId).single()

    console.log("Goal fetch result:", { goal, error: goalError })

    if (goalError) {
      console.error("Goal fetch error:", goalError)
      throw {
        message: "Failed to fetch goal details",
        details: goalError,
      }
    }

    if (!goal) {
      console.error("Goal not found:", goalId)
      throw {
        message: "Goal not found",
        details: { goalId },
      }
    }

    // First verify the user_profiles table
    const { data: profile, error: profileCheckError } = await supabase
      .from("user_profiles")
      .select("id, eco_score, goals_completed")
      .eq("user_id", userId)
      .single()

    console.log("Profile check result:", { profile, error: profileCheckError })

    if (profileCheckError) {
      console.error("Profile check error:", profileCheckError)
      throw {
        message: "Failed to verify user profile",
        details: profileCheckError,
      }
    }

    if (!profile) {
      console.error("Profile not found for user:", userId)
      // Create profile if it doesn't exist
      const { error: createProfileError } = await supabase.from("user_profiles").insert([
        {
          user_id: userId,
          eco_score: 0,
          goals_completed: 0,
        },
      ])

      if (createProfileError) {
        console.error("Profile creation error:", createProfileError)
        throw {
          message: "Failed to create user profile",
          details: createProfileError,
        }
      }
    }

    // Update goal status
    const { error: updateError } = await supabase
      .from("goals")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .eq("user_id", userId)

    console.log("Goal update result:", { error: updateError })

    if (updateError) {
      console.error("Goal update error:", updateError)
      throw {
        message: "Failed to update goal status",
        details: updateError,
      }
    }

    // Calculate points
    let points = goal.impact || 5
    switch (goal.timeline) {
      case "daily":
        points *= 1
        break
      case "weekly":
        points *= 2
        break
      case "monthly":
        points *= 5
        break
      case "yearly":
        points *= 10
        break
    }

    console.log("Calculated points:", { points, timeline: goal.timeline, impact: goal.impact })

    // Update profile with separate calls to ensure both operations complete
    const { error: ecoScoreError } = await supabase
      .from("user_profiles")
      .update({ eco_score: profile ? profile.eco_score + points : points })
      .eq("user_id", userId)

    console.log("Eco score update result:", { error: ecoScoreError })

    if (ecoScoreError) {
      console.error("Eco score update error:", ecoScoreError)
      throw {
        message: "Failed to update eco score",
        details: ecoScoreError,
      }
    }

    const { error: goalsCompletedError } = await supabase
      .from("user_profiles")
      .update({ goals_completed: profile ? profile.goals_completed + 1 : 1 })
      .eq("user_id", userId)

    console.log("Goals completed update result:", { error: goalsCompletedError })

    if (goalsCompletedError) {
      console.error("Goals completed update error:", goalsCompletedError)
      throw {
        message: "Failed to update goals completed count",
        details: goalsCompletedError,
      }
    }
  } catch (error) {
    console.error("Complete goal error:", error)
    throw error
  }
}

export async function undoCompleteGoal(goalId: string, userId: string): Promise<void> {
  try {
    console.log("Starting goal completion undo for:", { goalId, userId })

    // Get goal details
    const { data: goal, error: goalError } = await supabase.from("goals").select("*").eq("id", goalId).single()

    console.log("Goal fetch result:", { goal, error: goalError })

    if (goalError) {
      console.error("Goal fetch error:", goalError)
      throw {
        message: "Failed to fetch goal details",
        details: goalError,
      }
    }

    if (!goal) {
      console.error("Goal not found:", goalId)
      throw {
        message: "Goal not found",
        details: { goalId },
      }
    }

    // Get current profile stats
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("eco_score, goals_completed")
      .eq("user_id", userId)
      .single()

    console.log("Profile fetch result:", { profile, error: profileError })

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      throw {
        message: "Failed to fetch user profile",
        details: profileError,
      }
    }

    if (!profile) {
      console.error("Profile not found:", userId)
      throw {
        message: "User profile not found",
        details: { userId },
      }
    }

    // Calculate points to remove
    let points = goal.impact || 5
    switch (goal.timeline) {
      case "daily":
        points *= 1
        break
      case "weekly":
        points *= 2
        break
      case "monthly":
        points *= 5
        break
      case "yearly":
        points *= 10
        break
    }

    console.log("Points to remove:", { points, timeline: goal.timeline, impact: goal.impact })

    // Update goal status
    const { error: updateError } = await supabase
      .from("goals")
      .update({
        completed: false,
        completed_at: null,
      })
      .eq("id", goalId)
      .eq("user_id", userId)

    console.log("Goal update result:", { error: updateError })

    if (updateError) {
      console.error("Goal update error:", updateError)
      throw {
        message: "Failed to update goal status",
        details: updateError,
      }
    }

    // Update profile stats
    const { error: profileUpdateError } = await supabase
      .from("user_profiles")
      .update({
        eco_score: Math.max(0, profile.eco_score - points),
        goals_completed: Math.max(0, profile.goals_completed - 1),
      })
      .eq("user_id", userId)

    console.log("Profile update result:", { error: profileUpdateError })

    if (profileUpdateError) {
      console.error("Profile update error:", profileUpdateError)
      throw {
        message: "Failed to update user profile",
        details: profileUpdateError,
      }
    }
  } catch (error) {
    console.error("Undo complete goal error:", error)
    throw error
  }
}

export async function getGoals(userId: string): Promise<Goal[]> {
  try {
    console.log("Fetching goals for user:", userId)

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    console.log("Goals fetch result:", { count: data?.length, error })

    if (error) {
      console.error("Goals fetch error:", error)
      throw {
        message: "Failed to fetch goals",
        details: error,
      }
    }

    return data || []
  } catch (error) {
    console.error("Get goals error:", error)
    throw error
  }
}

