'use client'

import { LoginForm } from "./login-form"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard if already logged in
      switch (user.role) {
        case 'owner':
          router.push('/')
          break
        case 'staff':
          router.push('/roles/staff/dashboard')
          break
        default:
          router.push('/roles/consumer/dashboard')
      }
    }
  }, [user, router])

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
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
