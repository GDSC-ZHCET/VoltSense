"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/layout/navbar";

export default function NavigationWrapper() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) return null;
  return <Nav />;
}
