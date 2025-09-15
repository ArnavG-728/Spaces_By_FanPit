"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from "@/components/navbar";
import { ConsumerDashboard } from "./_components/consumer-dashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
    if (!loading && user && user.role !== 'consumer') {
      // Redirect non-consumers to their respective dashboards
      if (user.role === 'owner') router.replace('/roles/owner/dashboard');
      if (user.role === 'staff') router.replace('/roles/staff/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'consumer') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="mt-4 text-muted-foreground">Loading or Access Denied...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ConsumerDashboard />
      </main>
    </div>
  );
}
