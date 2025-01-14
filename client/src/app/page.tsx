"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch("http://localhost:3001/message"); // Your Express server URL
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
    const interval = setInterval(fetchMessage, 2000); // Fetch message every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>ESP32 Message</h1>
      <p>{message}</p>
    </div>
  );
}
