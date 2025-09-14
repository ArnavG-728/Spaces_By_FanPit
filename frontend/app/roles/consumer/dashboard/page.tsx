"use client"

import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { ConsumerDashboard } from "@/app/components/dashboard/_components/consumer-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ConsumerDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login")
    }
    if (!isLoading && user && user.role !== "consumer") {
      if (user.role === "owner") router.replace("/roles/owner/dashboard")
      if (user.role === "staff") router.replace("/roles/staff/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "consumer") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ConsumerDashboard />
      </main>
    </div>
  )
}
