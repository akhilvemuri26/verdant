export interface UserProfile {
  id: string
  user_id: string
  // Energy Usage
  electricity_consumption: number
  renewable_energy: "fully" | "partially" | "none"
  heating_type: "electricity" | "natural_gas" | "oil" | "other"
  // Water Usage
  shower_duration: number
  water_efficient_appliances: boolean
  watering_frequency: "never" | "1-2_times" | "3+_times"
  // Household
  household_size: number
  home_age: "less_than_10" | "10-30" | "over_30"
  efficiency_upgrades: string[]
  // Transportation
  primary_transport: "gasoline" | "hybrid" | "electric" | "public" | "walking_biking"
  weekly_driving_miles: number
  air_travel_frequency: "never" | "1-2_times" | "3-5_times" | "5+_times"
  // Lifestyle
  meat_consumption: number
  clothing_frequency: "monthly" | "few_months" | "yearly_or_less"
  recycles: boolean
  food_waste: "minimal" | "moderate" | "significant"
  // Location
  location: string
  created_at: string
  updated_at: string
}

export type UserProfileFormData = Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">

