"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore"; // Firestore functions

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InsightsBox from "@/components/InsightsBox";
import AnomaliesBox from "@/components/AnomaliesBox";

// Define the structure of the sensor data
interface SensorData {
  device_id: string;
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
}

// Maximum number of readings to display
const maxDataPoints = 10;

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
          <p className="font-bold">
            {`Time: ${new Date(label).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })}`}
          </p>
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

  const findPeakValues = (
    data: SensorData[],
    key: "voltage" | "current" | "power"
  ) => {
    if (data.length === 0) return null;
    return data.reduce(
      (max, point) => (point[key] > max[key] ? point : max),
      data[0]
    );
  };

  const ResponsiveChart = ({
    type,
  }: {
    type: "voltage" | "current" | "power";
  }) => {
    const config = chartConfig[type];
    const peakPoint = findPeakValues(data, type);

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
              tickFormatter={(timestamp) =>
                new Date(timestamp).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })
              }
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd" // Show first and last labels always
            />
            <YAxis
              width={70}
              label={{
                value: config.label,
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
              domain={[0, "auto"]} // Start from 0, auto-scale max
            />
            <Tooltip
              content={<CustomTooltip />}
              // Improve tooltip to show precise time
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            <Legend verticalAlign="top" height={36} />

            <Line
              type="monotone"
              dataKey={config.dataKey}
              name={config.label.split(" ")[0]}
              stroke={config.color}
              strokeWidth={2}
              connectNulls={false} // Ensure the line breaks when there's no data
              dot={({ cx, cy, payload }) => {
                if (!cx || !cy || !payload) return <></>; // Ensure cx, cy, and payload exist

                // Highlight peak value with a different color
                if (peakPoint && payload.timestamp === peakPoint.timestamp) {
                  return (
                    <circle cx={cx} cy={cy} r={6} fill="red" stroke="black" />
                  );
                }

                return <circle cx={cx} cy={cy} r={4} fill={config.color} />;
              }}
              isAnimationActive={false} // Disable line animation
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
  const [totalPowerConsumed, setTotalPowerConsumed] = useState<number>(0);
  const [deviceStatus, setDeviceStatus] = useState<boolean>(false); // Device status (on/off)
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket instance
  const [timeframe, setTimeframe] = useState("real-time"); // Default to real-time (last 10 readings)
  const [espID, setEspID] = useState("");

  // Initialize the device document in Firestore if it doesn't exist
  useEffect(() => {
    const initializeDeviceDocument = async () => {
      const deviceDocRef = doc(db, "devices", "ESP32_TEST_DEVICE"); // Replace with your device ID

      // Check if the document exists
      const deviceDoc = await getDoc(deviceDocRef);
      if (!deviceDoc.exists()) {
        // Create the document with default values
        await setDoc(deviceDocRef, {
          device_id: "ESP32_TEST_DEVICE",
          status: "off", // Default status
          last_updated: new Date().toISOString(),
        });
        console.log("Device document created in Firestore.");
      } else {
        console.log("Device document already exists.");
      }
    };

    initializeDeviceDocument();
  }, []);

  // Fetch device status from Firestore
  useEffect(() => {
    const fetchDeviceStatus = async () => {
      const deviceDocRef = doc(db, "devices", "ESP32_TEST_DEVICE"); // Replace with your device ID
      const deviceDoc = await getDoc(deviceDocRef);
      if (deviceDoc.exists()) {
        setDeviceStatus(deviceDoc.data().status === "on");
      }
    };

    fetchDeviceStatus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      let startTime = new Date();
      let interval = 1 * 60 * 1000; // Default interval: 1 minute (for small timeframes)

      if (timeframe === "real-time") {
        const q = query(
          collection(db, "sensorData"),
          orderBy("timestamp", "desc")
          // limit(10)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as SensorData;
          // Ensure we have valid numeric values
          return {
            ...docData,
            voltage: typeof docData.voltage === "number" ? docData.voltage : 0,
            current: typeof docData.current === "number" ? docData.current : 0,
            power: typeof docData.power === "number" ? docData.power : 0,
          };
        });

        // Calculate total power with safety checks
        let totalPower = 0;
        for (const entry of data) {
          if (typeof entry.power === "number" && !isNaN(entry.power)) {
            totalPower += entry.power / 1000;
          }
        }
        setTotalPowerConsumed(isNaN(totalPower) ? 0 : totalPower);

        setSensorData(data.slice(-maxDataPoints));
        return;
      }

      // Set appropriate startTime and data interval
      if (timeframe === "10m") {
        startTime.setMinutes(now.getMinutes() - 10);
        interval = 1 * 60 * 1000; // Every 1 min
      } else if (timeframe === "30m") {
        startTime.setMinutes(now.getMinutes() - 30);
        interval = 2 * 60 * 1000; // Every 2 min
      } else if (timeframe === "1h") {
        startTime.setHours(now.getHours() - 1);
        interval = 5 * 60 * 1000; // Every 5 min
      } else if (timeframe === "6h") {
        startTime.setHours(now.getHours() - 6);
        interval = 15 * 60 * 1000; // Every 15 min
      } else if (timeframe === "12h") {
        startTime.setHours(now.getHours() - 12);
        interval = 30 * 60 * 1000; // Every 30 min
      } else if (timeframe === "24h") {
        startTime.setDate(now.getDate() - 1);
        interval = 1 * 60 * 60 * 1000; // Every 1 hour
      } else if (timeframe === "7d") {
        startTime.setDate(now.getDate() - 7);
        interval = 6 * 60 * 60 * 1000; // Every 6 hours
      } else if (timeframe === "30d") {
        startTime.setDate(now.getDate() - 30);
        interval = 12 * 60 * 60 * 1000; // Every 12 hours
      }

      // Fetch only data within the selected timeframe
      const q = query(
        collection(db, "sensorData"),
        where("timestamp", ">=", startTime.toISOString()),
        where("timestamp", "<=", now.toISOString()),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      const rawData = querySnapshot.docs.map((doc) => doc.data() as SensorData);

      // Create evenly spaced timestamps for the chart
      const timePoints: number[] = [];
      let current = startTime.getTime();
      while (current <= now.getTime()) {
        timePoints.push(current);
        current += interval;
      }

      // Create chart data with proper interpolation
      const filledData: SensorData[] = timePoints.map((timestamp) => {
        // Find the closest data point before this timestamp
        const closestData = rawData.find(
          (data) =>
            new Date(data.timestamp).getTime() <= timestamp &&
            new Date(data.timestamp).getTime() > timestamp - interval
        );

        // If we found data within this interval window, use it
        if (closestData) {
          return {
            ...closestData,
            timestamp: new Date(timestamp).toISOString(),
          };
        }

        // Otherwise add a zero value for this timestamp
        return {
          device_id: "N/A",
          timestamp: new Date(timestamp).toISOString(),
          voltage: 0,
          current: 0,
          power: 0,
        };
      });

      setSensorData(filledData);
    };

    fetchData();
  }, [timeframe]);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://voltsense-server-110999938896.asia-south1.run.app"
    );
    setWs(ws);

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      if (newData.device_id) setEspID(newData.device_id);

      // Add timestamp to the data if not present
      newData.timestamp = newData.timestamp || new Date().toISOString();

      // Validate all numeric fields
      newData.voltage =
        typeof newData.voltage === "number" ? newData.voltage : 0;
      newData.current =
        typeof newData.current === "number" ? newData.current : 0;
      newData.power = typeof newData.power === "number" ? newData.power : 0;

      // Update total power consumed (only if power is valid)
      setTotalPowerConsumed((prevTotal) => {
        const powerIncrement = newData.power / 1000 || 0;
        const newTotal = (prevTotal || 0) + powerIncrement;
        return isNaN(newTotal) ? 0 : newTotal;
      });

      // Update device status from WebSocket (primary source of truth)
      if (newData.status !== undefined) {
        setDeviceStatus(newData.status);

        // Sync Firestore with the WebSocket status
        const deviceDocRef = doc(db, "devices", "ESP32_TEST_DEVICE");
        updateDoc(deviceDocRef, {
          status: newData.status ? "on" : "off",
          last_updated: new Date().toISOString(),
        });
      }

      // Update sensor data
      setSensorData((prevData) => {
        const updatedData = [...prevData, newData];
        if (updatedData.length > maxDataPoints) {
          return updatedData.slice(-maxDataPoints);
        }
        return updatedData;
      });
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

  const handleToggleDeviceStatus = async (checked: boolean) => {
    if (!ws) {
      console.error("WebSocket is not connected.");
      return;
    }

    // Optimistically update the UI
    setDeviceStatus(checked);

    // Send the toggle command via WebSocket
    try {
      const response = await fetch(
        `https://voltsense-server-110999938896.asia-south1.run.app/api/send-command`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: espID,
            command: "toggle_relay",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send command");
      }
    } catch (error) {
      console.error("Error toggling device:", error);

      // Revert the UI state if the command fails
      setDeviceStatus(!checked);
    }
  };

  // For the currentPower calculation
  const currentPower =
    sensorData.length > 0 &&
    typeof sensorData[sensorData.length - 1].power === "number" &&
    !isNaN(sensorData[sensorData.length - 1].power)
      ? sensorData[sensorData.length - 1].power / 1000
      : 0;

  // For voltage display
  const voltage =
    sensorData.length > 0 &&
    typeof sensorData[sensorData.length - 1].voltage === "number" &&
    !isNaN(sensorData[sensorData.length - 1].voltage)
      ? sensorData[sensorData.length - 1].voltage
      : 0;

  // For current display
  const current =
    sensorData.length > 0 &&
    typeof sensorData[sensorData.length - 1].current === "number" &&
    !isNaN(sensorData[sensorData.length - 1].current)
      ? sensorData[sensorData.length - 1].current
      : 0;

  // For the power change percentage calculation
  const powerChangePercentage =
    sensorData.length > 1 &&
    typeof sensorData[sensorData.length - 1].power === "number" &&
    typeof sensorData[sensorData.length - 2].power === "number" &&
    sensorData[sensorData.length - 2].power !== 0 // Avoid division by zero
      ? ((sensorData[sensorData.length - 1].power -
          sensorData[sensorData.length - 2].power) /
          sensorData[sensorData.length - 2].power) *
        100
      : 0;

  return (
    <main className="flex flex-col">
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          text="Overview of your smart switch system."
        >
          <div className="flex items-center gap-4">
            <Select onValueChange={setTimeframe} defaultValue="real-time">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-time">Real-time</SelectItem>
                <SelectItem value="10m">Last 10 Minutes</SelectItem>
                <SelectItem value="30m">Last 30 Minutes</SelectItem>
                <SelectItem value="1h">Last 1 Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="12h">Last 12 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DashboardHeader>
        <InsightsBox />
        <AnomaliesBox />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="readings">Recent Readings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Voltage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {voltage !== undefined ? voltage.toFixed(2) : "0.00"} V
                  </div>
                  <p className="text-xs text-muted-foreground">Stable</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {current !== undefined ? current.toFixed(2) : "0.00"} A
                  </div>
                  <p className="text-xs text-muted-foreground">Stable</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentPower !== undefined
                      ? currentPower.toFixed(2)
                      : "0.00"}{" "}
                    kW
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {powerChangePercentage !== undefined
                      ? `${powerChangePercentage.toFixed(1)}% from average`
                      : "0.0% from average"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Power Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalPowerConsumed.toFixed(2)} kWh
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {powerChangePercentage.toFixed(1)}% from last reading
                  </p>
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
                      <Switch
                        id="device-status"
                        className="scale-125"
                        checked={deviceStatus}
                        onCheckedChange={handleToggleDeviceStatus}
                      />
                    </div>
                    <p className="text-xs text-blue-600 font-medium">
                      Device is currently {deviceStatus ? "ON" : "OFF"}
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
