import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control } from "react-hook-form"
import type { UserProfileFormData } from "@/types/profile"

interface StepProps {
  control: Control<UserProfileFormData>
}

export function EnergyStep({ control }: StepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="electricity_consumption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <Label className="text-center">What is your average monthly electricity consumption (in kWh)?</Label>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="renewable_energy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you use renewable energy sources?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fully" id="fully" />
                  <Label htmlFor="fully">Yes, fully renewable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partially" id="partially" />
                  <Label htmlFor="partially">Partially renewable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">No renewable energy</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="heating_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How is your home primarily heated?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="electricity" id="electricity" />
                  <Label htmlFor="electricity">Electricity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="natural_gas" id="natural_gas" />
                  <Label htmlFor="natural_gas">Natural Gas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oil" id="oil" />
                  <Label htmlFor="oil">Oil</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function WaterStep({ control }: StepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="shower_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <Label className="text-center">On average, how many minutes are your daily showers?</Label>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="water_efficient_appliances"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you use water-efficient appliances?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                defaultValue={field.value ? "true" : "false"}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="watering_frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How often do you water your lawn/garden?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Never</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2_times" id="1-2_times" />
                  <Label htmlFor="1-2_times">1-2 times a week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3+_times" id="3+_times" />
                  <Label htmlFor="3+_times">3+ times a week</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function HouseholdStep({ control }: StepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="household_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <Label className="text-center">How many people live in your household?</Label>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="home_age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How old is your home?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less_than_10" id="less_than_10" />
                  <Label htmlFor="less_than_10">Less than 10 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-30" id="10-30" />
                  <Label htmlFor="10-30">10-30 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over_30" id="over_30" />
                  <Label htmlFor="over_30">Over 30 years</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="efficiency_upgrades"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Have you made any of these home efficiency upgrades?</FormLabel>
            <FormControl>
              <div className="flex flex-col space-y-2">
                {[
                  { id: "insulation", label: "Insulation improvements" },
                  { id: "windows", label: "Energy-efficient windows" },
                  { id: "thermostat", label: "Smart thermostat" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={field.value?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const current = field.value || []
                        const updated = checked ? [...current, item.id] : current.filter((value) => value !== item.id)
                        field.onChange(updated)
                      }}
                    />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function TransportStep({ control }: StepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="primary_transport"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <Label className="text-center">What is your primary mode of transportation?</Label>
            </FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gasoline" id="gasoline" />
                  <Label htmlFor="gasoline">Gasoline/Diesel car</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid">Hybrid car</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="electric" id="electric" />
                  <Label htmlFor="electric">Electric vehicle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public transportation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="walking_biking" id="walking_biking" />
                  <Label htmlFor="walking_biking">Walking/Biking</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="weekly_driving_miles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How many miles do you drive per week?</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="air_travel_frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How often do you use air travel?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Never</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2_times" id="1-2_times" />
                  <Label htmlFor="1-2_times">1-2 times a year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-5_times" id="3-5_times" />
                  <Label htmlFor="3-5_times">3-5 times a year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5+_times" id="5+_times" />
                  <Label htmlFor="5+_times">More than 5 times a year</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function LifestyleStep({ control }: StepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="meat_consumption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <Label className="text-center">How many times per week do you eat meat?</Label>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="clothing_frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How often do you buy new clothing?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="few_months" id="few_months" />
                  <Label htmlFor="few_months">Every few months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly_or_less" id="yearly_or_less" />
                  <Label htmlFor="yearly_or_less">Once a year or less</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="recycles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you recycle regularly?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                defaultValue={field.value ? "true" : "false"}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="food_waste"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How much food do you waste per week?</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimal" id="minimal" />
                  <Label htmlFor="minimal">Minimal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="significant" id="significant" />
                  <Label htmlFor="significant">Significant</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function LocationStep({ control }: StepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <Label className="text-center">What is your location? (City, State/Province, Country)</Label>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter zip code or country" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

