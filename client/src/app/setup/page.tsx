"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SetupPage() {
  const router = useRouter();
  const [deviceName, setDeviceName] = useState("");
  const [ssid, setSSID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [networks, setNetworks] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch available Wi-Fi networks
  const scanNetworks = async () => {
    setScanning(true);
    setError("");

    try {
      const response = await fetch("http://192.168.4.1/scan");
      if (response.ok) {
        const data = await response.json();
        setNetworks(data);
      } else {
        setError("Failed to scan for networks. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while scanning for networks.");
    } finally {
      setScanning(false);
    }
  };

  // Automatically scan for networks when the page loads
  useEffect(() => {
    scanNetworks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Send credentials to the ESP32
      const response = await fetch("http://192.168.4.1/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `device_name=${encodeURIComponent(
          deviceName
        )}&ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(
          password
        )}`,
      });

      if (response.ok) {
        setSuccess(
          "Wi-Fi credentials saved successfully! The device will restart."
        );
        setTimeout(() => {
          router.push("/"); // Redirect to home page after success
        }, 3000);
      } else {
        setError("Failed to save Wi-Fi credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Wi-Fi Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Enter a name for your device"
                required
              />
            </div>
            <div>
              <Label htmlFor="ssid">Wi-Fi Network</Label>
              <div className="flex space-x-2">
                <Select onValueChange={(value) => setSSID(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a network" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((network, index) => (
                      <SelectItem key={index} value={network}>
                        {network}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={scanNetworks}
                  disabled={scanning}
                >
                  {scanning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wifi className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
