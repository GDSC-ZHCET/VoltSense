"use client";
import { useState } from "react";

export default function WiFiSetup() {
  const [ip, setIp] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  const saveWiFi = async () => {
    const url = `http://${ip}/save`;
    const params = new URLSearchParams({ ssid, password });

    try {
      const response = await fetch(url, { method: "POST", body: params });
      if (response.ok) {
        alert("WiFi Credentials Sent! ESP32 will reboot.");
      } else {
        alert("Error saving WiFi.");
      }
    } catch (error) {
      alert("Could not connect to ESP32.");
    }
  };

  return (
    <div>
      <h2>ESP32 WiFi Configuration</h2>
      <input
        type="text"
        placeholder="ESP32 IP Address"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <input
        type="text"
        placeholder="WiFi SSID"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
      />
      <input
        type="password"
        placeholder="WiFi Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={saveWiFi}>Save WiFi</button>
    </div>
  );
}
