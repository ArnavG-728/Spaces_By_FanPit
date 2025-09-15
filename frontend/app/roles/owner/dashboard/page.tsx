"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from "@/components/navbar";
import { OwnerDashboard } from "@/app/roles/owner/owner-dashboard";

export default function OwnerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
    if (!loading && user && user.role !== 'owner') {
      router.replace('/'); // Redirect non-owners to home
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'owner') {
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
        <OwnerDashboard />
      </main>
    </div>
  );
}
