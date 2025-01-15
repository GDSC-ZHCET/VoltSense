const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// MQTT client setup
const client = mqtt.connect("mqtt://34.16.11.88");

let message = "";

// Subscribe to a topic
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("esp32/message", (err) => {
    if (err) {
      console.error("Failed to subscribe to topic:", err);
    } else {
      console.log("Successfully subscribed to topic");
    }
  });
});

// Receive messages
client.on("message", (topic, msg) => {
  console.log(`Received message on topic ${topic}: ${msg.toString()}`);
  message = msg.toString();
});

// Handle connection errors
client.on("error", (error) => {
  console.error("MQTT Client Error:", error);
});

// Endpoint to get the latest message
app.get("/message", (req, res) => {
  if (message) {
    res.json({ message });
  } else {
    res.json({ message: "No message received yet." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
