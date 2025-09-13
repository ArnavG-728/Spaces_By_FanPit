import { SignupForm } from "@/components/auth/signup-form"
import { Navbar } from "@/components/navbar"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <SignupForm />
      </div>
    </div>
  )
}
