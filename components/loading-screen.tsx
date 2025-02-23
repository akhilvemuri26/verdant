import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  isLoading: boolean
  onContinue: () => void
}

export function LoadingScreen({ isLoading, onContinue }: LoadingScreenProps) {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-center">{isLoading ? "Setting Up Your World" : "Setup Complete!"}</CardTitle>
        <CardDescription className="text-center">
          {isLoading
            ? "Please wait while we analyze your profile and generate personalized goals..."
            : "Your eco-world is ready to explore"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        ) : (
          <Button onClick={onContinue} size="lg">
            Continue to Dashboard
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

