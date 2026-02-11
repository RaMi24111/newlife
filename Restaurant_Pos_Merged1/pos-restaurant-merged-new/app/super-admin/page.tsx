"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminHome() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("superadmin_token");
    
    if (token) {
      // If authenticated, redirect to dashboard
      router.push("/super-admin/dashboard");
    } else {
      // If not authenticated, redirect to login
      router.push("/super-admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF6EE]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B1F1F] mx-auto"></div>
        <p className="mt-4 text-[#7B1F1F]">Redirecting...</p>
      </div>
    </div>
  );
}
