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

const efficiencyUpgrades = [
  { id: "insulation", label: "Insulation" },
  { id: "windows", label: "Energy-efficient Windows" },
  { id: "solar", label: "Solar Panels" },
  { id: "hvac", label: "HVAC System" },
  { id: "appliances", label: "Energy-efficient Appliances" },
]

export function HouseholdStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>How many people live in your household?</Label>
        <Input
          type="number"
          placeholder="Enter number of people"
          value={formData.household_size || ""}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            setFormData({
              ...formData,
              household_size: isNaN(value) ? undefined : value,
            })
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>How old is your home?</Label>
        <RadioGroup
          value={formData.home_age || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              home_age: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0-5" id="age-0-5" />
            <Label htmlFor="age-0-5">0-5 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6-15" id="age-6-15" />
            <Label htmlFor="age-6-15">6-15 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="16-30" id="age-16-30" />
            <Label htmlFor="age-16-30">16-30 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30+" id="age-30-plus" />
            <Label htmlFor="age-30-plus">30+ years</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>What energy efficiency upgrades have you made? (Select all that apply)</Label>
        <div className="space-y-2">
          {efficiencyUpgrades.map((upgrade) => (
            <div key={upgrade.id} className="flex items-center space-x-2">
              <Checkbox
                id={upgrade.id}
                checked={(formData.efficiency_upgrades || []).includes(upgrade.id)}
                onCheckedChange={(checked) => {
                  const currentUpgrades = formData.efficiency_upgrades || []
                  setFormData({
                    ...formData,
                    efficiency_upgrades: checked
                      ? [...currentUpgrades, upgrade.id]
                      : currentUpgrades.filter((id) => id !== upgrade.id),
                  })
                }}
              />
              <Label htmlFor={upgrade.id}>{upgrade.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

