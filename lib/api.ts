import type { User, UserStats } from "@/types/user"

export async function getUserStats(userId: string): Promise<UserStats> {
  const response = await fetch(`/api/users/${userId}/stats`)
  if (!response.ok) {
    throw new Error("Failed to fetch user stats")
  }
  return response.json()
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update profile")
  }
  return response.json()
}

export async function submitQuizAnswers(userId: string, answers: Record<string, string>) {
  const response = await fetch("/api/quiz/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      answers,
    }),
  })
  if (!response.ok) {
    throw new Error("Failed to submit quiz")
  }
  return response.json()
}

