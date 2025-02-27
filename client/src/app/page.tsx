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

  // const ResponsiveChart = ({
  //   type,
  // }: {
  //   type: "voltage" | "current" | "power";
  // }) => {
  //   const config = chartConfig[type];

  //   return (
  //     <div className="w-full mt-6">
  //       <ResponsiveContainer width="100%" height={350} minWidth={300}>
  //         <LineChart
  //           data={data}
  //           margin={{
  //             top: 5,
  //             right: 30,
  //             left: 50,
  //             bottom: 50,
  //           }}
  //         >
  //           <CartesianGrid strokeDasharray="3 3" />
  //           <XAxis
  //             dataKey="timestamp"
  //             height={50}
  //             label={{
  //               value: "Time (hours)",
  //               position: "bottom",
  //               offset: 20,
  //             }}
  //           />
  //           <YAxis
  //             width={70}
  //             label={{
  //               value: config.label,
  //               angle: -90,
  //               position: "insideLeft",
  //               offset: -20,
  //             }}
  //           />
  //           <Tooltip content={<CustomTooltip />} />
  //           <Legend verticalAlign="top" height={36} />
  //           <Line
  //             type="monotone"
  //             dataKey={config.dataKey}
  //             name={config.label.split(" ")[0]}
  //             stroke={config.color}
  //             strokeWidth={2}
  //             dot={{ r: 4 }}
  //             isAnimationActive={false}
  //           />
  //         </LineChart>
  //       </ResponsiveContainer>
  //     </div>
  //   );
  // };

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
            key={type}
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
              isAnimationActive={false}
              animationDuration={0}
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
    const ws = new WebSocket("ws://192.168.1.14:5000");

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
