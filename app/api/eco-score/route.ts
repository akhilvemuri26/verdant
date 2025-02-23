import { GoogleGenerativeAI } from "@google/generative-ai"
import { ECO_SCORE_SYSTEM_PROMPT } from "@/lib/prompts"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

// Add JSON comment stripping before parsing
function stripJSONComments(str: string): string {
  return str.replace(/\s*\/\/.*|\s*\/\*[\s\S]*?\*\//g, "")
}

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return Response.json({ error: "Missing API key" }, { status: 400 })
    }

    const profile = await req.json()

    // Initialize model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Prepare the prompt with user data
    const prompt = `
      ${ECO_SCORE_SYSTEM_PROMPT}
      
      User Profile Data:
      ${JSON.stringify(profile, null, 2)}
    `

    console.log("Debug - Sending prompt to Gemini:", prompt)

    // Generate eco-score analysis with retry logic
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

        try {
          // Strip comments before parsing
          const cleanedResponse = stripJSONComments(rawResponse)
          const jsonResponse = JSON.parse(cleanedResponse)

          // Replace the validation section with:
          const data = jsonResponse
          if (typeof data.score !== "number") {
            throw new Error("Invalid response format: missing or invalid score")
          }

          // Ensure score is between 0 and 100
          data.score = Math.max(0, Math.min(100, data.score))

          return Response.json({ score: data.score })
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
        error: "Failed to generate valid eco-score after multiple attempts",
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

