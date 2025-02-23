export interface User {
  id: string
  name: string
  email: string
  picture?: string
  bio?: string
  location?: string
  ecoScore?: number
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  treesPlanted: number
  co2Saved: number
  friendsCount: number
  challengesCompleted: number
}

