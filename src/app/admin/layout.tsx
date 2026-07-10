"use client";

import { Sidebar, SidebarMobileTabs } from "@/components/admin/Sidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-black text-white">
        <div className="pt-16 lg:pt-20 flex">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <SidebarMobileTabs />
            <main className="px-4 sm:px-6 lg:px-10 py-8 lg:py-12 max-w-[1400px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
