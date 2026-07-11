"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      {/* Dedicated admin top bar (replaces the public-site Header on /admin/*).
          Mobile <lg nav lives in the top bar's slide-in hamburger drawer. */}
      <AdminTopBar />
      <div className="min-h-screen bg-black text-white pt-14">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <main className="px-4 sm:px-6 lg:px-10 py-8 lg:py-12 max-w-[1400px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
