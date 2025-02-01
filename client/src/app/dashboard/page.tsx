"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function DashboardPage() {
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);
  const [isDeviceOn, setIsDeviceOn] = useState(false);
  const [data, setData] = useState([]);

  //   useEffect(() => {
  //     const ws = new WebSocket("ws://YOUR_ESP32_IP:PORT");
  //     ws.onmessage = (event) => {
  //       const message = JSON.parse(event.data);
  //       setVoltage(message.voltage);
  //       setCurrent(message.current);
  //       setPower(message.voltage * message.current);
  //       setData((prev) => [
  //         ...prev.slice(-20),
  //         { time: new Date().toLocaleTimeString(), voltage: message.voltage },
  //       ]);
  //     };
  //     return () => ws.close();
  //   }, []);

  useEffect(() => {
    const fetchDeviceStatus = async (deviceId: string) => {
      const deviceRef = doc(db, "devices", deviceId);
      const deviceSnap = await getDoc(deviceRef);
      if (deviceSnap.exists()) {
        setIsDeviceOn(deviceSnap.data().status);
      }
    };

    fetchDeviceStatus("device_123");
  }, []);

  const toggleDevice = async (deviceId: string, status: boolean) => {
    const deviceRef = doc(db, "devices", deviceId);
    await updateDoc(deviceRef, { status: status });
    setIsDeviceOn(status);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Voltage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{voltage.toFixed(2)} V</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{current.toFixed(2)} A</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Power Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{power.toFixed(2)} W</p>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 flex flex-col sm:flex-row sm:space-y-0 space-y-6 space-x-0 sm:space-x-6 justify-between">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Real-time Voltage Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="voltage" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Power Consumption History Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="voltage" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Control</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p>Smart Switch</p>
            <Switch
              checked={isDeviceOn}
              onCheckedChange={(checked) => {
                setIsDeviceOn(checked); // Optimistically update the UI
                toggleDevice("device_123", checked);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
