const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const { db } = require("./firebase");
require("dotenv").config();

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// MQTT client setup
const client = mqtt.connect(`mqtt://${process.env.MQTT_VM_INSTANCE_IP}`);

let messageLog = []; // Array to store message history

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

// Receive messages and store them in the log
client.on("message", (topic, msg) => {
  const message = msg.toString();
  console.log(`Received message on topic ${topic}: ${message}`);

  // Add the new message to the log
  messageLog.push({
    timestamp: new Date().toISOString(),
    topic,
    message,
  });
});

// Handle connection errors
client.on("error", (error) => {
  console.error("MQTT Client Error:", error);
});

// Endpoint to get the latest message
app.get("/message", (req, res) => {
  const latestMessage = messageLog[messageLog.length - 1] || {
    message: "No message received yet.",
  };
  res.json(latestMessage);
});

// Endpoint to get the full message log
app.get("/messages", (req, res) => {
  res.json(messageLog);
});

// Test Firestore - Add a document
app.get("/add-doc", async (req, res) => {
  try {
    const docRef = await db.collection("testCollection").add({
      name: "Jane Doe",
      age: 25,
    });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test Firestore - Read documents
app.get("/get-docs", async (req, res) => {
  try {
    const snapshot = await db.collection("testCollection").get();
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(docs);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
