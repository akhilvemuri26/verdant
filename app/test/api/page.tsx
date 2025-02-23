"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

// Test cases with different profiles
const testCases = [
  {
    name: "High Impact Profile",
    profile: {
      electricity_consumption: 1200,
      renewable_energy: "none",
      heating_type: "oil",
      shower_duration: 20,
      water_efficient_appliances: false,
      watering_frequency: "3+_times",
      household_size: 4,
      home_age: "over_30",
      efficiency_upgrades: [],
      primary_transport: "gasoline",
      weekly_driving_miles: 300,
      air_travel_frequency: "5+_times",
      meat_consumption: 7,
      clothing_frequency: "monthly",
      recycles: false,
      food_waste: "significant",
      location: "Test Location",
    },
  },
  {
    name: "Low Impact Profile",
    profile: {
      electricity_consumption: 300,
      renewable_energy: "fully",
      heating_type: "electricity",
      shower_duration: 5,
      water_efficient_appliances: true,
      watering_frequency: "never",
      household_size: 1,
      home_age: "less_than_10",
      efficiency_upgrades: ["insulation", "windows", "thermostat"],
      primary_transport: "walking_biking",
      weekly_driving_miles: 0,
      air_travel_frequency: "never",
      meat_consumption: 0,
      clothing_frequency: "yearly_or_less",
      recycles: true,
      food_waste: "minimal",
      location: "Test Location",
    },
  },
  {
    name: "Average Impact Profile",
    profile: {
      electricity_consumption: 600,
      renewable_energy: "partially",
      heating_type: "natural_gas",
      shower_duration: 10,
      water_efficient_appliances: true,
      watering_frequency: "1-2_times",
      household_size: 2,
      home_age: "10-30",
      efficiency_upgrades: ["insulation"],
      primary_transport: "hybrid",
      weekly_driving_miles: 100,
      air_travel_frequency: "1-2_times",
      meat_consumption: 3,
      clothing_frequency: "few_months",
      recycles: true,
      food_waste: "moderate",
      location: "Test Location",
    },
  },
]

interface TestResult {
  name: string
  status: "success" | "error" | "loading"
  ecoScore?: number
  goals?: any[]
  error?: string
  duration?: number
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const runTest = async (testCase: (typeof testCases)[0]) => {
    setResults((prev) => [...prev, { name: testCase.name, status: "loading" }])

    const startTime = Date.now()

    try {
      // Test eco-score
      const scoreRes = await fetch("/api/eco-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testCase.profile),
      })

      const scoreData = await scoreRes.json()

      if (!scoreRes.ok) {
        throw new Error(scoreData.error || "Failed to get eco-score")
      }

      // Test goals generation
      const goalsRes = await fetch("/api/generate-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: testCase.profile,
          ecoScore: scoreData.score,
        }),
      })

      const goalsData = await goalsRes.json()

      if (!goalsRes.ok) {
        throw new Error(goalsData.error || "Failed to generate goals")
      }

      // Validate response format
      if (typeof scoreData.score !== "number" || !Array.isArray(goalsData.goals)) {
        throw new Error("Invalid response format")
      }

      setResults((prev) =>
        prev.map((r) =>
          r.name === testCase.name
            ? {
                name: testCase.name,
                status: "success",
                ecoScore: scoreData.score,
                goals: goalsData.goals,
                duration: Date.now() - startTime,
              }
            : r,
        ),
      )
    } catch (error) {
      setResults((prev) =>
        prev.map((r) =>
          r.name === testCase.name
            ? {
                name: testCase.name,
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
                duration: Date.now() - startTime,
              }
            : r,
        ),
      )
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setResults([])

    for (const testCase of testCases) {
      await runTest(testCase)
    }

    setTesting(false)
  }

  return (
    <div className="container py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button onClick={runAllTests} disabled={testing}>
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run All Tests"
              )}
            </Button>
            <Button variant="outline" onClick={() => setResults([])} disabled={testing || results.length === 0}>
              Clear Results
            </Button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {result.status === "loading" ? (
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        ) : result.status === "success" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <h3 className="font-semibold">{result.name}</h3>
                      </div>

                      {result.duration && (
                        <p className="text-sm text-muted-foreground">Duration: {result.duration}ms</p>
                      )}
                    </div>

                    {result.status === "success" && (
                      <Badge
                        variant={
                          result.ecoScore! >= 70 ? "default" : result.ecoScore! >= 40 ? "secondary" : "destructive"
                        }
                      >
                        Score: {result.ecoScore}
                      </Badge>
                    )}
                  </div>

                  {result.status === "success" && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Generated {result.goals?.length} goals:</p>
                      <div className="grid gap-2">
                        {result.goals?.slice(0, 3).map((goal: any, i: number) => (
                          <div key={i} className="text-sm text-muted-foreground">
                            • {goal.title}
                          </div>
                        ))}
                        {result.goals!.length > 3 && (
                          <div className="text-sm text-muted-foreground">• ... and {result.goals!.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )}

                  {result.status === "error" && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

