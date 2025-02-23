"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { EnergyStep, WaterStep, HouseholdStep, TransportStep, LifestyleStep, LocationStep } from "./form-steps"
import { formSteps, stepTitles } from "./types"
import type { FormStep } from "./types"
import type { UserProfileFormData } from "@/types/profile"
import { saveUserProfile } from "@/lib/profile"
import { useAuthContext } from "@/components/auth-provider"
import { LoadingScreen } from "@/components/loading-screen"

// Schema definitions remain the same...
// Previous schema code here...

const formSchema = z.object({
  // Energy Usage
  electricity_consumption: z.number(),
  renewable_energy: z.enum(["fully", "partially", "none"]),
  heating_type: z.enum(["electricity", "natural_gas", "oil", "other"]),
  // Water Usage
  shower_duration: z.number(),
  water_efficient_appliances: z.boolean(),
  watering_frequency: z.enum(["never", "1-2_times", "3+_times"]),
  // Household
  household_size: z.number().min(1),
  home_age: z.enum(["less_than_10", "10-30", "over_30"]),
  efficiency_upgrades: z.array(z.string()),
  // Transportation
  primary_transport: z.enum(["gasoline", "hybrid", "electric", "public", "walking_biking"]),
  weekly_driving_miles: z.number(),
  air_travel_frequency: z.enum(["never", "1-2_times", "3-5_times", "5+_times"]),
  // Lifestyle
  meat_consumption: z.number(),
  clothing_frequency: z.enum(["monthly", "few_months", "yearly_or_less"]),
  recycles: z.boolean(),
  food_waste: z.enum(["minimal", "moderate", "significant"]),
  // Location
  location: z.string().min(2, "Please enter a valid location"),
})

const defaultValues: UserProfileFormData = {
  // Energy Usage
  electricity_consumption: 0,
  renewable_energy: "none",
  heating_type: "electricity",
  // Water Usage
  shower_duration: 0,
  water_efficient_appliances: false,
  watering_frequency: "never",
  // Household
  household_size: 1,
  home_age: "less_than_10",
  efficiency_upgrades: [],
  // Transportation
  primary_transport: "gasoline",
  weekly_driving_miles: 0,
  air_travel_frequency: "never",
  // Lifestyle
  meat_consumption: 0,
  clothing_frequency: "monthly",
  recycles: false,
  food_waste: "minimal",
  // Location
  location: "",
}

const stepSchemas = {
  energy: z.object({
    electricity_consumption: z.number(),
    renewable_energy: z.enum(["fully", "partially", "none"]),
    heating_type: z.enum(["electricity", "natural_gas", "oil", "other"]),
  }),
  water: z.object({
    shower_duration: z.number(),
    water_efficient_appliances: z.boolean(),
    watering_frequency: z.enum(["never", "1-2_times", "3+_times"]),
  }),
  household: z.object({
    household_size: z.number().min(1),
    home_age: z.enum(["less_than_10", "10-30", "over_30"]),
    efficiency_upgrades: z.array(z.string()),
  }),
  transport: z.object({
    primary_transport: z.enum(["gasoline", "hybrid", "electric", "public", "walking_biking"]),
    weekly_driving_miles: z.number(),
    air_travel_frequency: z.enum(["never", "1-2_times", "3-5_times", "5+_times"]),
  }),
  lifestyle: z.object({
    meat_consumption: z.number(),
    clothing_frequency: z.enum(["monthly", "few_months", "yearly_or_less"]),
    recycles: z.boolean(),
    food_waste: z.enum(["minimal", "moderate", "significant"]),
  }),
  location: z.object({
    location: z.string().min(2, "Please enter a valid location"),
  }),
}

export function UserProfileForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>("energy")
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuthContext()

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })

  const currentStepIndex = formSteps.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === formSteps.length - 1

  function getStepComponent(step: FormStep) {
    const props = { control: form.control }
    switch (step) {
      case "energy":
        return <EnergyStep {...props} />
      case "water":
        return <WaterStep {...props} />
      case "household":
        return <HouseholdStep {...props} />
      case "transport":
        return <TransportStep {...props} />
      case "lifestyle":
        return <LifestyleStep {...props} />
      case "location":
        return <LocationStep {...props} />
    }
  }

  const handleNext = async () => {
    // Get the current step's data
    const currentStepData = form.getValues()

    // Validate only the current step's fields
    const stepValidation = stepSchemas[currentStep].safeParse(currentStepData)

    if (!stepValidation.success) {
      // Show error toast if validation fails
      toast.error("Please fill in all required fields correctly.")
      return
    }

    // If validation passes, move to next step
    setCurrentStep(formSteps[currentStepIndex + 1])
  }

  const handleSubmit = async (data: UserProfileFormData) => {
    try {
      if (!user) throw new Error("User not found")

      setShowLoadingScreen(true)
      setIsLoading(true)

      // Save profile and generate initial data
      await saveUserProfile(user.id, data)

      setIsLoading(false)
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("There was a problem saving your profile.")
      setShowLoadingScreen(false)
    }
  }

  if (showLoadingScreen) {
    return <LoadingScreen isLoading={isLoading} onContinue={() => router.push("/dashboard")} />
  }

  return (
    <>
      <Toaster />
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>{stepTitles[currentStep]}</CardTitle>
          <CardDescription>
            Step {currentStepIndex + 1} of {formSteps.length}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent>{getStepComponent(currentStep)}</CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(formSteps[currentStepIndex - 1])}
                disabled={isFirstStep}
              >
                Previous
              </Button>
              {isLastStep ? (
                <Button type="submit">Submit</Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  )
}

