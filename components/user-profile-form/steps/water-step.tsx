"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { UserProfile } from "../types"

interface StepProps {
  formData: UserProfile
  setFormData: (data: UserProfile) => void
}

export function WaterStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>How long is your average shower (in minutes)?</Label>
        <Input
          type="number"
          placeholder="Enter minutes"
          value={formData.shower_duration || ""}
          onChange={(e) => {
            const value = Number.parseFloat(e.target.value)
            setFormData({
              ...formData,
              shower_duration: isNaN(value) ? undefined : value,
            })
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="water-efficient"
            checked={formData.water_efficient_appliances || false}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                water_efficient_appliances: checked as boolean,
              })
            }
          />
          <Label htmlFor="water-efficient">Do you use water-efficient appliances?</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>How often do you water your garden/plants?</Label>
        <RadioGroup
          value={formData.watering_frequency || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              watering_frequency: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="water-daily" />
            <Label htmlFor="water-daily">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="water-weekly" />
            <Label htmlFor="water-weekly">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="water-monthly" />
            <Label htmlFor="water-monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="water-never" />
            <Label htmlFor="water-never">Never</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

