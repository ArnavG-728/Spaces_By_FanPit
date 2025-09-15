'use client'

import { LoginForm } from "../forms/login-form"
import { Navbar } from "@/components/navbar"

export default function LoginPage() {
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
