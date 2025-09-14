"use client"

import { useAuth } from "@/contexts/auth-context"
import { SignupForm } from "@/app/components/auth/forms/signup-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"

export default function SignupPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to appropriate dashboard if already logged in
      console.log('[SignupPage] User logged in, redirecting to dashboard:', user.role);
      switch (user.role) {
        case 'owner':
          router.replace('/roles/owner/dashboard')
          break
        case 'staff':
          router.replace('/roles/staff/dashboard')
          break
        default:
          router.replace('/roles/consumer/dashboard')
      }
    }
  }, [user, isLoading, router])

  if (isLoading || user) {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
