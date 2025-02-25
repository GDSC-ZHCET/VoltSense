"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import Nav from "@/components/layout/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col px-2">
      <header className="sticky top-0 z-40 border-b bg-background">
        {/* <Nav /> */}
        <div className="container flex h-16 items-center justify-between sm:hidden">
          {/* <h1 className="text-2xl font-bold">Smart Switch Dashboard</h1> */}
          <Button
            variant="ghost"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className={`${mobileMenuOpen ? "block" : "hidden"} md:block`}>
          <Sidebar />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
