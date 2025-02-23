"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Circle, Users, Clock, Calendar, Trophy } from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { Goal } from "@/lib/supabase/schema"
import { getActivityFeed } from "@/lib/demo-data"
import { ActivityFeed } from "@/components/activity-feed"

export default function DashboardPage() {
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [goals, setGoals] = useState<Goal[]>([])
  const friendUpdates = getActivityFeed(5) // Get first 5 activities for dashboard
  const [completedGoalsCount, setCompletedGoalsCount] = useState(0)
  const [ecoScore, setEcoScore] = useState(0)
  const [streak, setStreak] = useState({ current: 0, longest: 0 })

  useEffect(() => {
    if (user) {
      loadGoals()
      loadStats()
      loadStreak()
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
            loadGoals()
            loadStats()
          },
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  async function loadStreak() {
    try {
      const { data: streakData } = await supabase
        .from("streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", user!.id)
        .single()

      if (streakData) {
        setStreak({
          current: streakData.current_streak,
          longest: streakData.longest_streak,
        })
      }
    } catch (error) {
      console.error("Error loading streak:", error)
    }
  }

  async function loadGoals() {
    try {
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id)
        .eq("completed", false)
        .order("created_at", { ascending: true })

      if (data) {
        setGoals(data)
      }
    } catch (error) {
      console.error("Error loading goals:", error)
    }
  }

  async function loadStats() {
    try {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("eco_score, goals_completed")
        .eq("user_id", user!.id)
        .single()

      if (profile) {
        setEcoScore(profile.eco_score)
        setCompletedGoalsCount(profile.goals_completed)
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  // Group goals by timeline
  const groupedGoals = {
    daily: goals.filter((goal) => goal.timeline === "daily"),
    weekly: goals.filter((goal) => goal.timeline === "weekly"),
    monthly: goals.filter((goal) => goal.timeline === "monthly"),
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {/* Goals Section */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>Track your sustainability targets</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">
                  <Clock className="h-4 w-4 mr-2" />
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly">
                  <Calendar className="h-4 w-4 mr-2" />
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly">
                  <Trophy className="h-4 w-4 mr-2" />
                  Monthly
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="space-y-4">
                {groupedGoals.daily.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Circle className="h-2 w-2 text-primary" />
                    <span className="text-sm">{goal.title}</span>
                  </div>
                ))}
                {groupedGoals.daily.length === 0 && (
                  <p className="text-sm text-muted-foreground">No active daily goals</p>
                )}
              </TabsContent>
              <TabsContent value="weekly" className="space-y-4">
                {groupedGoals.weekly.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Circle className="h-2 w-2 text-primary" />
                    <span className="text-sm">{goal.title}</span>
                  </div>
                ))}
                {groupedGoals.weekly.length === 0 && (
                  <p className="text-sm text-muted-foreground">No active weekly goals</p>
                )}
              </TabsContent>
              <TabsContent value="monthly" className="space-y-4">
                {groupedGoals.monthly.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Circle className="h-2 w-2 text-primary" />
                    <span className="text-sm">{goal.title}</span>
                  </div>
                ))}
                {groupedGoals.monthly.length === 0 && (
                  <p className="text-sm text-muted-foreground">No active monthly goals</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Friend Updates Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Friend Activity</CardTitle>
            <CardDescription>See what your eco-friends are up to</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={friendUpdates} />
          </CardContent>
        </Card>

        {/* AI World Preview Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Eco-World</CardTitle>
            <CardDescription>Watch your world thrive as you achieve goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 relative">
              <img
                src="/images/eco-world.jpg"
                alt="Your Eco-World Visualization"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>World Health</span>
                <span>{(ecoScore / 10).toFixed(1)}%</span>
              </div>
              <Progress value={ecoScore / 10} className="h-2" />
              <p className="text-xs text-muted-foreground">Complete more goals to enhance your world</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eco Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(ecoScore / 10).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoalsCount}</div>
            <p className="text-xs text-muted-foreground">Total completed goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Friends</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+24 new this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

