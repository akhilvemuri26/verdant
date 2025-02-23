"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Droplets, Zap, Car, Recycle, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/components/auth-provider"
import { completeGoal, undoCompleteGoal } from "@/lib/goals"
import { setupDatabase } from "@/lib/supabase/setup"
import type { Goal } from "@/lib/supabase/schema"
import { supabase } from "@/lib/supabase"

type TimeFilter = "yearly" | "monthly" | "weekly" | "daily"
type CategoryFilter = "energy" | "water" | "waste" | "transport" | "lifestyle"

export default function GoalsPage() {
  const [timelineFilter, setTimelineFilter] = useState<TimeFilter | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter | "all">("all")
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [streak, setStreak] = useState({ current: 0, longest: 0 })

  useEffect(() => {
    if (user) {
      initializeGoals()
      loadStreak()
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

  useEffect(() => {
    if (user) {
      initializeGoals()
    }
  }, [user])

  async function initializeGoals() {
    try {
      setLoading(true)
      // First ensure database is set up
      const { success } = await setupDatabase()
      if (!success) {
        toast({
          title: "Database Setup Required",
          description: "Please run the setup SQL in your Supabase dashboard.",
          variant: "destructive",
        })
        return
      }

      // Then load goals
      await loadGoals()
    } catch (error) {
      console.error("Failed to initialize goals:", error)
      toast({
        title: "Error",
        description: "Failed to initialize goals. Please ensure database setup is complete.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function loadGoals() {
    try {
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id)
        .eq("completed", false) // Add this line
        .order("created_at", { ascending: true })

      if (data) {
        setGoals(data)
      }
    } catch (error) {
      console.error("Error loading goals:", error)
    }
  }

  const handleGoalComplete = async (goalId: string) => {
    try {
      const completedGoal = goals.find((g) => g.id === goalId)
      if (!completedGoal) {
        throw new Error("Goal not found in current list")
      }

      // Optimistically remove the goal from the UI
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId))

      try {
        await completeGoal(goalId, user!.id)

        // Show toast with undo button
        toast({
          title: "Goal completed!",
          description: "Your eco-score has been updated.",
          duration: 4000,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await undoCompleteGoal(goalId, user!.id)
                  // Add the goal back to the list
                  setGoals((prevGoals) => [...prevGoals, completedGoal])
                  toast({
                    title: "Goal restored",
                    description: "The goal has been added back to your list.",
                  })
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : "Failed to restore goal"
                  console.error("Failed to undo goal completion:", error)
                  toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                  })
                  // Add the goal back to the list since the undo failed
                  setGoals((prevGoals) => [...prevGoals, completedGoal])
                }
              }}
            >
              Undo
            </Button>
          ),
        })
      } catch (error) {
        // If the completion fails, add the goal back to the list
        setGoals((prevGoals) => [...prevGoals, completedGoal])
        throw error
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error && "message" in error
            ? String(error.message)
            : "Failed to complete goal"

      console.error("Failed to complete goal:", error)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const filteredGoals = goals.filter((goal) => {
    if (timelineFilter !== "all" && goal.timeline !== timelineFilter) return false
    if (categoryFilter !== "all" && goal.category !== categoryFilter) return false
    return true
  })

  const getCategoryIcon = (category: CategoryFilter) => {
    switch (category) {
      case "energy":
        return <Zap className="h-4 w-4" />
      case "water":
        return <Droplets className="h-4 w-4" />
      case "waste":
        return <Recycle className="h-4 w-4" />
      case "transport":
        return <Car className="h-4 w-4" />
      case "lifestyle":
        return <Heart className="h-4 w-4" />
    }
  }

  const getTimelineIcon = (timeline: TimeFilter) => {
    switch (timeline) {
      case "yearly":
        return <Calendar className="h-4 w-4" />
      case "monthly":
        return <Calendar className="h-4 w-4" />
      case "weekly":
        return <Clock className="h-4 w-4" />
      case "daily":
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <Card className="h-[calc(100vh-8rem)] w-64 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Timeline</h3>
              <div className="space-y-2">
                {["all", "yearly", "monthly", "weekly", "daily"].map((timeline) => (
                  <Button
                    key={timeline}
                    variant={timelineFilter === timeline ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setTimelineFilter(timeline as TimeFilter | "all")}
                  >
                    {timeline !== "all" && getTimelineIcon(timeline as TimeFilter)}
                    <span className="ml-2 capitalize">{timeline}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Category</h3>
              <div className="space-y-2">
                {["all", "energy", "water", "waste", "transport", "lifestyle"].map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCategoryFilter(category as CategoryFilter | "all")}
                  >
                    {category !== "all" && getCategoryIcon(category as CategoryFilter)}
                    <span className="ml-2 capitalize">{category}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Goals</h2>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <AnimatePresence>
              {filteredGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2"
                >
                  <Card className="flex items-center p-4">
                    <Checkbox
                      id={goal.id}
                      checked={goal.completed}
                      onCheckedChange={() => handleGoalComplete(goal.id)}
                    />
                    <label
                      htmlFor={goal.id}
                      className="ml-2 flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {goal.title}
                    </label>
                    <div className="ml-auto flex items-center gap-2">
                      {getCategoryIcon(goal.category)}
                      {getTimelineIcon(goal.timeline)}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

