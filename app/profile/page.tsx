"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthContext } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import type { Goal } from "@/lib/supabase/schema"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const userEmoji = "🌱"

export default function ProfilePage() {
  const { user, logout } = useAuthContext()
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([])
  const [profileData, setProfileData] = useState<{
    eco_score: number
    goals_completed: number
    current_streak: number
    longest_streak: number
  }>({
    eco_score: 0,
    goals_completed: 0,
    current_streak: 0,
    longest_streak: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProfileData()
      // Subscribe to changes in the goals table
      const subscription = supabase
        .channel("goals_channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "goals",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadProfileData()
          },
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  async function loadProfileData() {
    try {
      console.log("Loading profile data for user:", user?.id)

      // Load completed goals with error logging
      const { data: goals, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id)
        .eq("completed", true)
        .order("completed_at", { ascending: false })

      if (goalsError) {
        console.error("Error loading completed goals:", goalsError)
        return
      }

      // Load profile data with debug logging
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("eco_score, goals_completed")
        .eq("user_id", user!.id)
        .single()

      if (profileError) {
        console.error("Error loading profile:", profileError)
        return
      }

      console.log("Profile check result:", { profile, error: profileError })

      if (goals) setCompletedGoals(goals)
      if (profile) {
        setProfileData((prev) => ({
          ...prev,
          eco_score: profile.eco_score,
          goals_completed: profile.goals_completed,
        }))
      }
    } catch (error) {
      console.error("Failed to load profile data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border bg-muted">
                  <AvatarFallback className="text-2xl">{userEmoji}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user?.email}</CardTitle>
                  <CardDescription>Member since {new Date(user?.created_at!).toLocaleDateString()}</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => logout()}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold">Eco Score</h3>
                <div className="text-2xl font-bold">{(profileData.eco_score / 10).toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Points earned through completed goals</p>
              </div>
              <div>
                <h3 className="font-semibold">Goals Completed</h3>
                <p className="text-3xl font-bold">{profileData.goals_completed}</p>
                <p className="text-sm text-muted-foreground">Total goals achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Goals</CardTitle>
            <CardDescription>Your sustainability achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed on {new Date(goal.completed_at!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

