// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { motion, useScroll, useTransform } from "framer-motion";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// // import { DotPattern } from "@/components/ui/dot-pattern";
// import { Zap, Shield, Activity, BarChart3, ArrowRight } from "lucide-react";
// import { ThemeToggle } from "@/components/theme-toggle";
// import Image from "next/image";

// const powerData = [
//   { name: "Jan", value: 4000 },
//   { name: "Feb", value: 3000 },
//   { name: "Mar", value: 5000 },
//   { name: "Apr", value: 4500 },
//   { name: "May", value: 4200 },
//   { name: "Jun", value: 3800 },
// ];

// export default function LandingPage() {
//   const [mounted, setMounted] = useState(false);
//   const { scrollYProgress } = useScroll();
//   const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
//       {/* <DotPattern /> */}

//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <motion.div
//               className="flex items-center"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {/* <Zap className="w-8 h-8 text-blue-600 dark:text-blue-500" /> */}
//               <Image
//                 src={"/voltsense.png"}
//                 width={40}
//                 height={40}
//                 alt="voltsense-logo"
//               ></Image>
//               <span className="text-xl font-bold">VoltSense</span>
//             </motion.div>
//             <motion.nav
//               className="flex items-center space-x-8"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Link
//                 href="/features"
//                 className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-500"
//               >
//                 Features
//               </Link>
//               <Link
//                 href="/pricing"
//                 className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-500"
//               >
//                 Pricing
//               </Link>
//               <ThemeToggle />
//               <Link href="/auth/login">
//                 <Button variant="outline" className="ml-4">
//                   Login
//                 </Button>
//               </Link>
//             </motion.nav>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="pt-32 pb-16 relative overflow-hidden">
//         <motion.div
//           className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           style={{ opacity }}
//         >
//           <motion.h1
//             className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//           >
//             Monitor Your Power
//             <span className="text-blue-600 dark:text-blue-500">
//               {" "}
//               in Real-Time
//             </span>
//           </motion.h1>
//           <motion.p
//             className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.4 }}
//           >
//             Advanced monitoring and control for your electrical infrastructure,
//             ensuring safety and efficiency with real-time insights.
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.6 }}
//           >
//             <Link href={"/auth/login"}>
//               <Button size="lg" className="mr-4">
//                 Get Started <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             viewport={{ once: true }}
//           >
//             <FeatureCard
//               icon={
//                 <Activity className="h-8 w-8 text-blue-600 dark:text-blue-500" />
//               }
//               title="Real-Time Monitoring"
//               description="Track voltage, current, and power consumption with precision."
//             />
//             <FeatureCard
//               icon={
//                 <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" />
//               }
//               title="Advanced Safety"
//               description="Automatic alerts and shutoffs to prevent electrical hazards."
//             />
//             <FeatureCard
//               icon={
//                 <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-500" />
//               }
//               title="Analytics"
//               description="AI-powered insights for predictive maintenance."
//             />
//             <FeatureCard
//               icon={
//                 <Zap className="h-8 w-8 text-blue-600 dark:text-blue-500" />
//               }
//               title="Energy Efficiency"
//               description="Optimize power consumption and reduce costs."
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 relative">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             viewport={{ once: true }}
//           >
//             <StatCard number="30%" label="Energy Saved" />
//             <StatCard number="1M+" label="Devices Monitored" />
//             <StatCard number="99.9%" label="Uptime" />
//             <StatCard number="24/7" label="Support" />
//           </motion.div>
//         </div>
//       </section>

//       {/* Chart Section */}
//       <section className="py-16 relative">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             viewport={{ once: true }}
//           >
//             <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
//               <CardContent className="p-6">
//                 <h3 className="text-2xl font-bold mb-6">
//                   Power Consumption Overview
//                 </h3>
//                 <div className="h-[400px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={powerData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                       <XAxis dataKey="name" stroke="#374151" />
//                       <YAxis stroke="#374151" />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#1f2937",
//                           border: "none",
//                           borderRadius: "0.5rem",
//                           color: "#f3f4f6",
//                         }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="value"
//                         stroke="#3b82f6"
//                         strokeWidth={2}
//                         dot={{ fill: "#3b82f6" }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             className="text-center"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-8">
//               Join thousands of businesses already using VoltSense
//             </p>
//             <Link href={"/auth/login"}>
//               <Button size="lg">
//                 Start Monitoring <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-sm font-semibold mb-4">Product</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     href="/features"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/pricing"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     Pricing
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold mb-4">Company</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     href="/about"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/contact"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold mb-4">Resources</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     href="/docs"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     Documentation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/support"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     Support
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold mb-4">Legal</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     href="/privacy"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     Privacy
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/terms"
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
//                   >
//                     Terms
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
//             <p>&copy; 2024 VoltSense. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function FeatureCard({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className="relative p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800"
//     >
//       <div className="mb-4">{icon}</div>
//       <h3 className="text-lg font-semibold mb-2">{title}</h3>
//       <p className="text-gray-600 dark:text-gray-400">{description}</p>
//     </motion.div>
//   );
// }

// function StatCard({ number, label }: { number: string; label: string }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className="relative p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 text-center"
//     >
//       <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-500">
//         {number}
//       </div>
//       <p className="text-gray-600 dark:text-gray-400">{label}</p>
//     </motion.div>
//   );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Power } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig"; // Import Firebase configuration
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

// Define the structure of the sensor data
interface SensorData {
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
}

function DashboardHeader({
  heading,
  text,
  children,
}: {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-wide">{heading}</h1>
        {text && <p className="text-neutral-500">{text}</p>}
      </div>
      {children}
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return <div className="grid items-start gap-8">{children}</div>;
}

function Overview({ data }: { data: SensorData[] }) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-bold">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${
                entry.name === "Voltage"
                  ? "V"
                  : entry.name === "Current"
                  ? "A"
                  : "W"
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartConfig = {
    voltage: {
      color: "#8884d8",
      label: "Voltage (V)",
      dataKey: "voltage",
    },
    current: {
      color: "#82ca9d",
      label: "Current (A)",
      dataKey: "current",
    },
    power: {
      color: "#ffc658",
      label: "Power (W)",
      dataKey: "power",
    },
  };

  const ResponsiveChart = ({
    type,
  }: {
    type: "voltage" | "current" | "power";
  }) => {
    const config = chartConfig[type];

    return (
      <div className="w-full mt-6">
        <ResponsiveContainer width="100%" height={350} minWidth={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 50,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              height={50}
              label={{
                value: "Time (hours)",
                position: "bottom",
                offset: 20,
              }}
            />
            <YAxis
              width={70}
              label={{
                value: config.label,
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey={config.dataKey}
              name={config.label.split(" ")[0]}
              stroke={config.color}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Tabs defaultValue="voltage" className="col-span-4">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="voltage">Voltage</TabsTrigger>
        <TabsTrigger value="current">Current</TabsTrigger>
        <TabsTrigger value="power">Power</TabsTrigger>
      </TabsList>
      <TabsContent value="voltage">
        <Card>
          <CardHeader>
            <CardTitle>Voltage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChart type="voltage" />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="current">
        <Card>
          <CardHeader>
            <CardTitle>Current Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChart type="current" />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="power">
        <Card>
          <CardHeader>
            <CardTitle>Power Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChart type="power" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function RecentReadings({ data }: { data: SensorData[] }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Readings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.map((reading, index) => (
            <div key={index} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {new Date(reading.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Voltage: {reading.voltage}V, Current: {reading.current}A,
                  Power: {reading.power}W
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket("ws://192.168.1.14:8080");

    ws.onmessage = async (event) => {
      const newData = JSON.parse(event.data);

      // Add timestamp to the data
      newData.timestamp = new Date().toISOString();

      // Update state for UI
      setSensorData((prevData) => [...prevData, newData]);

      // Store data in Firebase Firestore
      try {
        const docRef = await addDoc(collection(db, "sensorData"), newData);
        console.log("Data stored in Firestore with ID:", docRef.id);
      } catch (error) {
        console.error("Error storing data in Firestore:", error);
      }
    };

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <main className="flex flex-col">
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          text="Overview of your smart switch system."
        >
          <Button>Refresh</Button>
        </DashboardHeader>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="readings">Recent Readings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Power Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45.2 kWh</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2 kW</div>
                  <p className="text-xs text-muted-foreground">
                    +7% from average
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Voltage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">220 V</div>
                  <p className="text-xs text-muted-foreground">Stable</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Power className="w-4 h-4" />
                    Device Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="device-status"
                        className="text-lg font-semibold"
                      >
                        Power
                      </Label>
                      <Switch id="device-status" className="scale-125" />
                    </div>
                    <p className="text-xs text-blue-600 font-medium">
                      Device is currently ON
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Overview data={sensorData} />
          </TabsContent>
          <TabsContent value="readings">
            <RecentReadings data={sensorData} />
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </main>
  );
}
