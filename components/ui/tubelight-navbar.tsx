"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(items.find((item) => item.url === pathname)?.name || items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const isDashboard = pathname === "/dashboard"

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center gap-3 py-1 px-1 rounded-full">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name && !pathname.startsWith("/profile")

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-medium px-4 py-2 rounded-full transition-colors",
                "text-muted-foreground",
                isActive && !pathname.startsWith("/profile") && "text-primary",
                !pathname.startsWith("/profile") && "hover:text-primary",
              )}
            >
              <span className="relative z-10">{item.name}</span>
              {isActive && !pathname.startsWith("/profile") && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-0"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-500 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-green-500/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-green-500/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-green-500/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

