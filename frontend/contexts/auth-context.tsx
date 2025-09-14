"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "consumer" | "owner" | "staff"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual API
      // For demo purposes, we'll set the role based on the email
      const role: UserRole = email.includes('owner@') ? 'owner' : 
                           email.includes('staff@') ? 'staff' : 'consumer';
      
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role, // This would come from API in a real app
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual API
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
