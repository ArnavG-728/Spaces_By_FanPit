"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

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
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const signup = async (userData: any) => {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    const { token, user: returnedUser } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(returnedUser));
    setToken(token);
    setUser(returnedUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    router.push('/'); // Redirect to home after signup
  };

  const login = async (credentials: any) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user: returnedUser } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(returnedUser));
    setToken(token);
    setUser(returnedUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    router.push('/'); // Redirect to home after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
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
