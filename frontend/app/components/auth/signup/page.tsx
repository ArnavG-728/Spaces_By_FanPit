'use client'

import { SignupForm } from "@/app/components/auth/forms/signup-form"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to appropriate dashboard if already logged in
      switch (user.role) {
        case 'owner':
          router.push('/owner/dashboard')
          break
        case 'staff':
          router.push('/staff/dashboard')
          break
        default:
          router.push('/dashboard')
      }
    }
  }, [user, loading, router])

  if (loading || user) {
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
