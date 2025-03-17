"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Power,
  Zap,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebaseConfig";
import { getToken } from "firebase/messaging";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Timestamp } from "firebase/firestore"; // ✅ Import Timestamp type
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: "layout-dashboard",
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    icon: "calendar",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];

interface Alert {
  id: string;
  message: string;
  timestamp: Timestamp; // ✅ Use Timestamp type
  read?: boolean; // ✅ Fix: Add 'read' as an optional property
  type?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [displayedAlerts, setDisplayedAlerts] = useState<Alert[]>([]);

  const [prevAlertCount, setPrevAlertCount] = useState(0);
  const [playSound, setPlaySound] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);

  const voltageThreshold = 300;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName || "User",
          email: user.email || "user@example.com",
          image: user.photoURL || "",
        });
      } else {
        setUser(null);
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/auth"); // Redirect to auth page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!messaging) {
      console.warn("FCM is not available in this environment.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FCM_KEY,
        });
        console.log("FCM Token:", token);

        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("User UID:", user.uid);
            await saveTokenToBackend(user.uid, token); // ✅ Pass dynamic UID
          } else {
            console.warn("No user logged in. Cannot save FCM token.");
          }
        });
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const saveTokenToBackend = async (userId: string, token: string) => {
    try {
      const response = await fetch(
        "https://voltsense-server-110999938896.asia-south1.run.app/api/save-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, token }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save FCM token");
      }

      console.log("FCM token saved to backend");
    } catch (error) {
      console.error("Error saving FCM token:", error);
    }
  };

  const sendNotification = async (message: string) => {
    try {
      const response = await fetch(
        "https://voltsense-server-110999938896.asia-south1.run.app/api/get-tokens"
      );
      const { tokens } = await response.json();

      if (tokens.length === 0) {
        console.warn("No FCM tokens available.");
        return;
      }

      await fetch(
        "https://voltsense-server-110999938896.asia-south1.run.app/api/send-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tokens,
            notification: {
              title: "New Alert",
              body: message,
            },
          }),
        }
      );
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "alerts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newAlerts: Alert[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Alert, "id">; // ✅ Exclude 'id' from data
        return { id: doc.id, ...data }; // ✅ Ensure 'id' is only assigned once
      });

      // Check if there are new unread alerts
      if (
        newAlerts.length > prevAlertCount &&
        newAlerts.some((alert) => !alert.read)
      ) {
        setPlaySound(true);
      }

      setAlerts(newAlerts);
      setDisplayedAlerts(newAlerts.filter((alert) => !alert.read));
      setPrevAlertCount(newAlerts.length);
    });

    return () => unsubscribe();
  }, [prevAlertCount]);

  useEffect(() => {
    // Listen to your metrics collection (e.g., 'powerMetrics')
    const metricsRef = collection(db, "sensorData");
    const metricsQuery = query(metricsRef, orderBy("timestamp", "desc"));

    const metricsUnsubscribe = onSnapshot(metricsQuery, async (snapshot) => {
      if (snapshot.empty) return;

      // Get the latest metrics
      const latestMetric = snapshot.docs[0].data();
      const timestamp = new Date();

      // Check thresholds and create alerts if exceeded
      if (latestMetric.voltage > voltageThreshold) {
        const alertData = {
          message: `Voltage threshold exceeded: ${latestMetric.voltage}V`,
          timestamp: timestamp,
          read: false,
          type: "voltage",
        };
        await addDoc(collection(db, "alerts"), alertData);
        await sendNotification(alertData.message); // Send notification
      }
    });

    return () => metricsUnsubscribe();
  }, [voltageThreshold]);

  useEffect(() => {
    if (playSound) {
      try {
        const audio = new Audio("/assets/alert.mp3");
        audio.play().catch((error) => {
          console.error("Error playing alert sound:", error);
        });
      } catch (error) {
        console.error("Failed to play alert sound:", error);
      }
      setPlaySound(false);
    }
  }, [playSound]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Function to remove all alerts
  const clearAllAlerts = async () => {
    try {
      // Update all alerts to read status in Firestore
      const promises = displayedAlerts.map((alert) =>
        updateDoc(doc(db, "alerts", alert.id), { read: true })
      );
      await Promise.all(promises);

      // Clear the displayed alerts
      setDisplayedAlerts([]);
    } catch (error) {
      console.error("Error clearing all alerts:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Update the document in Firestore
      await updateDoc(doc(db, "alerts", id), { read: true });

      // Remove the alert from the displayed alerts
      setDisplayedAlerts((prevDisplayedAlerts) =>
        prevDisplayedAlerts.filter((alert) => alert.id !== id)
      );
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };
  const getAlertIcon = (message: string) => {
    if (message.includes("Voltage"))
      return <Zap className="h-5 w-5 text-yellow-500" />;
    if (message.includes("Current"))
      return <Power className="h-5 w-5 text-blue-500" />;
    if (message.includes("Power"))
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
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

      {/* Notifications Section */}
      <div className="px-4 py-2 border-t border-gray-300">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-6 w-6 text-gray-600" /> Notifications
          {displayedAlerts.filter((alert) => !alert.read).length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {displayedAlerts.filter((alert) => !alert.read).length > 99
                ? "99+"
                : displayedAlerts.filter((alert) => !alert.read).length}
            </span>
          )}
        </h3>
        {displayedAlerts.length > 0 && (
          <button
            onClick={clearAllAlerts}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
        <ScrollArea className="h-96 mt-2">
          <div className="space-y-2">
            {displayedAlerts.length === 0 ? (
              <p className="text-sm text-gray-500">No new alerts</p>
            ) : (
              displayedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 p-3 border rounded shadow-md transition-all duration-300 hover:bg-gray-100 ${
                    !alert.read ? "bg-blue-50 border-blue-200" : "bg-white"
                  }`}
                >
                  {getAlertIcon(alert.message)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(alert.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </div>
                  {!alert.read && (
                    <button
                      className="text-blue-500 text-xs font-bold"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="px-4 py-2 border-t border-gray-300">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
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
