'use client'

import { SignupForm } from "@/app/components/auth/forms/signup-form"
import { Navbar } from "@/components/navbar"

export default function SignupPage() {
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
