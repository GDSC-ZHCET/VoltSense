"use client";
import { useEffect, useState } from "react";

export default function WebSocketComponent() {
  const [data, setData] = useState<{ voltage: number; current: number } | null>(
    null
  );

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => console.log("Connected to WebSocket");
    socket.onmessage = async (event) => {
      try {
        const text = await event.data.text();
        const jsonData = JSON.parse(text);
        setData(jsonData);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onclose = () => console.log("WebSocket Disconnected");

    return () => socket.close();
  }, []);

  return (
    <div>
      <h1>Live Sensor Data</h1>
      {data ? (
        <p>
          Voltage: {data.voltage}V | Current: {data.current}A
        </p>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}
