const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { messaging } = require("./firebaseAdmin"); // Import Firebase Admin SDK
const { generateInsight, detectAnomalies } = require("./vertexAI");

require("dotenv").config();
const cors = require("cors");

const espClients = new Map(); // Stores active ESP32 WebSocket connections

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create an Express app
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

const userTokens = new Map(); // Use a Map for better performance

// Create an HTTP server
const server = http.createServer(expressApp);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   ws.on("message", async (message) => {
//     console.log(`Received raw message: ${message}`);

//     try {
//       // Parse the message as JSON
//       const newData = JSON.parse(message);

//       // Add timestamp to the data
//       newData.timestamp = new Date().toISOString();

//       // Store data in Firestore
//       try {
//         const docRef = await addDoc(collection(db, "sensorData"), newData);
//         console.log("Data stored in Firestore with ID:", docRef.id);
//       } catch (error) {
//         console.error("Error storing data in Firestore:", error);
//       }

//       // Broadcast the message to all connected WebSocket clients
//       wss.clients.forEach((client) => {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(newData));
//         }
//       });
//     } catch (error) {
//       console.error("Invalid JSON received:", error);
//     }
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");

  ws.on("message", async (message) => {
    console.log(`Received: ${message}`);

    try {
      const newData = JSON.parse(message);

      if (newData.device_id) {
        espClients.set(newData.device_id, ws); // Store device WebSocket connection
        console.log(`🔗 ESP32 Connected: ${newData.device_id}`);
      }

      newData.timestamp = new Date().toISOString();

      // Store data in Firestore
      try {
        const docRef = await addDoc(collection(db, "sensorData"), newData);
        console.log("Data stored in Firestore with ID:", docRef.id);
      } catch (error) {
        console.error("Error storing data in Firestore:", error);
      }

      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newData));
        }
      });
    } catch (error) {
      console.error("Invalid JSON received:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    espClients.forEach((client, deviceId) => {
      if (client === ws) {
        espClients.delete(deviceId);
        console.log(`🔴 ESP32 Disconnected: ${deviceId}`);
      }
    });
  });
});

// API to send commands to the ESP32
expressApp.post("/api/send-command", (req, res) => {
  const { device_id, command } = req.body;

  if (!device_id || !command) {
    return res.status(400).json({ error: "Missing device_id or command" });
  }

  const espClient = espClients.get(device_id);
  if (!espClient || espClient.readyState !== WebSocket.OPEN) {
    return res.status(404).json({ error: "ESP32 device is not connected" });
  }

  try {
    const commandMessage = JSON.stringify({ command });
    espClient.send(commandMessage); // Send command to ESP32
    console.log(`✅ Command sent to ${device_id}: ${command}`);
    res.json({ message: `Command '${command}' sent successfully.` });
  } catch (error) {
    console.error("❌ Error sending command:", error);
    res.status(500).json({ error: "Failed to send command" });
  }
});

expressApp.post("/api/save-token", (req, res) => {
  const { userId, token } = req.body;
  if (userId && token) {
    userTokens.set(userId, token);
    console.log(`✅ Saved FCM token for user ${userId}: ${token}`);
    return res.status(200).send({ success: true });
  }
  res.status(400).send({ error: "Invalid userId or token" });
});

// API to get stored tokens
expressApp.get("/api/get-tokens", (req, res) => {
  res.json({ tokens: [...userTokens.values()] });
});

expressApp.post("/api/send-notification", async (req, res) => {
  const { tokens, notification } = req.body;
  if (!tokens?.length) {
    return res.status(400).send({ error: "No tokens provided" });
  }

  try {
    const response = await messaging.sendEachForMulticast({
      notification: { title: notification.title, body: notification.body },
      tokens,
    });
    console.log(`✅ Notification sent: ${response.successCount} successes`);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("❌ Error sending FCM notification:", error);
    res.status(500).send({ error: "Failed to send notification" });
  }
});

// API to get latest AI-generated insight
expressApp.get("/api/insight", async (req, res) => {
  try {
    const insight = await generateInsight();
    res.status(200).json({ insight });
  } catch (error) {
    console.error("❌ Failed to generate AI insight:", error);
    res.status(500).json({ error: "AI insight generation failed" });
  }
});

expressApp.post("/api/detect-anomaly", async (req, res) => {
  try {
    const { voltage, current, power } = req.body;

    if (!voltage || !current || !power) {
      return res.status(400).json({ error: "Missing sensor data fields." });
    }

    const anomalyResult = await detectAnomalies({
      voltage,
      current,
      power,
      timestamp: new Date(),
    });
    res.status(200).json({ success: true, data: anomalyResult });
  } catch (error) {
    console.error("Error detecting anomaly:", error);
    res.status(500).json({ error: "Failed to detect anomaly." });
  }
});

// Periodically generate insights and send them via WebSocket
setInterval(async () => {
  const insight = await generateInsight();
  if (insight) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "insight", insight }));
      }
    });
    console.log(`✅ Insight broadcasted: ${insight}`);
  }
}, 15 * 60 * 1000); // Every 15 minutes

module.exports = { db };

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket listening on ws://localhost:${PORT}`);
});
