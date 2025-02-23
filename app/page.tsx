import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section with enhanced gradient */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-green-100/80 via-green-50/50 to-background dark:from-green-950/50 dark:via-green-900/20 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" variant="secondary">
              🌱 Join the Eco Revolution
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Cultivate Your Virtual <span className="text-primary">Eco-World</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Watch your world flourish as you achieve your sustainability goals. Connect with friends and make a real
                impact together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-dot-pattern relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <FeaturesSectionWithHoverEffects />
      </section>

      {/* World Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-green-50/50 dark:to-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your AI-Powered Eco-World</h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                Experience a unique, evolving virtual environment that responds to your sustainable actions. Watch as
                your world becomes greener and more vibrant with each goal you achieve.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/signup">Create Your World</Link>
                </Button>
              </div>
            </div>
            {/* World Preview Section video container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-green-900/10 to-green-800/10 backdrop-blur-sm">
              <video
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                playsInline
                poster="/videos/preview-poster.jpg"
              >
                <source src="/videos/preview.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

