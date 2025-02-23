"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestPage() {
  const [response, setResponse] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testGemini = async () => {
    setLoading(true)
    setError("")
    setResponse("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "What is sustainability? Please keep the answer short.",
            },
          ],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setResponse(data.response)
    } catch (error) {
      console.error("Test failed:", error)
      setError(error instanceof Error ? error.message : "Failed to connect to Gemini API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gemini API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testGemini} disabled={loading}>
            {loading ? "Testing..." : "Test Connection"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap">{response}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

