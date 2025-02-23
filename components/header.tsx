"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Target, Users, Globe, User } from "lucide-react"
import { useAuthContext } from "./auth-provider"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { usePathname } from "next/navigation"

// Navigation items for authenticated users
const authenticatedNavItems = [
  { name: "Goals", url: "/goals", icon: Target },
  { name: "Social", url: "/social", icon: Users },
  { name: "World", url: "/world", icon: Globe },
]

// Navigation items for public users
const publicNavItems = [
  { name: "Features", url: "/#features", icon: Target },
  { name: "About", url: "/#about", icon: Users },
  { name: "Contact", url: "/#contact", icon: Globe },
]

export function Header() {
  const { user } = useAuthContext()
  const pathname = usePathname()

  if (pathname === "/onboarding") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo section */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Verdant Logo" className="h-8 w-auto" />
          <span className="font-bold">Verdant</span>
        </Link>

        {user ? (
          <>
            <div className="flex-1 flex justify-center">
              <NavBar items={authenticatedNavItems} />
            </div>
            <Button variant="ghost" asChild>
              <Link href="/profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
          </>
        ) : (
          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

