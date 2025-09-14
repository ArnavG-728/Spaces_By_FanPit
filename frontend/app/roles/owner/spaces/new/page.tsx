"use client"

import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { AddSpaceForm } from "@/components/owner/add-space-form"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function AddSpacePage() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/login")
    }
    if (!loading && user && user.role !== "owner") {
      redirect("/")
    }
  }, [user, loading])

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
        <AddSpaceForm />
      </main>
    </div>
  )
}
