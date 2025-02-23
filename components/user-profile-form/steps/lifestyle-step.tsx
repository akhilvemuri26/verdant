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

export function LifestyleStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>How many meat-based meals do you eat per week?</Label>
        <Input
          type="number"
          placeholder="Enter number of meals"
          value={formData.meat_consumption || ""}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            setFormData({
              ...formData,
              meat_consumption: isNaN(value) ? undefined : value,
            })
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>How often do you buy new clothes?</Label>
        <RadioGroup
          value={formData.clothing_frequency || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              clothing_frequency: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="clothing-weekly" />
            <Label htmlFor="clothing-weekly">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="clothing-monthly" />
            <Label htmlFor="clothing-monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="quarterly" id="clothing-quarterly" />
            <Label htmlFor="clothing-quarterly">Quarterly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="clothing-yearly" />
            <Label htmlFor="clothing-yearly">Yearly or less</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recycles"
            checked={formData.recycles || false}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                recycles: checked as boolean,
              })
            }
          />
          <Label htmlFor="recycles">Do you regularly recycle?</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>How much food do you typically waste?</Label>
        <RadioGroup
          value={formData.food_waste || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              food_waste: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="waste-none" />
            <Label htmlFor="waste-none">Almost none</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="little" id="waste-little" />
            <Label htmlFor="waste-little">A little</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="waste-moderate" />
            <Label htmlFor="waste-moderate">Moderate amount</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lot" id="waste-lot" />
            <Label htmlFor="waste-lot">A lot</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

