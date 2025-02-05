"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: "layout-dashboard",
  },
  {
    title: "Real-time Monitor",
    href: "/dashboard/monitor",
    icon: "activity",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: "bar-chart",
  },
  {
    title: "Schedules",
    href: "/dashboard/schedules",
    icon: "calendar",
  },
  {
    title: "Automation",
    href: "/dashboard/automation",
    icon: "settings",
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: "bell",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          {/* <h2 className="mb-2 px-2 text-lg font-semibold">Smart Switch</h2> */}
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <NextLink key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d={getIconPath(item.icon)} />
                  </svg>
                  {item.title}
                </Button>
              </NextLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get icon paths
function getIconPath(icon: string): string {
  // Add paths for each icon you're using
  const paths: { [key: string]: string } = {
    "layout-dashboard": "M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    "bar-chart": "M12 20V10M18 20V4M6 20v-4",
    calendar:
      "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
    settings:
      "M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  };
  return paths[icon] || "";
}
