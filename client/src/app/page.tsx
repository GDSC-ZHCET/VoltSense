"use client";
import { useEffect, useState } from "react";


export default function Home() {
  const [messages, setMessages] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:3001/messages");
        const data = await response.json();
        setMessages(data); // Assuming you have a state variable named `messages`
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <>
      
    </>
  );
}
