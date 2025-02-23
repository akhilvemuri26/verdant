"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Leaf, Sprout, Users, TreePine, Target, Brain, Heart, Globe } from "lucide-react"

const features = [
  {
    title: "Personal Goals",
    description: "Set and track your sustainability goals with our intuitive goal-setting system.",
    icon: <Target className="h-6 w-6" />,
  },
  {
    title: "Smart Tracking",
    description: "AI-powered tracking helps you monitor and improve your eco-friendly habits.",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    title: "Community Impact",
    description: "Connect with like-minded individuals and amplify your environmental impact.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Virtual World",
    description: "Watch your personal eco-world thrive as you achieve sustainability goals.",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "Green Rewards",
    description: "Earn rewards and recognition for your positive environmental actions.",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    title: "Develop Ecosystems",
    description: "Consistent streaks add unique flora and fauna.",
    icon: <TreePine className="h-6 w-6" />,
  },
  {
    title: "Resource Savings",
    description: "Monitor and reduce your water, energy, and waste footprint.",
    icon: <Leaf className="h-6 w-6" />,
  },
  {
    title: "Growth Tracking",
    description: "Visualize your progress and environmental impact over time.",
    icon: <Sprout className="h-6 w-6" />,
  },
]

export function FeaturesSectionWithHoverEffects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800",
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-green-50 dark:from-green-900/50 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-green-50 dark:from-green-900/50 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-200 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">{description}</p>
    </div>
  )
}

