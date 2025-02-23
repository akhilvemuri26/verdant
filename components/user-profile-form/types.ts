export type FormStep = "energy" | "water" | "household" | "transport" | "lifestyle" | "location"

export const formSteps: FormStep[] = ["energy", "water", "household", "transport", "lifestyle", "location"]

export const stepTitles: Record<FormStep, string> = {
  energy: "Energy Usage",
  water: "Water Usage",
  household: "Household Size & Efficiency",
  transport: "Transportation",
  lifestyle: "Lifestyle & Waste Production",
  location: "Location",
}

