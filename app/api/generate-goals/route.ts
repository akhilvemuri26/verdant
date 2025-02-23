import { GoogleGenerativeAI } from "@google/generative-ai"
import { GOAL_GENERATION_PROMPT } from "@/lib/prompts"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

const MIN_GOALS = 12
const MAX_GOALS = 15

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return Response.json({ error: "Missing API key" }, { status: 400 })
    }

    const { profile, ecoScore } = await req.json()

    // Initialize model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Prepare the prompt with user data
    const prompt = `
      ${GOAL_GENERATION_PROMPT}
      
      User Profile:
      ${JSON.stringify(profile, null, 2)}
      
      Current Eco-Score: ${ecoScore}

      Remember to:
      1. Generate between ${MIN_GOALS}-${MAX_GOALS} goals
      2. Ensure a good mix of daily, weekly, and monthly goals
      3. Distribute goals across all categories
      4. Respond ONLY with valid JSON matching the specified format
    `

    console.log("Debug - Sending prompt to Gemini:", prompt)

    // Generate goals with retry logic
    let attempts = 0
    const maxAttempts = 3
    let lastError = null
    let rawResponse = ""

    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        rawResponse = response.text()

        console.log("Debug - Raw Gemini response:", rawResponse)

        // Try to parse the response as JSON
        try {
          const jsonResponse = JSON.parse(rawResponse)

          // Validate response structure
          if (!jsonResponse.goals || !Array.isArray(jsonResponse.goals)) {
            throw new Error("Invalid response format: missing or invalid goals array")
          }

          // Validate and sanitize each goal object
          jsonResponse.goals = jsonResponse.goals.map((goal: any, index: number) => ({
            title: goal.title || `Goal ${index + 1}`,
            timeline: goal.timeline || "daily",
            category: goal.category || "lifestyle",
            impact: typeof goal.impact === "number" ? Math.min(Math.max(goal.impact, 1), 10) : 5,
            difficulty: goal.difficulty || "medium",
          }))

          // Ensure minimum number of goals
          if (jsonResponse.goals.length < MIN_GOALS) {
            console.log("Debug - Not enough goals generated, retrying")
            attempts++
            continue
          }

          // Trim to maximum if needed
          if (jsonResponse.goals.length > MAX_GOALS) {
            jsonResponse.goals = jsonResponse.goals.slice(0, MAX_GOALS)
          }

          // Validate timeline and category distribution
          const timelines = jsonResponse.goals.reduce((acc: Record<string, number>, goal: any) => {
            acc[goal.timeline] = (acc[goal.timeline] || 0) + 1
            return acc
          }, {})

          const categories = jsonResponse.goals.reduce((acc: Record<string, number>, goal: any) => {
            acc[goal.category] = (acc[goal.category] || 0) + 1
            return acc
          }, {})

          console.log("Debug - Goal distribution:", { timelines, categories })

          // Check if we have at least 2 goals of each timeline and category
          const hasGoodDistribution =
            Object.values(timelines).every((count) => count >= 2) &&
            Object.values(categories).every((count) => count >= 2)

          if (!hasGoodDistribution) {
            console.log("Debug - Poor goal distribution, retrying")
            attempts++
            continue
          }

          return Response.json(jsonResponse)
        } catch (parseError) {
          console.error("Parse error:", parseError)
          console.error("Raw response:", rawResponse)
          lastError = parseError
          attempts++
          continue
        }
      } catch (generateError) {
        console.error("Generation error:", generateError)
        lastError = generateError
        attempts++
        continue
      }
    }

    // If all attempts failed, return error with debug info
    console.error("All attempts failed. Last error:", lastError)
    return Response.json(
      {
        error: "Failed to generate valid goals after multiple attempts",
        details: lastError instanceof Error ? lastError.message : "Unknown error",
        debug: {
          rawResponse,
          attempts,
        },
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("API route error:", error)
    return Response.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

