"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Medal } from "lucide-react"
import { getActivityFeed, leaderboardUsers } from "@/lib/demo-data"
import { ActivityFeed } from "@/components/activity-feed"

export default function SocialPage() {
  const [locationFilter, setLocationFilter] = useState("world")
  const friendUpdates = getActivityFeed() // Get all activities for social page

  // Function to shuffle array
  const shuffleArray = (array: typeof leaderboardUsers) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Get filtered and shuffled leaderboard data
  const getFilteredLeaderboard = () => {
    // For demo purposes, just shuffle the data for different location filters
    return shuffleArray(leaderboardUsers)
  }

  const filteredLeaderboard = getFilteredLeaderboard()

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Friend Activity */}
        <Card className="h-[calc(100vh-8rem)]">
          <CardHeader>
            <CardTitle>Friend Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={friendUpdates} maxHeight="calc(100vh-12rem)" />
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="h-[calc(100vh-8rem)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Leaderboard</CardTitle>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="world">World</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="city">City</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-4">
                {filteredLeaderboard.map((user, index) => (
                  <div key={user.id} className="flex items-center space-x-4 rounded-lg border p-4">
                    <div className="flex h-8 w-8 items-center justify-center">
                      {index < 3 ? (
                        <Medal
                          className={index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"}
                        />
                      ) : (
                        <span className="text-lg font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <Avatar className="border bg-muted">
                      <AvatarFallback>{user.emoji}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {locationFilter === "city"
                          ? user.location.city
                          : locationFilter === "state"
                            ? user.location.state
                            : locationFilter === "country"
                              ? user.location.country
                              : `${user.location.city}, ${user.location.country}`}
                      </p>
                    </div>
                    <div className="text-sm font-medium">{user.score.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

