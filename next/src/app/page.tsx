"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import DashboardSection from "@/components/sections/DashboardSection";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (!loading && !isAuthenticated) {
      console.log("🔄 [Home] Not authenticated, redirecting to /auth");
      router.push("/auth");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show dashboard if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <DashboardSection />
    </div>
  );
}
