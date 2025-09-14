"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAccessToken } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'consumer' | 'owner' | 'staff';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { access_token } = response.data;
      
      setAccessToken(access_token);
      localStorage.setItem('access_token', access_token);
      
      // Get user profile
      const profileResponse = await authAPI.profile();
      const userData = profileResponse.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error details:', error);
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    setIsLoading(true);
    try {
      console.log('Signup attempt:', { name, email, password: '***', role });
      await authAPI.signup({ name, email, password, role });
      // Auto-login after signup
      await login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    setUser(null);
    setAccessToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
