"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'consumer' | 'owner' | 'staff';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signup: (userData: any) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (userData: any) => {
    const response = await apiClient.post('/auth/signup', userData);
    const { token, user: returnedUser } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(returnedUser));
    setToken(token);
    setUser(returnedUser);
    router.push('/'); // Redirect to home after signup
  };

  const login = async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user: returnedUser } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(returnedUser));
    setToken(token);
    setUser(returnedUser);
    router.push('/'); // Redirect to home after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
