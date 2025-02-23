"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserProfile } from "../types"

interface StepProps {
  formData: UserProfile
  setFormData: (data: UserProfile) => void
}

export function LocationStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>What is your location? (City, State/Province, Country)</Label>
        <Input
          placeholder="e.g., San Francisco, CA, USA"
          value={formData.location || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: e.target.value,
            })
          }
        />
        <p className="text-sm text-muted-foreground">
          This helps us connect you with local sustainability initiatives and like-minded people in your area.
        </p>
      </div>
    </div>
  )
}

