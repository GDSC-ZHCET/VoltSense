"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Mock data - replace with real data from your API
const mockData = [
  { date: "2023-05-01", consumption: 45, cost: 5.4 },
  { date: "2023-05-02", consumption: 52, cost: 6.24 },
  { date: "2023-05-03", consumption: 49, cost: 5.88 },
  { date: "2023-05-04", consumption: 47, cost: 5.64 },
  { date: "2023-05-05", consumption: 50, cost: 6.0 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="Analyze your energy consumption patterns."
      >
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
          // className="w-full sm:w-[180px]"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Tabs defaultValue="consumption" className="space-y-4">
          <TabsList>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
          </TabsList>
          <TabsContent value="consumption">
            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="consumption" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cost">
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
