"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserProfile } from "@/lib/profile"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

export default function AnalyzePage() {
  const { user } = useAuthContext()
  const [profile, setProfile] = useState<any>(null)
  const [ecoScore, setEcoScore] = useState<any>(null)
  const [goals, setGoals] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      try {
        const profileData = await getUserProfile(user.id)
        setProfile(profileData)
      } catch (error) {
        console.error("Failed to load profile:", error)
        setError("Failed to load profile data")
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [user])

  const analyzeProfile = async () => {
    if (!profile) return

    setLoading(true)
    setError("")

    try {
      // Get eco-score
      const scoreRes = await fetch("/api/eco-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      const scoreData = await scoreRes.json()

      if (!scoreRes.ok) {
        throw new Error(scoreData.error || "Failed to get eco-score")
      }

      setEcoScore(scoreData)

      // Generate goals based on profile and eco-score
      const goalsRes = await fetch("/api/generate-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile,
          ecoScore: scoreData.score,
        }),
      })

      const goalsData = await goalsRes.json()

      if (!goalsRes.ok) {
        throw new Error(goalsData.error || "Failed to generate goals")
      }

      setGoals(goalsData)
    } catch (error) {
      console.error("Analysis failed:", error)
      setError(error instanceof Error ? error.message : "Failed to analyze profile")
    } finally {
      setLoading(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="container py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container py-10">
        <Alert>
          <AlertDescription>Please complete your profile before analyzing your eco-impact.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Eco-Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={analyzeProfile} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Profile"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {ecoScore && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Your Eco-Score: {ecoScore.score}/100</h3>
                <Progress value={ecoScore.score} className="h-2" />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Score Breakdown:</h4>
                <div className="grid gap-2">
                  {Object.entries(ecoScore.breakdown).map(([category, score]: [string, any]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{category}</span>
                        <span>{score}/100</span>
                      </div>
                      <Progress value={score} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Analysis:</h4>
                <p className="text-sm text-muted-foreground">{ecoScore.explanation}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recommended Improvements:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {ecoScore.improvements.map((improvement: string, index: number) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {goals && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold">Personalized Goals</h3>
              <div className="grid gap-4">
                {goals.goals.map((goal: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{goal.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            <span className="capitalize">{goal.timeline}</span> • {goal.category} • {goal.difficulty}{" "}
                            difficulty
                          </div>
                        </div>
                        <div className="text-sm font-medium">Impact: {goal.impact}/10</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

