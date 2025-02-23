import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import type { friendActivities } from "@/lib/demo-data"

interface ActivityFeedProps {
  activities: typeof friendActivities
  maxHeight?: string
}

export function ActivityFeed({ activities, maxHeight = "400px" }: ActivityFeedProps) {
  return (
    <ScrollArea className={`h-[${maxHeight}] pr-4`}>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <Avatar className="border bg-muted">
              <AvatarFallback>{activity.emoji}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                <Link href="/profile" className="hover:underline">
                  {activity.name}
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.action}: {activity.task}
              </p>
              <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

