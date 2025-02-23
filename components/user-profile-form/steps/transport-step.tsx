"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { UserProfile } from "../types"

interface StepProps {
  formData: UserProfile
  setFormData: (data: UserProfile) => void
}

export function TransportStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>What is your primary mode of transportation?</Label>
        <RadioGroup
          value={formData.primary_transport || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              primary_transport: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="car" id="transport-car" />
            <Label htmlFor="transport-car">Personal Car</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="transport-public" />
            <Label htmlFor="transport-public">Public Transportation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bicycle" id="transport-bicycle" />
            <Label htmlFor="transport-bicycle">Bicycle</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="walk" id="transport-walk" />
            <Label htmlFor="transport-walk">Walk</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>How many miles do you drive per week?</Label>
        <Input
          type="number"
          placeholder="Enter miles"
          value={formData.weekly_driving_miles || ""}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            setFormData({
              ...formData,
              weekly_driving_miles: isNaN(value) ? undefined : value,
            })
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>How often do you travel by air?</Label>
        <RadioGroup
          value={formData.air_travel_frequency || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              air_travel_frequency: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="air-never" />
            <Label htmlFor="air-never">Never</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="air-yearly" />
            <Label htmlFor="air-yearly">1-2 times per year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="quarterly" id="air-quarterly" />
            <Label htmlFor="air-quarterly">3-4 times per year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="air-monthly" />
            <Label htmlFor="air-monthly">Monthly or more</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

