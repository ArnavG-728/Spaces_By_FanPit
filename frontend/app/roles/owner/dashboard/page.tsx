"use client"

import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { OwnerDashboard } from "@/app/roles/owner/owner-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OwnerDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login")
    }
    if (!loading && user && user.role !== "owner") {
      if (user.role === "consumer") router.replace("/dashboard")
      if (user.role === "staff") router.replace("/roles/staff/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
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

  if (!user || user.role !== "owner") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <OwnerDashboard />
      </main>
    </div>
  )
}
