"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample user profile data for testing
const sampleProfile = {
  energy_usage: {
    electricity_consumption: 800,
    renewable_energy: "partially",
    heating_type: "natural_gas",
  },
  water_usage: {
    shower_duration: 10,
    water_efficient_appliances: true,
    watering_frequency: "1-2_times",
  },
  transportation: {
    primary_transport: "car",
    weekly_driving_miles: 100,
    air_travel_frequency: "1-2_times",
  },
  lifestyle: {
    meat_consumption: 4,
    clothing_frequency: "monthly",
    recycles: true,
    food_waste: "minimal",
  },
  household: {
    household_size: 2,
    home_age: "10-30",
    efficiency_upgrades: ["insulation", "windows"],
  },
}

export default function TestEcoPage() {
  const [ecoScore, setEcoScore] = useState<any>(null)
  const [goals, setGoals] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testEcoScore = async () => {
    setLoading(true)
    setError("")

    try {
      // Get eco-score
      const scoreRes = await fetch("/api/eco-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleProfile),
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
          profile: sampleProfile,
          ecoScore: scoreData.score,
        }),
      })

      const goalsData = await goalsRes.json()

      if (!goalsRes.ok) {
        throw new Error(goalsData.error || "Failed to generate goals")
      }

      setGoals(goalsData)
    } catch (error) {
      console.error("Test failed:", error)
      setError(error instanceof Error ? error.message : "Failed to process request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Eco-Score & Goal Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testEcoScore} disabled={loading}>
            {loading ? "Processing..." : "Generate Eco-Score & Goals"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {ecoScore && (
            <div className="space-y-4">
              <h3 className="font-semibold">Eco-Score Results:</h3>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap">{JSON.stringify(ecoScore, null, 2)}</pre>
              </div>
            </div>
          )}

          {goals && (
            <div className="space-y-4">
              <h3 className="font-semibold">Generated Goals:</h3>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap">{JSON.stringify(goals, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

