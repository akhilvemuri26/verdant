"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { UserProfile } from "../types"

interface StepProps {
  formData: UserProfile
  setFormData: (data: UserProfile) => void
}

export function EnergyStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>What is your average monthly electricity consumption (in kWh)?</Label>
        <Input
          type="number"
          placeholder="Enter kWh"
          value={formData.electricity_consumption || ""}
          onChange={(e) => {
            const value = Number.parseFloat(e.target.value)
            setFormData({
              ...formData,
              electricity_consumption: isNaN(value) ? undefined : value,
            })
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Do you use renewable energy sources?</Label>
        <RadioGroup
          value={formData.renewable_energy || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              renewable_energy: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="renewable-yes" />
            <Label htmlFor="renewable-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="renewable-no" />
            <Label htmlFor="renewable-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="partial" id="renewable-partial" />
            <Label htmlFor="renewable-partial">Partially</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>What type of heating system do you use?</Label>
        <RadioGroup
          value={formData.heating_type || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              heating_type: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gas" id="heating-gas" />
            <Label htmlFor="heating-gas">Gas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="electric" id="heating-electric" />
            <Label htmlFor="heating-electric">Electric</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="heat-pump" id="heating-pump" />
            <Label htmlFor="heating-pump">Heat Pump</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="heating-other" />
            <Label htmlFor="heating-other">Other</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

