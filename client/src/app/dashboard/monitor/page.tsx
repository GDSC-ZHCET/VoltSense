"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Consolidated components
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

// Mock data - replace with real-time data from your API
const mockData = [
  { time: "00:00", power: 100, voltage: 220, current: 0.45 },
  { time: "01:00", power: 120, voltage: 221, current: 0.54 },
  { time: "02:00", power: 110, voltage: 219, current: 0.5 },
  { time: "03:00", power: 130, voltage: 222, current: 0.59 },
  { time: "04:00", power: 140, voltage: 220, current: 0.64 },
];

export default function MonitorPage() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    // Here you would fetch real-time data from your API
    // and update the state periodically
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Real-time Monitor"
        text="Live metrics from your smart switch."
      >
        <Button>Refresh</Button>
      </DashboardHeader>
      <Tabs defaultValue="power" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="power">Power</TabsTrigger>
          <TabsTrigger value="voltage">Voltage</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
        </TabsList>
        <TabsContent value="power">
          <Card>
            <CardHeader>
              <CardTitle>Power Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="voltage">
          <Card>
            <CardHeader>
              <CardTitle>Voltage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#ffc658"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
