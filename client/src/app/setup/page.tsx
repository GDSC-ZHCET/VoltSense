"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import mdns from "multicast-dns";

export default function SetupPage() {
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [ssid, setSSID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Scan for ESP32 devices using mDNS
  useEffect(() => {
    const scanner = mdns();

    scanner.on("response", (response) => {
      const esp32Devices = response.answers
        .filter((record) => record.name.includes("esp32"))
        .map((record) => record.name);
      setDevices(esp32Devices);
    });

    scanner.query({
      questions: [
        {
          name: "_esp32setup._tcp.local",
          type: "PTR",
        },
      ],
    });

    return () => {
      scanner.destroy();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // try {
    //   // Send credentials to the selected ESP32
    //   const response = await fetch(`http://${selectedDevice}/setup`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: `ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(
    //       password
    //     )}`,
    //   });

    //   if (response.ok) {
    //     setSuccess(
    //       "Wi-Fi credentials saved successfully! The device will restart."
    //     );
    //   } else {
    //     setError("Failed to save Wi-Fi credentials. Please try again.");
    //   }
    // } catch (err) {
    //   setError("An error occurred. Please check your connection.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Wi-Fi Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="device">Select Device</Label>
              <select
                id="device"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a device</option>
                {devices.map((device, index) => (
                  <option key={index} value={device}>
                    {device}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="ssid">Wi-Fi SSID</Label>
              <Input
                id="ssid"
                type="text"
                value={ssid}
                onChange={(e) => setSSID(e.target.value)}
                placeholder="Enter your Wi-Fi SSID"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Wi-Fi Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Wi-Fi password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
