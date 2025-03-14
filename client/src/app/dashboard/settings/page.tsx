"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [espIP, setEspIP] = useState("");
  const [deviceId, setDeviceId] = useState(""); // Store ESP32 device ID

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket(
      "wss://voltsense-server-110999938896.asia-south1.run.app"
    );

    ws.onopen = () => {
      console.log("✅ WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 Received WebSocket message:", message);

      // Extract IP address & device_id dynamically
      if (message.ip_address) {
        setEspIP(message.ip_address);
      }
      if (message.device_id) {
        setDeviceId(message.device_id);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []); // Runs only once when the component mounts

  const sendCommand = async (command: string, successMessage: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!deviceId) {
      setError("ESP32 is not connected yet. Please wait...");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://voltsense-server-110999938896.asia-south1.run.app/api/send-command`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: deviceId, // Use dynamic device ID
            command,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${command}`);

      setSuccess(data.message || successMessage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Device Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-gray-700">Reset Wi-Fi Credentials</Label>
              <p className="text-sm text-gray-600 mb-4">
                Reset the ESP32's Wi-Fi settings.
              </p>
              <Button
                onClick={() =>
                  sendCommand("reset_credentials", "Wi-Fi reset successful!")
                }
                className="w-full"
                disabled={loading || !deviceId}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Reset Credentials"
                )}
              </Button>
            </div>

            <div>
              <Label className="text-gray-700">Reboot Device</Label>
              <p className="text-sm text-gray-600 mb-4">
                Restart the ESP32 remotely.
              </p>
              <Button
                onClick={() =>
                  sendCommand("reboot", "Device rebooted successfully!")
                }
                className="w-full"
                disabled={loading || !deviceId}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Reboot Device"
                )}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-500 text-center">{success}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
