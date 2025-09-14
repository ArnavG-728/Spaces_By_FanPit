"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<'consumer' | 'owner' | 'staff'>("consumer")
  const { signup, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[SignupForm] Submit clicked');
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName; // Default to firstName if lastName is empty

    const fullName = `${firstName} ${lastName}`.trim();

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return;
    }

    console.log('[SignupForm] Payload', { email, fullName, role });
    try {
      await signup(email, password, fullName, role);
      toast({
        title: "Account created successfully!",
        description: "Welcome to Spaces",
      })
      // Let auth context handle redirect after user state is updated
      // No manual redirect needed here
    } catch (error) {
      console.error('[SignupForm] Signup failed:', error);
      toast({
        title: "Signup failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join Spaces and start booking amazing spaces</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <div className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Select value={role} onValueChange={(value: 'consumer' | 'owner' | 'staff') => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumer">Consumer - Book spaces</SelectItem>
                <SelectItem value="owner">Owner - Manage spaces</SelectItem>
                <SelectItem value="staff">Staff - Check-in guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}